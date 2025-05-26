import { NextRequest, NextResponse } from "next/server";
import ApiError from "@/utils/ApiError";

export function GET(request: NextRequest) {
  try {
    // Simulate an error for testing
    throw new ApiError(400, "This is a test error response", [
      "Error detail 1",
      "Error detail 2",
    ]);
  } catch (error) {
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
