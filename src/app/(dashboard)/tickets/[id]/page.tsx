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
  getPriorityVariant,
  getStatusVariant,
} from '@/lib/ticket-utils';

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

        const orgMembers =
          await getMembers(
            data.orgId,
          );

        setMembers(orgMembers);
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

  const handleDelete =
    async () => {
      if (!ticket) return;

      const confirmed =
        window.confirm(
          'Delete this ticket permanently?',
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
            rounded-3xl
            border border-zinc-200
            bg-white
            p-6

            dark:border-white/10
            dark:bg-zinc-900/40
          "
        >
          <div className="flex flex-col gap-5">

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
                variant={getStatusVariant(
                  ticket.status,
                )}
              >
                {ticket.status}
              </Badge>

              <Badge
                variant={getPriorityVariant(
                  ticket.priority,
                )}
              >
                {ticket.priority}
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

            {ticket.attachmentUrl && (
              <a
                href={
                  ticket.attachmentUrl
                }
                target="_blank"
                className="
                  w-fit
                  rounded-xl
                  border border-zinc-200
                  bg-zinc-100
                  px-4 py-2
                  text-sm
                  transition-all
                  hover:bg-zinc-200

                  dark:border-white/10
                  dark:bg-white/[0.04]
                  dark:hover:bg-white/[0.08]
                "
              >
                View Attachment
              </a>
            )}
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
                    ) => (
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
                            left-7
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
                            className="
                              mt-1
                              h-3 w-3
                              rounded-full
                              bg-black

                              dark:bg-white
                            "
                          />

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
                            </p>
                          </div>
                        </div>
                      </div>
                    ),
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
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-zinc-500
                  "
                >
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
                  {ticket.assignedToId
                    ? members.find(
                      (member) =>
                        member.user.id ===
                        ticket.assignedToId,
                    )?.user.email
                    : 'Unassigned'}
                </div>
              </div>

              {/* STATUS */}
              {role !== 'CLIENT' && (
                <div className="relative z-50">
                  <p
                    className="
                      mb-2
                      text-xs
                      font-medium
                      uppercase
                      tracking-wider
                      text-zinc-500
                    "
                  >
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
                <div className="relative z-40">
                  <p
                    className="
                      mb-2
                      text-xs
                      font-medium
                      uppercase
                      tracking-wider
                      text-zinc-500
                      "
                  >
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

              {role === 'ADMIN' && (
                <div>
                  <p
                    className="
                    mb-2
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider
                    text-zinc-500
                  "
                  >
                    Danger Zone
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