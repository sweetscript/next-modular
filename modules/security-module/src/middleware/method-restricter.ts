import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_METHOD_RESTRICTER } from '../constants';
import type { MethodRestricterConfig } from '../types';

export function applyMethodRestricter(req: NextRequest, config: MethodRestricterConfig): NextResponse | null {
  const c = { ...DEFAULT_METHOD_RESTRICTER, ...config };
  if (!c.enabled) return null;

  if (c.methods === '*') return null;

  const allowed = c.methods.map((m) => m.toUpperCase());

  if (!allowed.includes(req.method.toUpperCase())) {
    return new NextResponse(
      JSON.stringify({ error: `Method ${req.method} not allowed` }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Allow': allowed.join(', '),
        },
      }
    );
  }

  return null;
}
