import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-zinc-50
        text-black

        dark:bg-[#09090B]
        dark:text-white
      "
    >
      {/* Glow */}
      <div
        className="
          absolute
          left-1/2
          top-0
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-violet-600/15
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          max-w-7xl
          flex-col
          justify-center
          px-6
          py-16
        "
      >
        {/* Navbar */}

        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-black
                text-xl
                font-bold
                text-white

                dark:bg-white
                dark:text-black
              "
            >
              S
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                SLA Desk
              </h1>

              <p
                className="
                  text-sm
                  text-zinc-500
                "
              >
                Enterprise Helpdesk
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">
                Login
              </Button>
            </Link>

            <Link href="/signup">
              <Button>
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero */}

        <div
          className="
            mt-24
            text-center
          "
        >
          <p
            className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-violet-500
            "
          >
            SLA MANAGEMENT PLATFORM
          </p>

          <h2
            className="
              mx-auto
              mt-6
              max-w-5xl
              text-5xl
              font-bold
              leading-tight

              lg:text-7xl
            "
          >
            Manage support
            tickets faster
            with smart SLA
            tracking.
          </h2>

          <p
            className="
              mx-auto
              mt-8
              max-w-2xl
              text-lg
              leading-8
              text-zinc-600

              dark:text-zinc-400
            "
          >
            Enterprise-grade helpdesk
            system with ticket
            assignment, role-based
            access, SLA monitoring,
            file attachments,
            notifications, and
            real-time workflows.
          </p>

          <div
            className="
              mt-10
              flex
              justify-center
              gap-4
            "
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="h-14 px-8"
              >
                Create Account
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}

        <div
          className="
            mt-24
            grid
            gap-4

            md:grid-cols-4
          "
        >
          {[
            {
              title: 'Role Based',
              value: '3',
            },
            {
              title: 'SLA Tracking',
              value: '24/7',
            },
            {
              title: 'Email Alerts',
              value: 'Live',
            },
            {
              title: 'Attachments',
              value: 'Secure',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="
                rounded-3xl
                border
                border-zinc-200
                bg-white
                p-6
                shadow-sm

                dark:border-white/10
                dark:bg-white/[0.03]
                dark:backdrop-blur-xl
              "
            >
              <p
                className="
                  text-sm
                  text-zinc-500
                "
              >
                {item.title}
              </p>

              <h3
                className="
                  mt-3
                  text-4xl
                  font-bold
                "
              >
                {item.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Features */}

        <div
          className="
            mt-20
            grid
            gap-6

            lg:grid-cols-3
          "
        >
          {[
            {
              title:
                'Smart Ticketing',
              desc:
                'Create, assign and manage support tickets efficiently.',
            },
            {
              title:
                'SLA Monitoring',
              desc:
                'Track deadlines and identify breaches automatically.',
            },
            {
              title:
                'Team Collaboration',
              desc:
                'Admins, agents and clients working together.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="
                rounded-3xl
                border
                border-zinc-200
                bg-white
                p-8

                dark:border-white/10
                dark:bg-white/[0.03]
              "
            >
              <h3
                className="
                  text-2xl
                  font-semibold
                "
              >
                {feature.title}
              </h3>

              <p
                className="
                  mt-4
                  leading-7
                  text-zinc-600

                  dark:text-zinc-400
                "
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}