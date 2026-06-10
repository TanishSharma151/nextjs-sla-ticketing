'use client';

import {
  useRouter,
  usePathname,
} from 'next/navigation';

import {
  Bell,
  Search,
} from 'lucide-react';

import {
  Input,
} from '@/components/ui/input';

import {
  Button,
} from '@/components/ui/button';

import ThemeToggle
  from '@/components/theme-toggle';

export default function Navbar() {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const pageTitle =
    pathname
      .split('/')[1]
      ?.replaceAll('-', ' ');

  return (
    <header
      className="
      sticky top-0 z-40
      flex h-16
      items-center justify-between
      border-b border-zinc-200
      bg-white/80
      px-4
      backdrop-blur-xl

      sm:px-6

      dark:border-white/10
      dark:bg-[#09090B]/80
    "
    >

      {/* Left */}
      <div className="min-w-0">
        <p
          className="
          text-xs
          uppercase
          tracking-[0.2em]
          text-zinc-500
        "
        >
          Workspace
        </p>

        <h1
          className="
          mt-1
          truncate
          text-base
          font-semibold
          capitalize
          tracking-tight
          text-black

          sm:text-lg

          dark:text-white
        "
        >
          {pageTitle || "Dashboard"}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Search */}
        <div className="relative hidden lg:block">
          <Search
            size={16}
            className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-zinc-500
          "
          />

          <Input
            placeholder="Search..."
            className="
            h-10
            w-[220px]
            rounded-xl
            border-zinc-200
            bg-white
            pl-9
            text-sm
            text-black
            placeholder:text-zinc-500

            focus-visible:ring-0
            focus-visible:ring-offset-0

            dark:border-white/10
            dark:bg-white/[0.03]
            dark:text-white
          "
          />
        </div>

        {/* Notifications */}
        <Button
          variant="outline"
          size="icon"
          className="
          h-10
          w-10
          rounded-xl
          border-zinc-200
          bg-white
          text-zinc-700
          hover:bg-zinc-100

          dark:border-white/10
          dark:bg-white/[0.03]
          dark:text-zinc-400
          dark:hover:bg-white/[0.06]
          dark:hover:text-white
        "
        >
          <Bell size={18} />
        </Button>

        {/* Theme */}
        <div
          className="
          rounded-xl
          border
          border-zinc-200
          bg-white

          dark:border-white/10
          dark:bg-white/[0.03]
        "
        >
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}