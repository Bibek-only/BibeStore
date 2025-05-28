import { NextRequest,NextResponse } from "next/server"
import prisma from "@/db/db"

export async function GET(){

    try {
        const res = await  prisma.user.create({
            data:{
                name: "bibek samal",
                email: "bibekbibek966@gmail.com"
            }
        })

        if(res){
            return NextResponse.json({
            success:false
        })
        }

        return NextResponse.json({
            success:false
        })
    } catch (error) {
        
        return NextResponse.json({
            success:false
        })
    }
}