'use client';

import Link from 'next/link';

import {
  useEffect,
  useState,
} from 'react';

import {
  usePathname,
  useRouter,
} from 'next/navigation';

import ThemeToggle from '@/components/theme-toggle';

import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

import {
  getMe,
  logout,
} from '@/services/auth';

import {
  useAuthStore,
} from '@/store/auth-store';

type SidebarLink = {
  name: string;
  href: string;
  icon: any;
};

export default function Sidebar() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
    user,
    setUser,
  } = useAuthStore();

  const [role, setRole] =
    useState<string | null>(null);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    const fetchUser =
      async () => {
        try {
          const currentUser =
            await getMe();

          setUser(currentUser);

          const membership =
            currentUser
              ?.memberships?.[0];

          setRole(
            membership?.role ||
            null,
          );
        } catch (error) {
          setUser(null);

          setRole(null);
        }
      };

    fetchUser();
  }, [setUser]);

  const handleLogout =
    async () => {
      try {
        await logout();

        setUser(null);

        setRole(null);

        router.push('/login');

        router.refresh();
      } catch (error) {
        console.error(error);
      }
    };

  const links: SidebarLink[] = [];

  // CLIENT
  if (role === 'CLIENT') {
    links.push(
      {
        name: 'My Tickets',
        href: '/my-tickets',
        icon: Ticket,
      },

      {
        name: 'Create Ticket',
        href: '/tickets/create',
        icon: PlusCircle,
      },
    );
  }

  // AGENT
  if (role === 'AGENT') {
    links.push(
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },

      {
        name: 'My Tickets',
        href: '/my-tickets',
        icon: Ticket,
      },

      {
        name: 'Create Ticket',
        href: '/tickets/create',
        icon: PlusCircle,
      },
    );
  }

  // ADMIN
  if (role === 'ADMIN') {
    links.push(
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },

      {
        name: 'My Tickets',
        href: '/my-tickets',
        icon: Ticket,
      },

      {
        name: 'Create Ticket',
        href: '/tickets/create',
        icon: PlusCircle,
      },

      {
        name: 'Members',
        href: '/members',
        icon: Users,
      },

      {
        name: 'SLA Policies',
        href: '/sla-policies',
        icon: ShieldCheck,
      },
    );
  }

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div
        className="
          fixed left-0 top-0 z-50
          flex h-16 w-full
          items-center
          justify-between
          border-b border-zinc-200
          bg-white
          px-4

          dark:border-white/10
          dark:bg-[#0A0A0B]

          lg:hidden
        "
      >
        <div className="flex items-center gap-3">
          {/* LOGO */}
          <div
            className="
              flex h-10 w-10
              items-center
              justify-center
              rounded-xl
              bg-black
              text-lg
              font-bold
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
                text-lg
                font-bold
                text-black

                dark:text-white
              "
            >
              SLA Desk
            </h1>
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="flex items-center gap-2">

          <div
            className="
      rounded-xl
      border border-zinc-200
      bg-white

      dark:border-white/10
      dark:bg-white/[0.03]
    "
          >
            <ThemeToggle />
          </div>

          <button
            onClick={() =>
              setMobileOpen(
                !mobileOpen,
              )
            }
            className="
              flex h-10 w-10
              items-center
              justify-center
              rounded-xl
              border border-zinc-200
              bg-white

              dark:border-white/10
              dark:bg-white/[0.03]
            "
          >
            {mobileOpen ? (
              <X size={18} />
            ) : (
              <Menu size={18} />
            )}
          </button>

        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="
            fixed inset-0 z-40
            bg-black/50
            backdrop-blur-sm

            lg:hidden
          "
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72
          flex-col justify-between
          border-r border-zinc-200
          bg-white
          px-4 py-5
          transition-transform
          duration-300

          dark:border-white/10
          dark:bg-[#0A0A0B]

          lg:translate-x-0

          ${mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full'
          }
        `}
      >
        {/* TOP */}
        <div>
          {/* LOGO */}
          <div
            className="
              mb-8
              hidden items-center
              gap-3
              px-2

              lg:flex
            "
          >
            <div
              className="
                flex h-11 w-11
                items-center
                justify-center
                rounded-2xl
                bg-black
                text-lg
                font-bold
                text-white
                shadow-lg

                dark:bg-white
                dark:text-black
              "
            >
              S
            </div>

            <div>
              <h1
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-black

                  dark:text-white
                "
              >
                SLA Desk
              </h1>

              <p
                className="
                  text-xs
                  text-zinc-500
                "
              >
                Helpdesk Platform
              </p>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon =
                link.icon;

              const active =
                pathname ===
                link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    setMobileOpen(
                      false,
                    )
                  }
                  className={`
                    group
                    flex items-center
                    gap-3
                    rounded-2xl
                    px-3 py-3
                    text-sm
                    font-medium
                    transition-all
                    duration-200

                    ${active
                      ? `
                          bg-black
                          text-white
                          shadow-lg

                          dark:bg-white
                          dark:text-black
                        `
                      : `
                          text-zinc-600
                          hover:bg-zinc-100
                          hover:text-black

                          dark:text-zinc-400
                          dark:hover:bg-white/[0.04]
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  <Icon size={18} />

                  <span>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM */}
        <div
          className="
            border-t border-zinc-200
            pt-4

            dark:border-white/10
          "
        >
          {user && (
            <div className="space-y-4">
              {/* USER */}
              <div
                className="
                  flex items-center
                  gap-3
                  rounded-2xl
                  border border-zinc-200
                  bg-zinc-50
                  p-3

                  dark:border-white/10
                  dark:bg-white/[0.03]
                "
              >
                <div
                  className="
                    flex h-10 w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    text-sm
                    font-bold
                    text-white

                    dark:bg-white
                    dark:text-black
                  "
                >
                  {user.email?.charAt(
                    0,
                  )}
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-sm
                      font-medium
                      text-black

                      dark:text-white
                    "
                  >
                    {user.email}
                  </p>

                  <p
                    className="
                      text-xs
                      uppercase
                      tracking-wide
                      text-zinc-500
                    "
                  >
                    {role || 'USER'}
                  </p>
                </div>
              </div>

              {/* LOGOUT */}
              <button
                onClick={
                  handleLogout
                }
                className="
                  flex w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border border-zinc-200
                  bg-zinc-50
                  px-4 py-3
                  text-sm
                  font-medium
                  text-zinc-700
                  transition-all
                  duration-200
                  hover:bg-red-50
                  hover:text-red-500

                  dark:border-white/10
                  dark:bg-white/[0.03]
                  dark:text-zinc-300
                  dark:hover:bg-red-500/10
                  dark:hover:text-red-400
                "
              >
                <LogOut size={16} />

                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}