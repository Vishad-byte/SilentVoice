import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If the user is logged in and tries to visit auth pages (sign-in, sign-up), redirect to dashboard
  if (
    token &&
    (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not logged in and tries to visit protected routes, redirect to sign-in
  if (
    !token &&
    (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/verify'))
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Otherwise, allow request
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
  ],
};
