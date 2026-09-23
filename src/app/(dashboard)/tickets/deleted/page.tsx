'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  getDeletedTickets,
  permanentlyDeleteTicket,
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
  Trash2,
  AlertTriangle,
} from 'lucide-react';

import {
  getPriorityLabel,
  getPriorityBadgeClass,
} from '@/lib/ticket-utils';

type DeletedTicket = {
  id: string;
  title: string;
  priority: string;
  deletedAt: string;
  createdAt: string;

  requester?: {
    email: string;
  };

  assignedTo?: {
    email: string;
  };
};

export default function DeletedTicketsPage() {
  const router =
    useRouter();

  const [tickets, setTickets] =
    useState<DeletedTicket[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [confirmingId, setConfirmingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const fetchDeletedTickets =
    async () => {
      try {
        const data =
          await getDeletedTickets();

        setTickets(data);
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    const initialize =
      async () => {
        try {
          setLoading(true);

          const user =
            await getMe();

          const role =
            user?.memberships?.[0]?.role;

          if (role !== 'ADMIN') {
            router.push(
              '/dashboard',
            );

            return;
          }

          await fetchDeletedTickets();
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handlePermanentDelete =
    async (ticketId: string) => {
      if (confirmingId !== ticketId) {
        setConfirmingId(ticketId);

        return;
      }

      try {
        setDeletingId(ticketId);

        await permanentlyDeleteTicket(
          ticketId,
        );

        setTickets((prev) =>
          prev.filter(
            (ticket) =>
              ticket.id !== ticketId,
          ),
        );
      } catch (error) {
        console.error(error);
      } finally {
        setDeletingId(null);
        setConfirmingId(null);
      }
    };

  if (loading) {
    return (
      <div
        className="
          flex h-[80vh]
          items-center
          justify-center
          text-zinc-500
        "
      >
        Loading deleted tickets...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-zinc-100
        text-black

        dark:bg-zinc-950
        dark:text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          space-y-5
          p-5
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
            to-zinc-200
            p-6

            dark:border-white/10
            dark:from-zinc-900
            dark:via-black
            dark:to-zinc-950
          "
        >
          <div
            className="
              absolute right-0 top-0
              h-64 w-64
              rounded-full
              bg-red-500/10
              blur-3xl
            "
          />

          <div className="relative z-10">
            <div
              className="
                flex items-center
                gap-4
              "
            >
              <div
                className="
                  flex h-14 w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border border-zinc-200
                  bg-white/70

                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <Trash2
                  className="
                    h-6 w-6
                    text-black

                    dark:text-zinc-300
                  "
                />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    uppercase
                    tracking-[0.25em]
                    text-zinc-500
                  "
                >
                  Workspace
                </p>

                <h1
                  className="
                    text-4xl
                    font-bold
                    tracking-tight
                    text-black

                    dark:text-white
                  "
                >
                  Deleted Tickets
                </h1>
              </div>
            </div>

            <p
              className="
                mt-4
                max-w-2xl
                text-sm
                text-zinc-600

                dark:text-zinc-400
              "
            >
              Tickets deleted from the workspace land here first.
              Permanently deleting a ticket removes it - and its
              comments and history - for good.
            </p>
          </div>
        </div>

        {/* LIST */}
        <Card
          className="
            overflow-hidden
            rounded-3xl
            border border-zinc-200
            bg-white
            shadow-sm

            dark:border-white/10
            dark:bg-zinc-900/40
            dark:backdrop-blur-xl
          "
        >
          <div
            className="
              border-b border-zinc-200
              px-6 py-5

              dark:border-white/10
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
              "
            >
              Trash
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              {tickets.length} deleted ticket
              {tickets.length === 1 ? '' : 's'}
            </p>
          </div>

          {tickets.length === 0 ? (
            <div
              className="
                px-6 py-16
                text-center
                text-sm
                text-zinc-500
              "
            >
              Nothing in the trash.
            </div>
          ) : (
            <div
              className="
                divide-y
                divide-zinc-200

                dark:divide-white/5
              "
            >
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="
                    flex flex-col
                    gap-4
                    px-6 py-5
                    transition-colors

                    hover:bg-zinc-100

                    dark:hover:bg-white/[0.02]

                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >

                  {/* LEFT */}
                  <div className="min-w-0">
                    <div
                      className="
                        flex flex-wrap
                        items-center
                        gap-2
                      "
                    >
                      <h3
                        className="
                          truncate
                          font-medium
                          text-black

                          dark:text-white
                        "
                      >
                        {ticket.title}
                      </h3>

                      <Badge
                        className={getPriorityBadgeClass(
                          ticket.priority,
                        )}
                      >
                        {getPriorityLabel(
                          ticket.priority,
                        )}
                      </Badge>
                    </div>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-zinc-500
                      "
                    >
                      Requested by{' '}
                      {ticket.requester?.email ||
                        'Unknown'}
                      {' | '}
                      Deleted{' '}
                      {new Date(
                        ticket.deletedAt,
                      ).toLocaleString()}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div
                    className="
                      flex items-center
                      gap-3
                    "
                  >
                    {confirmingId ===
                      ticket.id && (
                        <span
                          className="
                            flex items-center
                            gap-1
                            text-xs
                            text-red-500
                          "
                        >
                          <AlertTriangle
                            size={14}
                          />
                          This can&apos;t be undone
                        </span>
                      )}

                    {confirmingId ===
                      ticket.id && (
                        <button
                          onClick={() =>
                            setConfirmingId(
                              null,
                            )
                          }
                          className="
                            rounded-xl
                            border border-zinc-200
                            px-4 py-2
                            text-sm
                            font-medium
                            text-zinc-600

                            hover:bg-zinc-100

                            dark:border-white/10
                            dark:text-zinc-300

                            dark:hover:bg-white/[0.04]
                          "
                        >
                          Cancel
                        </button>
                      )}

                    <button
                      onClick={() =>
                        handlePermanentDelete(
                          ticket.id,
                        )
                      }
                      disabled={
                        deletingId ===
                        ticket.id
                      }
                      className="
                        flex items-center
                        gap-2
                        rounded-xl
                        border border-red-500/20
                        bg-red-500/10
                        px-4 py-2
                        text-sm
                        font-medium
                        text-red-500
                        transition-colors

                        hover:bg-red-500/20

                        disabled:opacity-50
                      "
                    >
                      <Trash2 size={14} />

                      {deletingId ===
                        ticket.id
                        ? 'Deleting...'
                        : confirmingId ===
                          ticket.id
                          ? 'Confirm Delete'
                          : 'Delete Permanently'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
