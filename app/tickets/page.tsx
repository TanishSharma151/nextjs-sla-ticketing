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
