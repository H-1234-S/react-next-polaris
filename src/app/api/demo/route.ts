import { inngest } from "@/inngest/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    await inngest.send({
        name:'demo/minimax',
        data:{}
    })

    return NextResponse.json('ok')
}