import Link from 'next/link';

import { Button }
from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-6xl font-bold">
          SLA Desk
        </h1>

        <p className="text-xl text-muted-foreground">
          Modern SLA-based helpdesk
          and ticket management
          platform.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg">
              Login
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              size="lg"
              variant="outline"
            >
              Signup
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}