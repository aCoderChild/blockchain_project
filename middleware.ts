import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Remove any authentication requirements by bypassing protection
  const response = NextResponse.next();
  
  // Allow all cross-origin requests
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Disable caching to prevent authentication cache
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .well-known (well-known routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|.well-known).*)',
  ],
};
