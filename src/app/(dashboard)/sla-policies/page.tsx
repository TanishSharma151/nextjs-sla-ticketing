'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import {
  getPolicies,
  createPolicy,
} from '@/services/sla';

import {
  getMe,
} from '@/services/auth';

import {
  getOrgId,
} from '@/services/organizations';

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
  Button,
} from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  ShieldCheck,
  TimerReset,
  AlarmClock,
} from 'lucide-react';

type Policy = {
  id: string;

  name: string;

  priority: string;

  responseTimeHours: number;

  resolutionTimeHours: number;
};

export default function SlaPoliciesPage() {
  const router =
    useRouter();

  const [policies, setPolicies] =
    useState<Policy[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [orgId, setOrgId] =
    useState<string>('');

  const [name, setName] =
    useState('');

  const [priority, setPriority] =
    useState('LOW');

  const [
    responseTimeHours,
    setResponseTimeHours,
  ] = useState('');

  const [
    resolutionTimeHours,
    setResolutionTimeHours,
  ] = useState('');

  useEffect(() => {
    const init =
      async () => {
        try {
          setLoading(true);

          const user =
            await getMe();

          if (
            user?.memberships?.[0]
              ?.role !== 'ADMIN'
          ) {
            router.push(
              '/dashboard',
            );

            return;
          }

          const fetchedOrgId =
            getOrgId(user);

          if (!fetchedOrgId) {
            console.error(
              'No orgId found',
            );

            return;
          }

          setOrgId(
            fetchedOrgId,
          );

          const data =
            await getPolicies(
              fetchedOrgId,
            );

          setPolicies(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    init();
  }, [router]);

  const handleCreate =
    async () => {
      try {
        setCreating(true);

        const newPolicy =
          await createPolicy({
            name,

            priority,

            responseTimeHours:
              Number(
                responseTimeHours,
              ),

            resolutionTimeHours:
              Number(
                resolutionTimeHours,
              ),

            organizationId:
              orgId,
          });

        setPolicies((prev) => [
          newPolicy,
          ...prev,
        ]);

        setName('');
        setPriority('LOW');
        setResponseTimeHours('');
        setResolutionTimeHours('');
      } catch (error) {
        console.error(error);
      } finally {
        setCreating(false);
      }
    };

  const totalPolicies =
    policies.length;

  const highPriorityPolicies =
    policies.filter(
      (policy) =>
        policy.priority ===
        'HIGH',
    ).length;

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
        Loading SLA policies...
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
          flex flex-col
          gap-4
          p-3
          lg:p-5
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
              h-52 w-52
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
                <ShieldCheck
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
                  SLA Policies
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
              Configure SLA timing
              rules for support
              tickets and escalation
              workflows.
            </p>
          </div>
        </div>

        {/* STATS */}
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

                lg:text-sm
                text-zinc-500
              "
            >
              Total Policies
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-bold

                lg:text-4xl
              "
            >
              {totalPolicies}
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

                lg:text-sm
                text-zinc-500
              "
            >
              Critical
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-bold
                text-red-500

                lg:text-4xl
              "
            >
              {highPriorityPolicies}
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

                lg:text-sm
                text-zinc-500
                "
            >
              Status
            </p>

            <h2
              className="
                mt-2
                text-xl
                font-bold
                text-emerald-500

                lg:text-3xl
              "
            >
              Active
            </h2>
          </Card>
        </div>

        {/* MAIN */}
        <div
          className="
            grid
            gap-4
            lg:grid-cols-[380px_1fr]
          "
        >

          {/* CREATE PANEL */}
          <Card
            className="
              flex h-fit
              flex-col
              rounded-3xl
              border border-zinc-200
              bg-white
              p-5
              shadow-sm

              dark:border-white/10
              dark:bg-zinc-900/40
            "
          >
            <div className="mb-5">
              <h2
                className="
                  text-xl
                  font-semibold
                "
              >
                Create Policy
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-zinc-500
                "
              >
                Define SLA timing
                rules for tickets.
              </p>
            </div>

            <div className="space-y-4">

              <div className="space-y-2">
                <label
                  className="
                    text-sm
                    font-medium
                    text-zinc-600

                    dark:text-zinc-400
                  "
                >
                  Policy Name
                </label>

                <Input
                  placeholder="Critical Incidents"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value,
                    )
                  }
                  className="
                    h-11
                    rounded-xl
                    border-zinc-200
                    bg-zinc-50

                    dark:border-white/10
                    dark:bg-zinc-950
                  "
                />
              </div>

              <div className="space-y-2">
                <label
                  className="
                    text-sm
                    font-medium
                    text-zinc-600

                    dark:text-zinc-400
                  "
                >
                  Priority
                </label>

                <Select
                  value={priority}
                  onValueChange={
                    setPriority
                  }
                >
                  <SelectTrigger
                    className="
                      h-11
                      rounded-xl
                      border-zinc-200
                      bg-zinc-50
                      dark:border-white/10
                      dark:bg-zinc-950
                    "
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent position="popper" sideOffset={6} className="max-h-60">
                    <SelectItem value="LOW">
                      LOW
                    </SelectItem>

                    <SelectItem value="MEDIUM">
                      MEDIUM
                    </SelectItem>

                    <SelectItem value="HIGH">
                      HIGH
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div
                className="
                  grid 
                  gap-3
                  sm:grid-cols-2
                "
              >
                <div className="space-y-2">
                  <label
                    className="
                      text-sm
                      font-medium
                      text-zinc-600

                      dark:text-zinc-400
                    "
                  >
                    Response Hours
                  </label>

                  <Input
                    type="number"
                    placeholder="1"
                    value={
                      responseTimeHours
                    }
                    onChange={(e) =>
                      setResponseTimeHours(
                        e.target.value,
                      )
                    }
                    className="
                      h-11
                      rounded-xl
                      border-zinc-200
                      bg-zinc-50

                      dark:border-white/10
                      dark:bg-zinc-950
                    "
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="
                      text-sm
                      font-medium
                      text-zinc-600

                      dark:text-zinc-400
                    "
                  >
                    Resolution Hours
                  </label>

                  <Input
                    type="number"
                    placeholder="4"
                    value={
                      resolutionTimeHours
                    }
                    onChange={(e) =>
                      setResolutionTimeHours(
                        e.target.value,
                      )
                    }
                    className="
                      h-11
                      rounded-xl
                      border-zinc-200
                      bg-zinc-50

                      dark:border-white/10
                      dark:bg-zinc-950
                    "
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={
                handleCreate
              }
              disabled={creating}
              className="
                mt-5
                h-11
                rounded-xl
                bg-black
                text-white
                hover:bg-zinc-800

                dark:bg-white
                dark:text-black
                dark:hover:bg-zinc-200
              "
            >
              {creating
                ? 'Creating...'
                : 'Create Policy'}
            </Button>
          </Card>

          {/* POLICIES LIST */}
          <div className="space-y-4">
            {policies.map(
              (policy) => (
                <Card
                  key={policy.id}
                  className="
                    rounded-3xl
                    border border-zinc-200
                    bg-white
                    p-4
                    shadow-sm
                    lg:p-5
                    dark:border-white/10
                    dark:bg-zinc-900/40
                  "
                >
                  <div
                    className="
                      flex flex-col
                      gap-5
                    "
                  >
                    <div
                      className="
                        flex flex-col
                        gap-3
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                      "
                    >
                      <div>
                        <h3
                          className="
                            text-2xl
                            font-semibold
                          "
                        >
                          {policy.name}
                        </h3>

                        <p
                          className="
                            mt-2
                            text-sm
                            text-zinc-500
                          "
                        >
                          SLA timing rules
                          for support
                          handling and
                          escalation.
                        </p>
                      </div>

                      <Badge>
                        {
                          policy.priority
                        }
                      </Badge>
                    </div>

                    <div
                      className="
                        grid
                        gap-3
                        sm:grid-cols-2
                      "
                    >
                      <div
                        className="
                          flex items-center
                          gap-3
                          rounded-2xl
                          border border-zinc-200
                          bg-zinc-50
                          px-4 py-3

                          dark:border-white/10
                          dark:bg-white/[0.03]
                        "
                      >
                        <TimerReset
                          className="
                            h-5 w-5
                            text-violet-500
                          "
                        />

                        <div>
                          <p
                            className="
                              text-xs
                              text-zinc-500
                            "
                          >
                            Response Time
                          </p>

                          <p
                            className="
                              font-semibold
                            "
                          >
                            {
                              policy.responseTimeHours
                            }{' '}
                            hours
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                          flex items-center
                          gap-3
                          rounded-2xl
                          border border-zinc-200
                          bg-zinc-50
                          px-4 py-3

                          dark:border-white/10
                          dark:bg-white/[0.03]
                        "
                      >
                        <AlarmClock
                          className="
                            h-5 w-5
                            text-emerald-500
                          "
                        />

                        <div>
                          <p
                            className="
                              text-xs
                              text-zinc-500
                            "
                          >
                            Resolution Time
                          </p>

                          <p
                            className="
                              font-semibold
                            "
                          >
                            {
                              policy.resolutionTimeHours
                            }{' '}
                            hours
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ),
            )}
          </div>

        </div>
      </div>
    </div>
  );
}