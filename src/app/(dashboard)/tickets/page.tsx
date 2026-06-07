"use client";

import { useEffect, useState } from "react";

type Ticket = {
  id: number;
  title: string;
  requester_email: string;
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
  const [email, setEmail] = useState("");
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
      body: JSON.stringify({ title, priority, email }),
    });

    if (!res.ok) {
      alert("Failed to create ticket");
      return;
    }

    const refreshed = await fetch("/api/tickets");
    const data = await refreshed.json();

    setTickets(Array.isArray(data.tickets) ? data.tickets : []);

    setEmail("");
    setTitle("");
    setPriority("low");
  }

  async function updateStatus(id: number, status: string) {
    const res = await fetch("/api/tickets", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    if (!res.ok) {
      alert("Failed to update status");
      return;
    }

    const refreshed = await fetch("/api/tickets");
    const data = await refreshed.json();

    setTickets(Array.isArray(data.tickets) ? data.tickets : []);
  }

  function getPriorityColor(priority: string) {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-400 border-red-500/40 bg-red-500/10";

      case "medium":
        return "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";

      default:
        return "text-green-400 border-green-500/40 bg-green-500/10";
    }
  }

  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case "resolved":
        return "text-green-400 bg-green-500/10 border-green-500/40";

      case "in_progress":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/40";

      case "closed":
        return "text-zinc-300 bg-zinc-700/20 border-zinc-600";

      default:
        return "text-blue-400 bg-blue-500/10 border-blue-500/40";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-black dark:text-white">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-black dark:text-white px-4 py-8 md:px-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            SLA Ticket Dashboard
          </h1>

          <p className="text-zinc-400 mt-3 text-sm md:text-base">
            Manage tickets, SLA status, and priorities.
          </p>
        </div>

        <form
          onSubmit={createTicket}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10"
        >

          <input
            type="email"
            placeholder="Requester email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600"
          />

          <input
            type="text"
            placeholder="Ticket title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-zinc-600"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <button
            type="submit"
            className="bg-white text-black rounded-xl px-6 py-3 font-semibold hover:opacity-90 transition"
          >
            Create Ticket
          </button>

        </form>

        {tickets.length === 0 && (
          <div className="text-zinc-400">
            No tickets found.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-2xl border border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl"
            >

              <div className="flex items-start justify-between gap-4 mb-5">

                <div>
                  <h2 className="text-2xl font-semibold">
                    {ticket.title}
                  </h2>

                  <p className="text-zinc-400 text-sm mt-1 break-all">
                    {ticket.requester_email}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs border ${getPriorityColor(ticket.priority)}`}
                >
                  {ticket.priority.toUpperCase()}
                </span>

              </div>

              <div className="space-y-3 text-sm md:text-base">

                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-300">
                    Status:
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-zinc-300">
                    SLA Remaining:
                  </span>{" "}
                  {Math.max(
                    0,
                    Math.floor(ticket.sla.remainingMs / 60000)
                  )} minutes
                </div>

                <div>
                  <span className="font-medium text-zinc-300">
                    Breached:
                  </span>{" "}
                  {ticket.sla.isBreached ? (
                    <span className="text-red-400">Yes</span>
                  ) : (
                    <span className="text-green-400">No</span>
                  )}
                </div>

              </div>

              <div className="flex flex-wrap gap-3 mt-6">

                <button
                  onClick={() => updateStatus(ticket.id, "open")}
                  className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                >
                  Open
                </button>

                <button
                  onClick={() =>
                    updateStatus(ticket.id, "in_progress")
                  }
                  className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                >
                  In Progress
                </button>

                <button
                  onClick={() => updateStatus(ticket.id, "resolved")}
                  className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                >
                  Resolved
                </button>

                <button
                  onClick={() => updateStatus(ticket.id, "closed")}
                  className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                >
                  Closed
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}