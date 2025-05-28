import { NextResponse, NextRequest } from "next/server";
import ApiResponse from "@/utils/ApiResponse";
import ApiError from "@/utils/ApiError";
import imagekit from "@/utils/imageKit";

export async function POST(req: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new ApiError(400, "No file uploaded");
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = file.name;

    // Upload file to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      useUniqueFileName: true,
      tags: ["upload-api"],
    });

    // Return success response with file data
    return NextResponse.json(
      new ApiResponse(
        201,
        {
          url: uploadResponse.url,
          fileId: uploadResponse.fileId,
        },
        "File uploaded successfully"
      )
    );
  } catch (error: any) {
    console.error("Error uploading file:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload file",
        errors: [error?.message],
      },
      { status: 500 }
    );
  }
}
