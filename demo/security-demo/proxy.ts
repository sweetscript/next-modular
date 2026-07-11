import { NextRequest, NextResponse } from 'next/server';
import { handleMiddleware } from 'next-modular';
import './next-modular.runtime'; // Initialize modules

export async function proxy(req: NextRequest) {
  // Handle module middleware
  const result = await handleMiddleware(req);
  
  if (result) {
    return result;
  }

  // Continue to next middleware or route
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
