import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "@/utils/ApiResponse";

export function GET(request: NextRequest) {
  // Create production-ready health check with system info
  

  return NextResponse.json(
    new ApiResponse(200,null,"hello",true)
  );
}
