"use client";

import { useEffect, useState } from "react";

type Ticket = {
  id: number;
  title: string;
  priority: string;
  status: string;
  sla: {
    remainingMs: number;
    isBreached: boolean;
    paused?: boolean;
  };
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await fetch("/api/tickets");
        const data = await res.json();
        setTickets(data.tickets);
      } catch (err) {
        console.error("Failed to load tickets", err);
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  async function createTicket(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, priority }),
    });

    if (!res.ok) {
      alert("Failed to create ticket");
      return;
    }

    const refreshed = await fetch("/api/tickets");
    const data = await refreshed.json();

    setTickets(Array.isArray(data.tickets) ? data.tickets : []);
    setTitle("");
    setPriority("low");
  }

  async function updateStatus(id: number, status: string) {
    const res = await fetch("/api/tickets",{
      method : "PATCH",
      headers: {
        "Content-type" : "application/json",
      },
      body : JSON.stringify({ id, status}),
    });

    if (!res.ok){
      alert("Faile to update status");
    }

    const data = await res.json();

    setTickets((prev) =>
      prev.map((t) => (t.id === id ? {
        ...t, 
        status : data.ticket.status,
      }
      : t
    ))
    );
  }

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading tickets...</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Tickets</h1>

      <form onSubmit={createTicket} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Ticket title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginRight: "1rem" }}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ marginRight: "1rem" }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit">Create Ticket</button>
      </form>

      {Array.isArray(tickets) && tickets.length === 0 && (<p>No tickets found</p>)}


      <ul>
        {tickets.map((ticket) => (
          <li 
            key={ticket.id} 
            style={{ 
              marginBottom: "1.25rem",
              padding : "1rem",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              backgroundColor: "#0f0f0f",
            }}>
            <div style={{ fontSize: "1.05rem", fontWeight: "600"}}>
              {ticket.title}
            </div>
            <div style={{ marginTop: "0.25rem", fontSize: "0.9rem", color: "#d1d5db"}}>
              Priority: {ticket.priority}
            </div>
            <div>Status: {ticket.status}</div>
            <div>
              SLA Remaining:{" "}
              {Math.max(
                0,
                Math.floor(ticket.sla.remainingMs / 60000)
              )}{" "}
              minutes
            </div>
            <div>
              Breached: {ticket.sla.isBreached ? "Yes" : "No"}
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <button onClick={() => updateStatus(ticket.id, "open")} style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #374151", background: "transparent", color: "#e5e7eb",}}>
                Open
              </button>

              <button onClick={() => updateStatus(ticket.id, "in_progress")} style={{padding: "0.25rem 0.5rem",borderRadius: "4px",border: "1px solid #374151",background: "transparent", color: "#e5e7eb",
  }}>
                In Progress
              </button>

              <button onClick={() => updateStatus(ticket.id, "resolved")} style={{padding: "0.25rem 0.5rem",borderRadius: "4px",border: "1px solid #374151",background: "transparent",color: "#e5e7eb",}}>
                Resolved
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
