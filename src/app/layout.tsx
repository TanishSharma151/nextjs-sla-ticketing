import type { Metadata }
  from 'next';

import './globals.css';

import {
  ThemeProvider,
} from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'SLA Desk',
  description:
    'Helpdesk platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className="
          bg-background
          text-foreground
        "
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}