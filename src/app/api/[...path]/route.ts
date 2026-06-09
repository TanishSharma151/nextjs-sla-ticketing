import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }  // 👈 Promise here
) {
  const { path } = await params;  // 👈 await it
  const url = `${BACKEND}/${path.join('/')}`;

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

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

  const setCookie = res.headers.get('set-cookie');
  if (setCookie) response.headers.set('set-cookie', setCookie);

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;