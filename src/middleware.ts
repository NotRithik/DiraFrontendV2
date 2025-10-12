// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the hostname from the request headers.
  const host = request.headers.get('host');

  // If the host is 'app.dira.foundation', rewrite the path.
  if (host === 'app.dira.foundation') {
    // Clone the URL to modify it.
    const url = request.nextUrl.clone();

    // Prepend '/dashboard' to the path.
    // This will turn a request for '/' on the subdomain into '/dashboard/' internally.
    url.pathname = `/dashboard${url.pathname}`;

    // Return the rewritten URL. The user will still see 'app.dira.foundation' in their browser.
    return NextResponse.rewrite(url);
  }

  // For any other domain (like www.dira.foundation or the Vercel domain),
  // do nothing and let the request continue as normal.
  return NextResponse.next();
}

// Optional but recommended: The matcher config
// This ensures the middleware only runs on page requests and not on static files
// like images or CSS, which is more efficient.
export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}