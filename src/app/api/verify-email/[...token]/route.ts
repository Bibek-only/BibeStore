import { NextResponse, NextRequest } from "next/server";
import { varible } from "@/schemas/envSchema";
import jwt from "jsonwebtoken";
import prisma from "@/db/db";
import ApiResponse from "@/utils/ApiResponse";
import ApiError from "@/utils/ApiError";

// Define the token type based on what was created in signup route
interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string[] } }
) {
  try {
    // Extract token from URL
    const idParams = params.token;
    if (!idParams || idParams.length === 0) {
      throw new ApiError(400, "Verification token is missing");
    }

    const token = idParams[0];
    if (!token) {
      throw new ApiError(400, "Invalid verification token");
    }

    // Verify the JWT token
    let tokenData: TokenPayload;
    try {
      tokenData = jwt.verify(token, varible.NEXTAUTH_SECRET) as TokenPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(401, "Verification token has expired");
      } else {
        throw new ApiError(401, "Invalid verification token");
      }
    }

    // Check if token has the required data
    if (!tokenData.userId || !tokenData.email) {
      throw new ApiError(400, "Invalid token payload");
    }

    // Find the user with the given token
    const user = await prisma.user.findFirst({
      where: {
        id: tokenData.userId,
        email: tokenData.email,
        accessToken: token,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found or already verified");
    }

    if (user.isEmailVerifyed) {
      throw new ApiError(400, "Email already verified");
    }

    // Update user verification status
    const userRes = await prisma.user.update({
      where: {
        id: tokenData.userId,
        email: tokenData.email,
      },
      data: {
        isEmailVerifyed: true,
        accessToken: null,
      },
    });

    // Return success response
    return NextResponse.json(
      new ApiResponse(
        200,
        {
          email: userRes.email,
          isVerified: userRes.isEmailVerifyed,
        },
        "Email verified successfully"
      )
    );
  } catch (error: any) {
    console.error("Email verification error:", error);

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
        message: "Email verification failed",
        errors: [error?.message || "Unknown error occurred"],
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

// get the token , vefify the token in database
// if vefifyend with db update the user varification status delet the access token and , signin the user in the applicaton
