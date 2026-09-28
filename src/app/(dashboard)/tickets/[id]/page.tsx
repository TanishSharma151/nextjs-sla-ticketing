'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import {
  getTicketById,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
  updateSla,
} from '@/services/tickets';

import {
  getMembers,
} from '@/services/organizations';

import {
  createComment,
} from '@/services/comments';

import {
  getMe,
} from '@/services/auth';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Card,
} from '@/components/ui/card';

import {
  Button,
} from '@/components/ui/button';

import {
  Input,
} from '@/components/ui/input';


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  getPriorityBadgeClass,
  getPriorityLabel,
  getStatusBadgeClass,
} from '@/lib/ticket-utils';

import {
  Ticket as TicketIcon,
  User,
  Clock,
  Paperclip,
  PlusCircle,
  UserPlus,
  RefreshCw,
  AlertTriangle,
  Trash2 as Trash2Icon,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

type TicketEvent = {
  id: string;
  type: string;
  metadata?: any;
  createdAt: string;

  actor?: {
    email: string;
  };
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;

  author: {
    email: string;
  };
};

type Ticket = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  isBreached: boolean;
  assignedToId?: string;
  orgId: string;
  events: TicketEvent[];
  comments: Comment[];
  slaDueAt?: string;
  attachmentUrl?: string;
  createdAt?: string;

  assignedTo?: {
    email: string;
  };

  requester?: {
    email: string;
  };
};

type Member = {
  id: string;
  role: string;

  user: {
    id: string;
    email: string;
  };
};

