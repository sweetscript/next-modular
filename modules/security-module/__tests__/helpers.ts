import { NextRequest, NextResponse } from 'next/server';

export function createRequest(url = 'http://localhost:3000/', options: RequestInit & { headers?: Record<string, string> } = {}): NextRequest {
  const { headers = {}, ...rest } = options;
  return new NextRequest(new URL(url), {
    ...rest,
    headers: new Headers(headers),
  });
}

export function createResponse(): NextResponse {
  return NextResponse.next();
}
