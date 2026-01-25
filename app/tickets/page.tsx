import { useEffect, useState } from "react";

"use client";

const [title, setTitle] = useState("");
const [priority, setPriority] = useState("low");

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

async function createTicket(e: React.FormEvent) {
  e.preventDefault();

  const res = await fetch("/api/tickets",{
    method: "POST",
    headers: {
      "Content-Type" : 'application/json',
    },
    body: JSON.stringify({ title, priority}),
  });

  if (!res.ok){
    alert("Failed to create ticket");
  }

  const data = await res.json();

  setTickets((prev) => [...prev, data.ticket]);
  setTitle("");
  setPriority("low");
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading tickets...</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Tickets</h1>

      {tickets.length === 0 && <p>No tickets found</p>}

      <form onSubmit={createTicket} style={{ marginBottom: "2rem"}}>

        <input type="text" placeholder="Ticket title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{marginRight : "1rem" }}/>

        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ marginRight: "1rem" }}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit">Create Ticket</button>
      </form>

      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id} style={{ marginBottom: "1rem" }}>
            <strong>{ticket.title}</strong>
            <div>Priority: {ticket.priority}</div>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
