'use client';

import { useState } from 'react';

import { useRouter }
  from 'next/navigation';

import {
  login,
} from '@/services/auth';

import {
  Button,
} from '@/components/ui/button';

import {
  Input,
} from '@/components/ui/input';

export default function LoginPage() {
  const router =
    useRouter();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async () => {
      try {
        setLoading(true);

        await login(
          email,
          password,
        );

        window.location.href =
          '/dashboard';
      } catch (error) {
        console.error(error);

        alert(
          'Login failed',
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="
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
          absolute left-1/2 top-0
          h-[500px] w-[500px]
          -translate-x-1/2
          rounded-full
          bg-violet-600/10
          blur-3xl
        "
      />

      <div
        className="
          relative z-10
          flex h-screen
          overflow-hidden
        "
      >

        {/* LEFT */}
        <div
          className="
            hidden
            lg:flex
            h-full
            w-[48%]
            flex-col
            justify-between
            border-r border-zinc-200
            bg-gradient-to-br
            from-white
            via-zinc-100
            to-zinc-50
            p-12

            dark:border-white/10
            dark:from-zinc-950
            dark:via-black
            dark:to-zinc-900
          "
        >
          <div>

            {/* Logo */}
            <div
              className="
                flex items-center gap-3
              "
            >
              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-2xl
                  bg-black
                  text-xl font-bold
                  text-white

                  dark:bg-white
                  dark:text-black
                "
              >
                S
              </div>

              <div>
                <h1
                  className="
                    text-3xl
                    font-bold
                    tracking-tight
                  "
                >
                  SLA Desk
                </h1>

                <p
                  className="
                    text-zinc-600
                    dark:text-zinc-400
                  "
                >
                  Modern Helpdesk Platform
                </p>
              </div>
            </div>

            {/* Hero */}
            <div
              className="
                mt-24
                max-w-lg
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
                HELPDESK MANAGEMENT
              </p>

              <h2
                className="
                  mt-5
                  text-6xl
                  font-bold
                  leading-tight
                  tracking-tight
                "
              >
                Manage support tickets smarter.
              </h2>

              <p
                className="
                  mt-6
                  text-lg
                  leading-8
                  text-zinc-600

                  dark:text-zinc-400
                "
              >
                Track SLA performance,
                collaborate with agents,
                manage incidents,
                and resolve tickets faster.
              </p>
            </div>
          </div>

          {/* Bottom Stats */}
          <div
            className="
              grid grid-cols-2
              gap-4
            "
          >

            <div
              className="
                rounded-3xl
                border border-zinc-200
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
                Average SLA Met
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-bold
                "
              >
                99.2%
              </h3>
            </div>

            <div
              className="
                rounded-3xl
                border border-zinc-200
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
                Resolution Time
              </p>

              <h3
                className="
                  mt-3
                  text-3xl
                  font-bold
                "
              >
                12m
              </h3>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className="
            flex flex-1
            items-center
            justify-center
            overflow-y-auto
            p-6
          "
        >
          <div
            className="
              w-full
              max-w-md
            "
          >

            <div
              className="
                rounded-[32px]
                border border-zinc-200
                bg-white
                p-8
                shadow-xl

                dark:border-white/10
                dark:bg-white/[0.03]
                dark:shadow-[0_0_60px_rgba(0,0,0,0.7)]
                dark:backdrop-blur-2xl
              "
            >

              {/* Heading */}
              <div className="mb-8">
                <p
                  className="
                    text-xs
                    uppercase
                    tracking-[0.25em]
                    text-zinc-500
                  "
                >
                  Welcome Back
                </p>

                <h1
                  className="
                    mt-3
                    text-4xl
                    font-bold
                    tracking-tight
                  "
                >
                  Login
                </h1>

                <p
                  className="
                    mt-3
                    text-zinc-600

                    dark:text-zinc-400
                  "
                >
                  Access your support dashboard
                </p>
              </div>

              <div className="space-y-5">

                {/* Email */}
                <div className="space-y-2">
                  <label
                    className="
                      text-sm
                      font-medium
                      text-zinc-700

                      dark:text-zinc-300
                    "
                  >
                    Email
                  </label>

                  <Input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value,
                      )
                    }
                    placeholder="you@example.com"
                    className="
                      h-14
                      rounded-2xl
                      border-zinc-200
                      bg-white
                      px-5
                      text-black
                      placeholder:text-zinc-500

                      focus-visible:ring-1
                      focus-visible:ring-violet-500/40

                      dark:border-white/10
                      dark:bg-black/40
                      dark:text-white
                    "
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label
                    className="
                      text-sm
                      font-medium
                      text-zinc-700

                      dark:text-zinc-300
                    "
                  >
                    Password
                  </label>

                  <Input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value,
                      )
                    }
                    placeholder="Enter password"
                    className="
                      h-14
                      rounded-2xl
                      border-zinc-200
                      bg-white
                      px-5
                      text-black
                      placeholder:text-zinc-500

                      focus-visible:ring-1
                      focus-visible:ring-violet-500/40

                      dark:border-white/10
                      dark:bg-black/40
                      dark:text-white
                    "
                  />
                </div>

                {/* Button */}
                <Button
                  onClick={
                    handleLogin
                  }
                  disabled={loading}
                  className="
                  h-14
                  w-full
                  rounded-2xl
                  bg-black
                  text-base
                  font-semibold
                  text-white
                  transition-all
                  hover:scale-[1.01]
                  hover:bg-zinc-800
                  dark:bg-white
                  dark:text-black
                  dark:hover:bg-zinc-200
                  "
                >
                  {loading
                    ? 'Signing in...'
                    : 'Login'}
                </Button>

                {/* Signup Link */}
                <div className="mt-6 text-center">
                  <p
                    className="
                      text-sm
                      text-zinc-600
                      dark:text-zinc-400
                    "
                  >
                    Don&apos;t have an account?
                    {' '}

                    <button
                      onClick={() =>
                        router.push(
                          '/signup',
                        )
                      }
                      className="
                        font-semibold
                        text-black
                        transition-colors
                        hover:text-zinc-700

                        dark:text-white
                        dark:hover:text-zinc-300
                      "
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}