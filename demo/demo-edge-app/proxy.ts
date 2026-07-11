import { NextRequest, NextResponse } from 'next/server';
import { handleMiddlewareWith } from 'next-modular/edge';
import { modules } from './modules.config';

export async function proxy(req: NextRequest) {
  const result = await handleMiddlewareWith(modules, req);

  if (result) {
    return result;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
