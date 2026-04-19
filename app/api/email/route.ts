import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({
    message: "Email webhook is live. Use POST.",
  });
}


export async function POST(request: Request){
    const body = await request.json();

    const { from, subject, text} = body;

    if (!subject || !text){
        return NextResponse.json(
            { message : "Invalid email payload"},
            { status : 400 },
        );
    }

    const priority = subject.toLowerCase().includes("urgent")
    ? "high"
    : "medium";

    const now = Date.now();

    const {data, error} = await supabase.from("tickets").insert([
        {
            title : subject,
            priority,
            status: "open",
            created_at: now,
            due_at: 
                priority === "high"
                    ? now + 2 * 60 * 60 * 1000
                    : now + 8 * 60 * 60 * 1000,
            source : "email",
            requester_email : from,
        },
    ]);

    if (error){
        return NextResponse.json(
            { message: "Failed to create ticket", error},
            { status: 500}
        );
    }

    return NextResponse.json({
        message : "Ticket created from email"
    });
}