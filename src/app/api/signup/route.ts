import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import ApiResponse from "@/utils/ApiResponse";
import ApiError from "@/utils/ApiError";
import { signupSchema, signupType } from "@/schemas/export.zodschema";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validateData = signupSchema.safeParse(body);
    if (!validateData.success) {
      throw new ApiError(400, validateData.error.message);
    }

    const data: signupType = body;

    const emailRes = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (emailRes) {
      throw new ApiError(400, "Email is already taken");
    }
    const hashPassword = bcrypt.hashSync(data.password, 3);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword,
      },
    });

    //send the success request
    return NextResponse.json(
      new ApiResponse(
        200,
        {
          userId: user.id,
          name: user.name,
          email: user.email,
        },
        "Signup successfull",
        true
      )
    );
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: error.success,
          message: error.message,
          errors: error.errors,
          statusCode: error.statusCode,
        },
        { status: error.statusCode }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        errors: [],
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

//check in db the user is exist of not , then check if not then create if yes then send emil is already taken
