import type { Metadata }
  from 'next';

import Sidebar
  from '@/components/dashboard/sidebar';

import Navbar
  from '@/components/dashboard/navbar';

export const metadata: Metadata = {
  title: 'SLA Desk',

  description:
    'Modern Helpdesk Platform',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen
        bg-background
        text-foreground
      "
    >

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div
        className="
          flex min-h-screen
          flex-col

          lg:ml-72
        "
      >
        <Navbar />

        <main
          className="
            flex-1
            overflow-y-auto
            bg-background
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}