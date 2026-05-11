import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail } from "@/app/api/lib/email";

type Ticket = {
  requester_email: string;
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  dueAt: string;
}

function computeSLA(ticket: Ticket) {
  const now = Date.now();
  const due = new Date(ticket.dueAt).getTime();
  const remainingMs = due - now;

  return {
    remainingMs,
    isBreached: remainingMs <= 0,
    paused: ticket.status !== "open",
  };
}

const SLA_DURATION: Record<Ticket["priority"], number> = {
  low: 24 * 60 * 60 * 1000,
  medium: 8 * 60 * 60 * 1000,
  high: 2 * 60 * 60 * 1000,
};

// const VALID_PRIORITIES = ["low", "medium", "high"] as const;

// if (!VALID_PRIORITIES.includes(priority)) {
//   return NextResponse.json({ message: "Invalid priority" }, { status: 400 });
// }

type Priority = Ticket["priority"];

function isPriority(value: any): value is Priority {
  return ["low", "medium", "high"].includes(value);
}

export async function POST(request: Request) {
  const { title, priority, email } = await request.json();

  if (!title || !priority || !email) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  if (!isPriority(priority)) {
    return NextResponse.json({ message: "Invalid priority" }, { status: 400 });
  }

  const now = new Date();

  const { data, error } = await supabase
    .from("tickets")
    .insert([
      {
        title,
        priority,
        status: "open",
        created_at: now.toISOString(),
        due_at: new Date(now.getTime() + SLA_DURATION[priority]).toISOString(),
        requester_email: email,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: "Database error", error }, { status: 500 });
  }

  try {
    await sendEmail({
      to: email,
      subject: "Ticket Created",
      text: `Your ticket "${title}" has been created with priority ${priority}.`,
    });
  } catch (err) {
    console.error("Email failed:", err);
  }

  return NextResponse.json({ ticket: data }, { status: 201 });
}

export async function GET() {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ message: "Database error", error }, { status: 500 });
  }

  const tickets = data.map((row) => {
    const ticket: Ticket = {
      requester_email: row.requester_email,
      id: row.id,
      title: row.title,
      priority: row.priority,
      status: row.status,
      createdAt: row.created_at,
      dueAt: row.due_at,
    };

    return {
      ...ticket,
      sla: computeSLA(ticket),
    };
  });

  return NextResponse.json({ tickets });
}

type Status = Ticket["status"];

function isStatus(value: any): value is Status {
  return ["open", "in_progress", "resolved", "closed"].includes(value);
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json({ message: "id and status required" }, { status: 400 });
  }

  if (!isStatus(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tickets")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: "Database error", error }, { status: 500 });
  }

  try {
    await sendEmail({
      to: data.requester_email,
      subject: "Ticket Updated",
      text: `Your ticket "${data.title}" status is now ${status}.`,
    });
  } catch (err) {
    console.error("Email failed:", err);
  }

  return NextResponse.json({ ticket: data });
}