export default function TicketPage() {
  const params =
    useParams();

  const [ticket, setTicket] =
    useState<Ticket | null>(null);

  const [members, setMembers] =
    useState<Member[]>([]);

  const [selectedAssignee, setSelectedAssignee] =
    useState('');

  const [newSlaDueAt, setNewSlaDueAt] =
    useState('');

  const [comment, setComment] =
    useState('');

  const [timeLeft, setTimeLeft] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [role, setRole] =
    useState('');

  const router = useRouter();

  const fetchTicket =
    async () => {
      try {
        const currentUser =
          await getMe();

        const currentRole =
          currentUser
            ?.memberships?.[0]
            ?.role;

        setRole(currentRole);

        const data =
          await getTicketById(
            params.id as string,
          );

        setTicket(data);

        if (currentRole === 'ADMIN') {
          const orgMembers =
            await getMembers(
              data.orgId,
            );

          setMembers(orgMembers);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTicket();
  }, [params.id]);

  useEffect(() => {
    if (!ticket?.slaDueAt)
      return;

    if (ticket.status !== 'OPEN') {
      // SLA clock is paused whenever the ticket isn't
      // OPEN - slaDueAt is frozen server-side until it
      // reopens, so a live countdown here would be
      // misleading.
      setTimeLeft(
        ticket.status === 'RESOLVED'
          ? 'Resolved'
          : ticket.status === 'CLOSED'
            ? 'Closed'
            : 'Paused',
      );

      return;
    }

    const interval =
      setInterval(() => {
        const diff =
          new Date(
            ticket.slaDueAt!,
          ).getTime()
          - Date.now();

        if (diff <= 0) {
          setTimeLeft(
            'SLA Breached',
          );

          return;
        }

        const hours =
          Math.floor(
            diff /
            (1000 * 60 * 60),
          );

        const minutes =
          Math.floor(
            (
              diff %
              (1000 * 60 * 60)
            ) /
            (1000 * 60),
          );

        setTimeLeft(
          `${hours}h ${minutes}m`,
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [ticket]);

  const handleStatusChange =
    async (
      value: string,
    ) => {
      if (!ticket) return;

      try {
        await updateTicketStatus(
          ticket.id,
          value,
        );

        await fetchTicket();
      } catch (error) {
        console.error(error);
      }
    };

  const handleAssign =
    async () => {
      if (
        !selectedAssignee ||
        !ticket
      ) {
        return;
      }

      try {
        await assignTicket(
          ticket.id,
          selectedAssignee,
        );

        setSelectedAssignee('');

        await fetchTicket();
      } catch (error) {
        console.error(error);
      }
    };

  const handleSlaOverride =
    async () => {
      if (
        !newSlaDueAt ||
        !ticket
      ) {
        return;
      }

      try {
        await updateSla(
          ticket.id,
          new Date(newSlaDueAt).toISOString(),
        );

        setNewSlaDueAt('');

        await fetchTicket();
      } catch (error) {
        console.error(error);
      }
    };

  const handleComment =
    async () => {
      if (
        !comment.trim() ||
        !ticket
      ) {
        return;
      }

      try {
        await createComment(
          ticket.id,
          comment,
        );

        setComment('');

        await fetchTicket();
      } catch (error) {
        console.error(error);
      }
    };

  const getEventVisual =
    (type: string) => {
      switch (type) {
        case 'CREATED':
          return {
            Icon: PlusCircle,
            className:
              'bg-violet-500/10 text-violet-500',
          };

        case 'ASSIGNED':
          return {
            Icon: UserPlus,
            className:
              'bg-blue-500/10 text-blue-500',
          };

        case 'STATUS_CHANGED':
          return {
            Icon: RefreshCw,
            className:
              'bg-zinc-500/10 text-zinc-500',
          };

        case 'SLA_BREACHED':
          return {
            Icon: AlertTriangle,
            className:
              'bg-red-500/10 text-red-500',
          };

        case 'SLA_OVERRIDDEN':
          return {
            Icon: Clock,
            className:
              'bg-amber-500/10 text-amber-500',
          };

        case 'DELETED':
          return {
            Icon: Trash2Icon,
            className:
              'bg-red-500/10 text-red-500',
          };

        case 'RESTORED':
          return {
            Icon: RotateCcw,
            className:
              'bg-emerald-500/10 text-emerald-500',
          };

        default:
          return {
            Icon: RefreshCw,
            className:
              'bg-zinc-500/10 text-zinc-500',
          };
      }
    };

  const handleDelete =
    async () => {
      if (!ticket) return;

      const confirmed =
        window.confirm(
          'Move this ticket to trash? You can restore it later from Deleted Tickets.',
        );

      if (!confirmed) return;

      try {
        await deleteTicket(
          ticket.id,
        );

        router.push(
          '/dashboard',
        );
      } catch (error) {
        console.error(error);
      }
    };

  if (loading || !ticket) {
    return (
      <div
        className="
          flex min-h-screen
          items-center
          justify-center
          bg-zinc-100
          text-zinc-500

          dark:bg-zinc-950
          dark:text-zinc-400
        "
      >
        Loading ticket...
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
          space-y-6
          p-4

          lg:p-6
        "
      >

        {/* HEADER */}
        <Card
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
              bg-violet-500/10
              blur-3xl
            "
          />

          <div
            className="
              relative z-10
              flex flex-wrap
              items-start
              gap-4
            "
          >
            <div
              className="
                flex h-14 w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border border-zinc-200
                bg-white/70

                dark:border-white/10
                dark:bg-white/5
              "
            >
              <TicketIcon
                className="
                  h-6 w-6
                  text-black

                  dark:text-zinc-300
                "
              />
            </div>

            <div
              className="
                flex flex-1
                flex-col gap-3
              "
            >
              <div
                className="
                  flex flex-wrap
                  items-center
                  gap-3
                "
              >
                <h1
                  className="
                    text-3xl
                    font-bold
                    tracking-tight
                  "
                >
                  {ticket.title}
                </h1>

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

                <Badge
                  className={getPriorityBadgeClass(
                    ticket.priority,
                  )}
                >
                  {getPriorityLabel(
                    ticket.priority,
                  )}
                </Badge>

                {ticket.isBreached ? (
                  <Badge
                    className="
                      border border-red-500/20
                      bg-red-500/10
                      text-red-500
                    "
                  >
                    SLA Breached
                  </Badge>
                ) : (
                  <Badge
                    className="
                      border border-emerald-500/20
                      bg-emerald-500/10
                      text-emerald-500
                    "
                  >
                    {timeLeft ||
                      'SLA Active'}
                  </Badge>
                )}
              </div>

              <p
                className="
                  max-w-4xl
                  text-sm
                  leading-7
                  text-zinc-600

                  dark:text-zinc-400
                "
              >
                {ticket.description}
              </p>

              <div
                className="
                  flex flex-wrap
                  items-center
                  gap-4
                  text-xs
                  text-zinc-500
                "
              >
                <span
                  className="
                    flex items-center
                    gap-1.5
                  "
                >
                  <User size={13} />

                  Requested by{' '}
                  {ticket.requester?.email ||
                    'Unknown'}
                </span>

                {ticket.createdAt && (
                  <span
                    className="
                      flex items-center
                      gap-1.5
                    "
                  >
                    <Clock size={13} />

                    Created{' '}
                    {new Date(
                      ticket.createdAt,
                    ).toLocaleString()}
                  </span>
                )}
              </div>

              {ticket.attachmentUrl && (
                <a
                  href={
                    ticket.attachmentUrl
                  }
                  target="_blank"
                  className="
                    flex w-fit
                    items-center
                    gap-2
                    rounded-xl
                    border border-zinc-200
                    bg-white/70
                    px-4 py-2
                    text-sm
                    transition-all
                    hover:bg-white

                    dark:border-white/10
                    dark:bg-white/[0.04]
                    dark:hover:bg-white/[0.08]
                  "
                >
                  <Paperclip size={14} />

                  View Attachment
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* MAIN GRID */}
        <div
          className="
            grid gap-5
            xl:grid-cols-[1fr_350px]
          "
        >

          {/* LEFT */}
          <div className="space-y-5">

            {/* COMMENTS */}
            <Card
              className="
                rounded-3xl
                border border-zinc-200
                bg-white
                p-6
                shadow-sm

                dark:border-white/10
                dark:bg-zinc-900/40
              "
            >
              <div className="mb-5">
                <h2
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  Comments
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-zinc-600

                    dark:text-zinc-400
                  "
                >
                  Team discussion
                  and updates
                </p>
              </div>

              <div
                className="
                  flex flex-col gap-3
                  sm:flex-row
                "
              >
                <Input
                  value={comment}
                  onChange={(e) =>
                    setComment(
                      e.target.value,
                    )
                  }
                  placeholder="Write a comment..."
                  className="
                    h-11
                    border-zinc-200
                    bg-zinc-50

                    dark:border-white/10
                    dark:bg-zinc-950
                  "
                />

                <Button
                  onClick={
                    handleComment
                  }
                  className="
                    h-11
                    rounded-xl
                    bg-black
                    px-6
                    text-white

                    hover:bg-zinc-800

                    dark:bg-white
                    dark:text-black
                  "
                >
                  Send
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                {ticket.comments.map(
                  (comment) => (
                    <div
                      key={
                        comment.id
                      }
                      className="
                        rounded-2xl
                        border border-zinc-200
                        bg-zinc-50
                        p-4

                        dark:border-white/10
                        dark:bg-black/20
                      "
                    >
                      <div
                        className="
                          flex items-center
                          justify-between
                        "
                      >
                        <p className="font-medium">
                          {
                            comment
                              .author
                              .email
                          }
                        </p>

                        <p
                          className="
                            text-xs
                            text-zinc-500
                          "
                        >
                          {new Date(
                            comment.createdAt,
                          ).toLocaleString()}
                        </p>
                      </div>

                      <p
                        className="
                          mt-3
                          text-sm
                          leading-6
                          text-zinc-700

                          dark:text-zinc-300
                        "
                      >
                        {
                          comment.content
                        }
                      </p>
                    </div>
                  ),
                )}
              </div>
            </Card>

            {/* ACTIVITY */}
            <Card
              className="
                rounded-3xl
                border border-zinc-200
                bg-white
                p-6
                shadow-sm

                dark:border-white/10
                dark:bg-zinc-900/40
              "
            >
              <div className="mb-6">
                <h2
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  Activity Timeline
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-zinc-600

                    dark:text-zinc-400
                  "
                >
                  Complete ticket
                  history
                </p>
              </div>

              <div className="space-y-4">
                {ticket.events.length >
                  0 ? (
                  ticket.events.map(
                    (
                      event,
                    ) => {
                      const {
                        Icon: EventIcon,
                        className:
                          eventIconClass,
                      } = getEventVisual(
                        event.type,
                      );

                      return (
                      <div
                        key={
                          event.id
                        }
                        className="
                          relative
                          rounded-2xl
                          border border-zinc-200
                          bg-zinc-50
                          p-5

                          dark:border-white/10
                          dark:bg-black/20
                        "
                      >
                        <div
                          className="
                            absolute
                            left-9
                            top-0
                            h-full
                            w-px
                            bg-zinc-200

                            dark:bg-white/10
                          "
                        />

                        <div
                          className="
                            relative z-10
                            flex gap-4
                          "
                        >
                          <div
                            className={`
                              flex h-8 w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              ${eventIconClass}
                            `}
                          >
                            <EventIcon
                              size={15}
                            />
                          </div>

                          <div className="flex-1">
                            <div
                              className="
                                flex flex-col gap-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                              "
                            >
                              <Badge variant="outline">
                                {event.type.replaceAll(
                                  '_',
                                  ' ',
                                )}
                              </Badge>

                              <p
                                className="
                                  text-xs
                                  text-zinc-500
                                "
                              >
                                {new Date(
                                  event.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>

                            <p
                              className="
                                mt-3
                                font-medium
                              "
                            >
                              {event.actor
                                ?.email ||
                                'System'}
                            </p>

                            <p
                              className="
                                mt-1
                                text-sm
                                text-zinc-600

                                dark:text-zinc-400
                              "
                            >
                              {event.type ===
                                'STATUS_CHANGED' &&
                                `Changed status to ${event.metadata?.status}`}

                              {event.type ===
                                'ASSIGNED' &&
                                'Assigned the ticket'}

                              {event.type ===
                                'CREATED' &&
                                'Created the ticket'}

                              {event.type ===
                                'SLA_BREACHED' &&
                                'SLA breached automatically'}

                              {event.type ===
                                'SLA_OVERRIDDEN' &&
                                `Overrode SLA due date to ${new Date(
                                  event.metadata?.newSlaDueAt,
                                ).toLocaleString()}`}

                              {event.type ===
                                'DELETED' &&
                                'Deleted the ticket'}

                              {event.type ===
                                'RESTORED' &&
                                'Restored the ticket from trash'}
                            </p>
                          </div>
                        </div>
                      </div>
                      );
                    },
                  )
                ) : (
                  <div
                    className="
                      rounded-2xl
                      border border-dashed
                      border-zinc-300
                      p-10
                      text-center
                      text-zinc-500

                      dark:border-white/10
                    "
                  >
                    No activity yet
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}

          <Card
            className="
              h-fit
              overflow-visible
              rounded-3xl
              border border-zinc-200
              bg-white
              p-5

              xl:sticky
              xl:top-5

              dark:border-white/10
              dark:bg-zinc-900/40
            "
          >
            <div className="space-y-6">

              {/* ASSIGNED */}
              <div>
                <p
                  className="
                    mb-2
                    flex items-center
                    gap-1.5
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-zinc-500
                  "
                >
                  <User size={12} />
                  Assigned To
                </p>

                <div
                  className="
                    rounded-xl
                    border border-zinc-200
                    bg-zinc-50
                    px-4 py-3
                    text-sm

                    dark:border-white/10
                    dark:bg-zinc-950
                  "
                >
                  {ticket.assignedTo?.email ||
                    'Unassigned'}
                </div>
              </div>

              {/* STATUS */}
              {role !== 'CLIENT' && (
                <div
                  className="
                    relative z-50
                    border-t border-zinc-200
                    pt-6

                    dark:border-white/10
                  "
                >
                  <p
                    className="
                      mb-2
                      flex items-center
                      gap-1.5
                      text-xs
                      font-medium
                      uppercase
                      tracking-wider
                      text-zinc-500
                    "
                  >
                    <RefreshCw size={12} />
                    Update Status
                  </p>

                  <Select
                    value={ticket.status}
                    onValueChange={
                      handleStatusChange
                    }
                  >
                    <SelectTrigger
                      className="
                        h-11
                        w-full
                        border-zinc-200
                        bg-zinc-50

                        dark:border-white/10
                        dark:bg-zinc-950
                      "
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      className="
                        z-[100]
                        border border-zinc-200
                        bg-white

                        dark:border-white/10
                        dark:bg-zinc-950
                      "
                    >
                      <SelectItem value="OPEN">
                        OPEN
                      </SelectItem>

                      <SelectItem value="IN_PROGRESS">
                        IN PROGRESS
                      </SelectItem>

                      <SelectItem value="RESOLVED">
                        RESOLVED
                      </SelectItem>

                      <SelectItem value="CLOSED">
                        CLOSED
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* ASSIGN */}
              {role === 'ADMIN' && (
                <div
                  className="
                    relative z-40
                    border-t border-zinc-200
                    pt-6

                    dark:border-white/10
                  "
                >
                  <p
                    className="
                      mb-2
                      flex items-center
                      gap-1.5
                      text-xs
                      font-medium
                      uppercase
                      tracking-wider
                      text-zinc-500
                      "
                  >
                    <UserPlus size={12} />
                    Assign Ticket
                  </p>

                  <div className="space-y-3">
                    <Select
                      value={selectedAssignee}
                      onValueChange={
                        setSelectedAssignee
                      }
                    >
                      <SelectTrigger
                        className="
                          h-11
                          w-full
                          border-zinc-200
                          bg-zinc-50

                          dark:border-white/10
                          dark:bg-zinc-950
                        "
                      >
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        className="
                          z-[100]
                          border border-zinc-200
                          bg-white

                          dark:border-white/10
                          dark:bg-zinc-950
                        "
                      >
                        {members
                          .filter(
                            (member) =>
                              member.role !==
                              'CLIENT',
                          )
                          .map((member) => (
                            <SelectItem
                              key={
                                member.user.id
                              }
                              value={
                                member.user.id
                              }
                            >
                              {
                                member.user
                                  .email
                              }
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={handleAssign}
                      className="
                        h-11
                        w-full
                        rounded-xl
                        bg-black
                        text-white

                        hover:bg-zinc-800

                        dark:bg-white
                        dark:text-black
                        "
                    >
                      Assign Ticket
                    </Button>
                  </div>
                </div>
              )}

              {/* SLA OVERRIDE */}
              {role === 'ADMIN' && (
                <div
                  className="
                    border-t border-zinc-200
                    pt-6

                    dark:border-white/10
                  "
                >
                  <p
                    className="
                      mb-2
                      flex items-center
                      gap-1.5
                      text-xs
                      font-medium
                      uppercase
                      tracking-wider
                      text-zinc-500
                    "
                  >
                    <Clock size={12} />
                    Override SLA Due Date
                  </p>

                  <div className="space-y-3">
                    <Input
                      type="datetime-local"
                      value={newSlaDueAt}
                      onChange={(e) =>
                        setNewSlaDueAt(
                          e.target.value,
                        )
                      }
                      className="
                        h-11
                        border-zinc-200
                        bg-zinc-50

                        dark:border-white/10
                        dark:bg-zinc-950
                      "
                    />

                    <Button
                      onClick={handleSlaOverride}
                      disabled={!newSlaDueAt}
                      className="
                        h-11
                        w-full
                        rounded-xl
                        bg-black
                        text-white

                        hover:bg-zinc-800

                        dark:bg-white
                        dark:text-black
                      "
                    >
                      Update SLA
                    </Button>
                  </div>
                </div>
              )}

              {role === 'ADMIN' && (
                <div
                  className="
                    rounded-2xl
                    border border-red-500/20
                    bg-red-500/5
                    p-4

                    dark:border-red-500/10
                  "
                >
                  <p
                    className="
                    mb-2
                    flex items-center
                    gap-1.5
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-red-500
                  "
                  >
                    <ShieldAlert size={12} />
                    Danger Zone
                  </p>

                  <p
                    className="
                      mb-3
                      text-xs
                      text-zinc-500
                    "
                  >
                    Moves this ticket to trash. It can be restored
                    or permanently deleted from there later.
                  </p>

                  <Button
                    variant="destructive"
                    className="
                    h-11
                    w-full
                    "
                    onClick={handleDelete}
                  >
                    Delete Ticket
                  </Button>
                </div>
              )}
            </div>


          </Card>
        </div>
      </div>
    </div>
  );
}