import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = `${BACKEND}/${path}`;

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  // Forward the cookie from browser → NestJS
  const cookie = req.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);

  const body = req.method !== 'GET' && req.method !== 'HEAD'
    ? await req.text()
    : undefined;

  const res = await fetch(url, {
    method: req.method,
    headers,
    body,
  });

  const data = await res.text();
  const response = new NextResponse(data, { status: res.status });

  // Forward Set-Cookie from NestJS → browser (now as first-party)
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) response.headers.set('set-cookie', setCookie);

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;