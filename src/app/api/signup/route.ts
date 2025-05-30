import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/db";
import ApiResponse from "@/utils/ApiResponse";
import ApiError from "@/utils/ApiError";
import { signupSchema, signupType } from "@/schemas/export.zodschema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Emilys_Candy } from "next/font/google";
import { varible } from "@/schemas/envSchema";
import { sendEmail } from "@/helper/sendMail";
import { emailVarificationFromat } from "@/utils/mailFromats";

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

    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      varible.NEXTAUTH_SECRET
    );

    //update user and send the response to the user along with the accesstoken
    const updateRes = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: accessToken,
      },
    });

    // Send the verification mail with proper error handling
    try {
      const mailFromat = emailVarificationFromat(
        `${varible.NEXT_AUTH_URL}/api/verify-email/${updateRes.accessToken}`
      );
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: mailFromat,
      });
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError);

      // Continue with user creation but notify about email issue
      return NextResponse.json(
        new ApiResponse(
          201, // Still successful signup but with email warning
          {
            userId: user.id,
            name: user.name,
            email: user.email,
          },
          "Account created successfully but verification email could not be sent. Please contact support.",
          true
        )
      );
    }

    // Send the success request
    return NextResponse.json(
      new ApiResponse(
        200,
        {
          userId: user.id,
          name: user.name,
          email: user.email,
        },
        "Signup successful! Please check your email for verification.",
        true
      )
    );
  } catch (error: any) {
    // Log the error for debugging
    console.error("Signup error:", error);

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
        errors: [error.message || "Unknown error occurred"],
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

//check in db the user is exist of not , then check if not then create if yes then send emil is already taken
// if email is not found then create the user, and a token with id and the email, and store it in the db,
