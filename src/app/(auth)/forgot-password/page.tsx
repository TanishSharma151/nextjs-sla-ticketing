'use client';

import { useState } from 'react';

import { useRouter }
  from 'next/navigation';

import {
  forgotPassword,
} from '@/services/auth';

import {
  Button,
} from '@/components/ui/button';

import {
  Input,
} from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const router =
    useRouter();

  const [email, setEmail] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [sent, setSent] =
    useState(false);

  const handleSubmit =
    async () => {
      try {
        setLoading(true);

        await forgotPassword(
          email,
        );

        setSent(true);
      } catch (error) {
        console.error(error);

        // Backend never reveals whether the email exists, so any
        // error here is unexpected - still avoid leaking details.
        setSent(true);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="
        flex min-h-screen
        items-center
        justify-center
        bg-zinc-50
        p-6
        text-black

        dark:bg-[#09090B]
        dark:text-white
      "
    >
      <div
        className="
          w-full
          max-w-md
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
        <div className="mb-8">
          <p
            className="
              text-xs
              uppercase
              tracking-[0.25em]
              text-zinc-500
            "
          >
            Account Recovery
          </p>

          <h1
            className="
              mt-3
              text-4xl
              font-bold
              tracking-tight
            "
          >
            Forgot Password
          </h1>

          <p
            className="
              mt-3
              text-zinc-600

              dark:text-zinc-400
            "
          >
            Enter your email and we&apos;ll
            send you a link to reset it.
          </p>
        </div>

        {sent ? (
          <div
            className="
              rounded-2xl
              border border-emerald-500/20
              bg-emerald-500/10
              px-5 py-4
              text-sm
              text-emerald-600

              dark:text-emerald-400
            "
          >
            If that email exists, a reset
            link has been sent. Check your
            inbox.
          </div>
        ) : (
          <div className="space-y-5">
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

            <Button
              onClick={
                handleSubmit
              }
              disabled={
                loading ||
                !email
              }
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
                ? 'Sending...'
                : 'Send Reset Link'}
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() =>
              router.push(
                '/login',
              )
            }
            className="
              text-sm
              font-semibold
              text-zinc-600

              hover:text-black

              dark:text-zinc-400
              dark:hover:text-white
            "
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
