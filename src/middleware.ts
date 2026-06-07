import { NextResponse } from 'next/server';

import type {
  NextRequest,
} from 'next/server';

export function middleware(
  request: NextRequest,
) {
  const token =
    request.cookies.get(
      'access_token',
    );

  const isAuthPage =
    request.nextUrl.pathname ===
      '/login'
    ||
    request.nextUrl.pathname ===
      '/signup';

  if (!token && !isAuthPage) {
    return NextResponse.redirect(
      new URL(
        '/login',
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tickets/:path*',
    '/members/:path*',
  ],
};