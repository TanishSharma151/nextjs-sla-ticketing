'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  getTickets,
} from '@/services/tickets';

import {
  getMe,
} from '@/services/auth';

import {
  Card,
} from '@/components/ui/card';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Input,
} from '@/components/ui/input';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  getPriorityBadgeClass,
  getPriorityLabel,
  getStatusBadgeClass,
} from '@/lib/ticket-utils';

import {
  User,
} from 'lucide-react';

import PaginationControls
  from '@/components/dashboard/pagination-controls';

const TICKETS_PER_PAGE = 8;

type Ticket = {
  id: string;

  title: string;

  status: string;

  priority: string;

  isBreached: boolean;

  requesterId?: string;

  assignedToId?: string;

  requester?: {
    id: string;
    email: string;
  };

  assignedTo?: {
    id: string;
    email: string;
  };
};

export default function DashboardPage() {
  const router =
    useRouter();

  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('ALL');

  const [page, setPage] =
    useState(1);

  const [role, setRole] =
    useState('');

  useEffect(() => {
    let interval:
      NodeJS.Timeout;

    const initialize = async () => {
  try {
    const user = await getMe();

    const currentRole =
      user?.memberships?.[0]?.role;

    setRole(currentRole);

    if (
      currentRole ===
      'CLIENT'
    ) {
      router.push(
        '/my-tickets',
      );

      return;
    }

    const fetchTickets =
      async () => {
        const data =
          await getTickets();

        setTickets(data);
      };

    await fetchTickets();

    interval = setInterval(
      fetchTickets,
      5000,
    );
  } catch (error: any) {
    console.error(
      'GET ME FAILED',
      error?.response?.status,
      error?.response?.data,
    );

    alert(
      `Auth Failed: ${error?.response?.status}`,
    );

    router.push('/login');
  } finally {
    setLoading(false);
  }
};

    initialize();

    return () => {
      if (interval) {
        clearInterval(
          interval,
        );
      }
    };
  }, [router]);

  if (loading) {
    return (
      <div
        className="
          flex h-screen
          items-center
          justify-center
          bg-zinc-50
          text-zinc-500

          dark:bg-zinc-950
          dark:text-zinc-400
        "
      >
        Loading dashboard...
      </div>
    );
  }

  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
        'OPEN',
    ).length;

  const breachedTickets =
    tickets.filter(
      (ticket) =>
        ticket.isBreached,
    ).length;

  const filteredTickets =
    tickets.filter(
      (ticket) => {
        const matchesSearch =
          ticket.title
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            );

        const matchesStatus =
          statusFilter ===
          'ALL'
          ||
          ticket.status ===
          statusFilter;

        return (
          matchesSearch
          &&
          matchesStatus
        );
      },
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredTickets.length /
        TICKETS_PER_PAGE,
      ),
    );

  const paginatedTickets =
    filteredTickets.slice(
      (page - 1) * TICKETS_PER_PAGE,
      page * TICKETS_PER_PAGE,
    );

  return (
    <div
      className="
      min-h-screen
      bg-zinc-50
      text-black

      dark:bg-zinc-950
      dark:text-white
    "
    >
      <div
        className="
        mx-auto
        w-full
        max-w-screen-2xl
        space-y-4
        p-4

        lg:p-6
      "
      >

        {/* HERO */}
        <div
          className="
          relative
          overflow-hidden
          rounded-3xl
          border border-zinc-200
          bg-gradient-to-br
          from-white
          via-zinc-100
          to-zinc-50
          p-5

          lg:p-6

          dark:border-white/10
          dark:from-zinc-900
          dark:via-zinc-950
          dark:to-black
        "
        >
          <div
            className="
            absolute right-0 top-0
            h-64 w-64
            rounded-full
            bg-violet-500/10
            blur-3xl
          "
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <p
                className="
                text-xs
                uppercase
                tracking-[0.25em]
                text-zinc-500
              "
              >
                Overview
              </p>

              <Badge variant="outline">
                {role}
              </Badge>
            </div>

            <h1
              className="
              mt-3
              text-3xl
              font-bold
              tracking-tight

              sm:text-4xl
            "
            >
              Dashboard
            </h1>

            <p
              className="
              mt-3
              max-w-2xl
              text-sm
              text-zinc-600

              dark:text-zinc-400
            "
            >
              Monitor ticket activity,
              SLA performance, and
              support operations
              in real time.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div
          className="
    grid
    grid-cols-3
    gap-3
  "
        >
          {[
            {
              title: 'Total',
              value: tickets.length,
            },
            {
              title: 'Open',
              value: openTickets,
            },
            {
              title: 'Breaches',
              value: breachedTickets,
              danger: true,
            },
          ].map((item) => (
            <Card
              key={item.title}
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
                {item.title}
              </p>

              <h2
                className={`
          mt-2
          text-2xl
          font-bold

          lg:text-5xl

          ${item.danger
                    ? 'text-violet-500'
                    : ''
                  }
        `}
              >
                {item.value}
              </h2>
            </Card>
          ))}
        </div>

        {/* TICKETS */}
        <Card
          className="
          rounded-3xl
          border border-zinc-200
          bg-white
          shadow-sm

          dark:border-white/10
          dark:bg-zinc-900/40
        "
        >
          {/* HEADER */}
          <div
            className="
            flex flex-col
            gap-4
            border-b border-zinc-200
            p-5

            dark:border-white/10

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
          >
            <div>
              <h2
                className="
                text-2xl
                font-semibold
              "
              >
                Recent Tickets
              </h2>

              <p
                className="
                mt-1
                text-sm
                text-zinc-500
              "
              >
                Latest ticket activity
                across your workspace.
              </p>
            </div>

            <div
              className="
              flex flex-col
              gap-3

              sm:flex-row
            "
            >
              <Input
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => {
                  setSearch(
                    e.target.value,
                  );

                  setPage(1);
                }}
              />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(
                    e.target.value,
                  );

                  setPage(1);
                }}
                className="
                h-11
                rounded-xl
                border border-zinc-200
                px-4

                dark:border-white/10
                dark:bg-zinc-950
              "
              >
                <option value="ALL">
                  ALL
                </option>

                <option value="OPEN">
                  OPEN
                </option>

                <option value="IN_PROGRESS">
                  IN PROGRESS
                </option>

                <option value="RESOLVED">
                  RESOLVED
                </option>

                <option value="CLOSED">
                  CLOSED
                </option>
              </select>
            </div>
          </div>

          {/* TICKET ROWS */}
          <div className="px-5">
            {filteredTickets.length > 0 ? (
              <div
                className="
                  divide-y divide-zinc-200

                  dark:divide-white/10
                "
              >
                {paginatedTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() =>
                      router.push(
                        `/tickets/${ticket.id}`,
                      )
                    }
                    className="
                      flex flex-col gap-3
                      cursor-pointer
                      py-5
                      transition-colors
                      duration-150

                      hover:bg-zinc-50

                      dark:hover:bg-white/[0.02]

                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div className="min-w-0">
                      <h3
                        className="
                          truncate
                          text-base
                          font-semibold
                        "
                      >
                        {ticket.title}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-zinc-500
                          "
                      >
                        {ticket.requester?.email ||
                          '-'}
                      </p>
                    </div>

                    <div
                      className="
                        flex flex-wrap
                        items-center
                        gap-2
                      "
                    >
                      <Badge
                        className={getPriorityBadgeClass(
                          ticket.priority,
                        )}
                      >
                        {getPriorityLabel(
                          ticket.priority,
                        )}
                      </Badge>

                      <Badge
                        className={getStatusBadgeClass(
                          ticket.status,
                        )}
                      >
                        {ticket.status.replaceAll(
                          '_',
                          ' ',
                        )}
                      </Badge>

                      <span
                        className="
                          flex items-center
                          gap-1
                          text-sm
                          text-zinc-500
                        "
                      >
                        <User size={14} />

                        {ticket.assignedTo?.email ||
                          'Unassigned'}
                      </span>

                      {ticket.isBreached ? (
                        <Badge
                          className="
                            border-red-500/20
                            bg-red-500/10
                            text-red-500
                          "
                        >
                          Breached
                        </Badge>
                      ) : (
                        <Badge
                          className="
                            border-emerald-500/20
                            bg-emerald-500/10
                            text-emerald-500
                            "
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="
                  py-12
                  text-center
                  text-zinc-500
                "
              >
                No tickets found
              </div>
            )}
          </div>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </Card>
      </div>
    </div>
  );
}