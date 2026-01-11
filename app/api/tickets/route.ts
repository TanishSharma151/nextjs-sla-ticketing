import { NextResponse } from "next/server";

let tickets : {
    id : number;
    title : string;
    priority : string;
}[] = [];

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

    const newTicket = {
        id: tickets.length + 1,
        title,
        priority,    
    };

    tickets.push(newTicket);

    return NextResponse.json({
        message : "Ticket created",
        ticket : newTicket
    },
    { status : 201}
    );
}

export async function GET() {
    return NextResponse.json({
        tickets,
    });
}