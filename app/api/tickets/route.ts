import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Ticket = {
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved";
  createdAt: number;
  dueAt: number;
};

function computeSLA(ticket: Ticket){
    if (ticket.status !== "open"){
      return{
        remainingMs : ticket.dueAt - ticket.createdAt,
        isBreached: false,
        paused: true,
      };
    }

    const now = Date.now();
    const remainingMs = ticket.dueAt - now;

    return {
      remainingMs,
      IsBreached: remainingMs <= 0,
      paused : false,
    };
}

const SLA_DURATION: Record<Ticket["priority"], number> = {
  low: 24 * 60 * 60 * 1000,    // 24h
  medium: 8 * 60 * 60 * 1000, // 8h
  high: 2 * 60 * 60 * 1000,   // 2h
};

export async function POST(request: Request) {
  const body = await request.json();
  //const { title, priority } = body;
  const { title, priority }: { title: string; priority: Ticket["priority"] } = body;


  if (!title) {
    return NextResponse.json(
      { message: "Title required" },
      { status: 400 }
    );
  }

  if (!priority) {
    return NextResponse.json(
      { message: "Priority required" },
      { status: 400 }
    );
  }

  if (!["low", "medium", "high"].includes(priority)) {
    return NextResponse.json(
      { message: "Invalid priority" },
      { status: 400 }
    );
  }

  const now = Date.now();

  const { data, error} = await supabase.from("tickets").insert([
    {
    title,
    priority,
    status: "open",
    created_at: now,
    due_at:now + SLA_DURATION[priority], 
    },
  ])
  .select()
  .single();

  if (error) {
    return NextResponse.json(
      { message : "Database error", error},
      { status : 500}
    );
  }

  return NextResponse.json(
    {
      message: "Ticket created",
      ticket: data,
    },
    { status : 201}
  );

}

export async function GET() {
  const {data, error} = await supabase
  .from("tickets")
  .select("*")
  .order("id", {ascending : true});

  if(error){
    return NextResponse.json(
      {message : "Database error", error},
      {status : 500}
    );
  }
  
  const enrichedTickets = data.map((row) => {
    const ticket: Ticket = {
      id: row.id,
      title: row.title,
      priority: row.priority,
      status: row.status,
      createdAt: row.created_at,
      dueAt: row.due_at,
    };

    return{
      ...ticket,
      sla: computeSLA(ticket),
    };
  });

  return NextResponse.json({
      tickets: enrichedTickets,
    })

}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json(
      { message: "id and status required" },
      { status: 400 }
    );
  }

  if (!["open", "in_progress", "resolved"].includes(status)) {
    return NextResponse.json(
      { message: "Invalid status" },
      { status: 400 }
    );
  }

  const {data,error} = await supabase
  .from("tickets")
  .update({status})
  .eq("id", id)
  .select()
  .single();

  if (error) {
    return NextResponse.json(
      { message: "Database error", error },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { message: "Ticket not found"},
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Status updated",
    ticket: data,
  });
}
