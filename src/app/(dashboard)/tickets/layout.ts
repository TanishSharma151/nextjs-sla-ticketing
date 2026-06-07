import {
  redirect,
} from 'next/navigation';

import {
  isAuthenticated,
} from '@/lib/auth';

export default async function TicketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated =
    await isAuthenticated();

  if (!authenticated) {
    redirect('/login');
  }

  return children;
}