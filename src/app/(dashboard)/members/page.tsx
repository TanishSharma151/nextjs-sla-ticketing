'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  getMembers,
  updateMemberRole,
  getOrgId,
} from '@/services/organizations';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Shield,
  Users,
} from 'lucide-react';

type Member = {
  id: string;

  role: string;

  user: {
    id: string;
    email: string;
  };
};

export default function MembersPage() {
  const router =
    useRouter();

  const [members, setMembers] =
    useState<Member[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [orgId, setOrgId] =
    useState<string>('');

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

          const currentOrgId =
            getOrgId(user);

          if (!currentOrgId) {
            console.error(
              'No organization found',
            );

            return;
          }

          setOrgId(currentOrgId);

          const data =
            await getMembers(
              currentOrgId,
            );

          setMembers(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    initialize();
  }, [router]);

  const fetchMembers =
    async () => {
      try {
        const data =
          await getMembers(orgId);

        setMembers(data);
      } catch (error) {
        console.error(error);
      }
    };

  const handleRoleChange =
    async (
      memberId: string,
      role: string,
    ) => {
      try {
        setUpdatingId(memberId);

        setMembers((prev) =>
          prev.map((member) =>
            member.id === memberId
              ? {
                ...member,
                role,
              }
              : member,
          ),
        );

        await updateMemberRole(
          orgId,
          memberId,
          role,
        );
      } catch (error) {
        console.error(error);

        fetchMembers();
      } finally {
        setUpdatingId(null);
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
        Loading members...
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
              bg-violet-500/10
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
                <Users
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
                  Members
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
              Manage organization access,
              permissions, and team roles.
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
          <Card
            className="
      rounded-2xl
      border border-zinc-200
      bg-white
      p-3

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
              Members
            </p>

            <h2
              className="
        mt-2
        text-2xl
        font-bold

        lg:text-4xl
      "
            >
              {members.length}
            </h2>
          </Card>

          <Card
            className="
      rounded-2xl
      border border-zinc-200
      bg-white
      p-3

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
              Admins
            </p>

            <h2
              className="
        mt-2
        text-2xl
        font-bold
        text-violet-500

        lg:text-4xl
      "
            >
              {
                members.filter(
                  (member) =>
                    member.role === 'ADMIN',
                ).length
              }
            </h2>
          </Card>

          <Card
            className="
      rounded-2xl
      border border-zinc-200
      bg-white
      p-3

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
              Agents
            </p>

            <h2
              className="
        mt-2
        text-2xl
        font-bold
        text-blue-500

        lg:text-4xl
      "
            >
              {
                members.filter(
                  (member) =>
                    member.role === 'AGENT',
                ).length
              }
            </h2>
          </Card>
        </div>

        {/* MEMBERS LIST */}
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
              Team Members
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              Update member roles and
              manage permissions.
            </p>
          </div>

          <div
            className="
              divide-y
              divide-zinc-200

              dark:divide-white/5
            "
          >
            {members.map((member) => (
              <div
                key={member.id}
                className="
                  flex flex-col
                  gap-5
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
                <div
                  className="
                    flex items-center
                    gap-4
                  "
                >
                  <div
                    className="
                      flex h-12 w-12
                      items-center
                      justify-center
                      rounded-2xl
                      border border-zinc-200
                      bg-zinc-100

                      dark:border-white/10
                      dark:bg-white/5
                    "
                  >
                    <Shield
                      className="
                        h-5 w-5
                        text-zinc-700

                        dark:text-zinc-300
                      "
                    />
                  </div>

                  <div>
                    <h3
                      className="
                        font-medium
                        text-black

                        dark:text-white
                      "
                    >
                      {member.user.email}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-zinc-500
                      "
                    >
                      Organization member
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div
                  className="
                    flex items-center
                    gap-4
                  "
                >
                  <Badge
                    className={
                      member.role ===
                        'ADMIN'
                        ? `
                          border border-violet-500/20
                          bg-violet-500/10
                          text-violet-500
                        `
                        : member.role ===
                          'AGENT'
                          ? `
                          border border-blue-500/20
                          bg-blue-500/10
                          text-blue-500
                        `
                          : `
                          border border-emerald-500/20
                          bg-emerald-500/10
                          text-emerald-500
                        `
                    }
                  >
                    {member.role}
                  </Badge>

                  <Select
                    value={member.role}
                    onValueChange={(value) =>
                      handleRoleChange(
                        member.id,
                        value,
                      )
                    }
                  >
                    <SelectTrigger
                      className="
                        h-11
                        w-[180px]
                        rounded-xl
                        border-zinc-200
                        bg-zinc-50
                        text-black

                        dark:border-white/10
                        dark:bg-zinc-950
                        dark:text-white
                      "
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      className="
                        border border-zinc-200
                        bg-white
                        text-black

                        dark:border-white/10
                        dark:bg-zinc-950
                        dark:text-white
                      "
                    >
                      <SelectItem value="ADMIN">
                        ADMIN
                      </SelectItem>

                      <SelectItem value="AGENT">
                        AGENT
                      </SelectItem>

                      <SelectItem value="CLIENT">
                        CLIENT
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {updatingId ===
                    member.id && (
                      <span
                        className="
                        text-sm
                        text-zinc-500
                      "
                      >
                        Updating...
                      </span>
                    )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}