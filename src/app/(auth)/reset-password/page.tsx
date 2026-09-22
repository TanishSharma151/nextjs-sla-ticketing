'use client';

import { Suspense, useState } from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import {
  resetPassword,
} from '@/services/auth';

import {
  Button,
} from '@/components/ui/button';

import {
  Input,
} from '@/components/ui/input';

function ResetPasswordForm() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const token =
    searchParams.get('token') || '';

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [done, setDone] =
    useState(false);

  const handleSubmit =
    async () => {
      try {
        setLoading(true);

        setError('');

        await resetPassword(
          token,
          password,
        );

        setDone(true);
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            'Failed to reset password. The link may have expired.',
        );
      } finally {
        setLoading(false);
      }
    };

  return (
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
          Reset Password
        </h1>

        <p
          className="
            mt-3
            text-zinc-600

            dark:text-zinc-400
          "
        >
          Choose a new password below.
        </p>
      </div>

      {!token ? (
        <div
          className="
            rounded-2xl
            border border-red-500/20
            bg-red-500/10
            px-5 py-4
            text-sm
            text-red-500
          "
        >
          This link is missing its reset
          token. Request a new one from the{' '}
          <button
            onClick={() =>
              router.push(
                '/forgot-password',
              )
            }
            className="underline"
          >
            forgot password
          </button>{' '}
          page.
        </div>
      ) : done ? (
        <div className="space-y-5">
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
            Password reset successfully.
          </div>

          <Button
            onClick={() =>
              router.push(
                '/login',
              )
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
            Go to Login
          </Button>
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
              New Password
            </label>

            <Input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value,
                )
              }
              placeholder="Enter new password"
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

          {error && (
            <p
              className="
                rounded-xl
                border border-red-500/20
                bg-red-500/10
                px-4 py-3
                text-sm
                text-red-500
              "
            >
              {error}
            </p>
          )}

          <Button
            onClick={
              handleSubmit
            }
            disabled={
              loading ||
              password.length < 6
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
              ? 'Resetting...'
              : 'Reset Password'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
