import { NextResponse } from "next/server";

export async function POST(request : Request) {
    const body = await request.json();
    const {title, priority} = body;

    if (!title){
        return NextResponse.json(
            {message:"Title required"},
            {status : 400}
        )
    }

    if(!priority){
        return NextResponse.json(
            {message : "Priority required"},
            {status : 400}
        )
    }

    if(!["low", "medium", "high"].includes(priority)){
        return NextResponse.json(
            { message : "Invalid priority"},
            {status : 400}
        )
    }

    return NextResponse.json({
        message : "Ticket created",
        ticket : {
            title, 
            priority,
        },
    },
    { status : 201}
    );
}

export async function GET() {
  return NextResponse.json({ message: "tickets api alive" });
}
