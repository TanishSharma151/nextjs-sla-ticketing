'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  getMyTickets,
} from '@/services/tickets';

import {
  Card,
} from '@/components/ui/card';

import {
  Badge,
} from '@/components/ui/badge';

import {
  useRouter,
} from 'next/navigation';

import {
  Clock3,
  Ticket,
} from 'lucide-react';

type TicketType = {
  id: string;

  title: string;

  status: string;

  priority: string;

  createdAt: string;
};

export default function MyTicketsPage() {
  const [tickets, setTickets] =
    useState<TicketType[]>([]);

  const [loading, setLoading] =
    useState(true);

  const router =
    useRouter();

  useEffect(() => {
    const fetchTickets =
      async () => {
        try {
          const data =
            await getMyTickets();

          setTickets(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div
        className="
          flex h-[70vh]
          items-center
          justify-center
          text-zinc-500
        "
      >
        Loading tickets...
      </div>
    );
  }

  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status !==
        'RESOLVED',
    ).length;

  const resolvedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
        'RESOLVED',
    ).length;

  return (
    <div
      className="
        h-[calc(100vh-64px)]
        overflow-hidden
        bg-zinc-100
        text-black

        dark:bg-[#09090B]
        dark:text-white
      "
    >
      <div
        className="
          mx-auto
          flex h-full
          max-w-7xl
          flex-col
          gap-5
          p-5
        "
      >

        {/* HERO */}
        <div
          className="
            relative
            shrink-0
            overflow-hidden
            rounded-3xl
            border border-zinc-200
            bg-white
            px-6 py-6
            shadow-sm

            dark:border-white/10
            dark:bg-gradient-to-br
            dark:from-zinc-900
            dark:via-black
            dark:to-zinc-950
          "
        >
          <div
            className="
              absolute right-0 top-0
              h-40 w-40
              rounded-full
              bg-violet-500/10
              blur-3xl
            "
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3">

              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-2xl
                  border border-zinc-200
                  bg-zinc-50

                  dark:border-white/10
                  dark:bg-white/[0.03]
                "
              >
                <Ticket
                  size={20}
                  className="
                    text-zinc-700

                    dark:text-zinc-300
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.25em]
                    text-zinc-500
                  "
                >
                  Support
                </p>

                <h1
                  className="
                    text-4xl
                    font-bold
                    tracking-tight
                  "
                >
                  My Tickets
                </h1>
              </div>
            </div>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                text-zinc-500

                dark:text-zinc-400
              "
            >
              Track submitted issues,
              monitor ticket progress,
              and review support
              activity.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div
          className="
    grid
    grid-cols-3
    gap-3
    shrink-0
  "
        >
          <Card
            className="
      rounded-2xl
      border border-zinc-200
      bg-white
      p-3

      lg:rounded-3xl
      lg:p-5

      dark:border-white/10
      dark:bg-zinc-900/40
    "
          >
            <p
              className="
        text-[11px]
        text-zinc-500

        lg:text-sm
      "
            >
              Total
            </p>

            <h2
              className="
        mt-2
        text-2xl
        font-bold

        lg:text-4xl
      "
            >
              {tickets.length}
            </h2>
          </Card>

          <Card
            className="
      rounded-2xl
      border border-zinc-200
      bg-white
      p-3

      lg:rounded-3xl
      lg:p-5

      dark:border-white/10
      dark:bg-zinc-900/40
    "
          >
            <p
              className="
        text-[11px]
        text-zinc-500

        lg:text-sm
      "
            >
              Open
            </p>

            <h2
              className="
        mt-2
        text-2xl
        font-bold

        lg:text-4xl
      "
            >
              {openTickets}
            </h2>
          </Card>

          <Card
            className="
      rounded-2xl
      border border-emerald-200
      bg-white
      p-3

      lg:rounded-3xl
      lg:p-5

      dark:border-emerald-500/10
      dark:bg-zinc-900/40
    "
          >
            <p
              className="
        text-[11px]
        text-zinc-500

        lg:text-sm
      "
            >
              Done
            </p>

            <h2
              className="
        mt-2
        text-2xl
        font-bold
        text-emerald-500

        lg:text-4xl

        dark:text-emerald-400
      "
            >
              {resolvedTickets}
            </h2>
          </Card>
        </div>

        {/* TICKETS LIST */}
        <div
          className="
            flex-1
            overflow-y-auto
            pr-1
          "
        >
          <div className="space-y-3">

            {tickets.length === 0 ? (
              <Card
                className="
                  rounded-3xl
                  border border-dashed
                  border-zinc-300
                  bg-white
                  p-10
                  text-center
                  shadow-sm

                  dark:border-white/10
                  dark:bg-zinc-900/30
                "
              >
                <h2
                  className="
                    text-xl
                    font-semibold
                  "
                >
                  No tickets found
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-zinc-500
                  "
                >
                  Your submitted tickets
                  will appear here.
                </p>
              </Card>
            ) : (
              tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  onClick={() =>
                    router.push(
                      `/tickets/${ticket.id}`,
                    )
                  }
                  className="
                    group
                    cursor-pointer
                    rounded-3xl
                    border border-zinc-200
                    bg-white
                    px-5 py-4
                    shadow-sm
                    transition-all
                    duration-200
                    hover:border-violet-300
                    hover:shadow-md

                    dark:border-white/10
                    dark:bg-zinc-900/35
                    dark:backdrop-blur-xl
                    dark:hover:border-white/20
                    dark:hover:bg-white/[0.03]
                  "
                >
                  <div
                    className="
                      flex flex-col
                      gap-4

                      md:flex-row
                      md:items-center
                      md:justify-between
                    "
                  >

                    {/* LEFT */}
                    <div>
                      <h2
                        className="
                          text-lg
                          font-semibold
                          transition-colors
                          group-hover:text-violet-500

                          dark:group-hover:text-violet-300
                        "
                      >
                        {ticket.title}
                      </h2>

                      <div
                        className="
                          mt-2
                          flex items-center
                          gap-2
                          text-sm
                          text-zinc-500
                        "
                      >
                        <Clock3 size={14} />

                        <span>
                          {new Date(
                            ticket.createdAt,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex gap-2">

                      <Badge
                        className="
                          border border-blue-500/20
                          bg-blue-500/10
                          text-blue-600

                          dark:text-blue-300
                        "
                      >
                        {ticket.status}
                      </Badge>

                      <Badge
                        className="
                          border border-zinc-200
                          bg-zinc-100
                          text-zinc-700

                          dark:border-white/10
                          dark:bg-white/[0.04]
                          dark:text-zinc-300
                        "
                      >
                        {ticket.priority}
                      </Badge>

                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}