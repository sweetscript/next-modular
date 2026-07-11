import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_REQUEST_SIZE } from '../constants';
import type { RequestSizeConfig } from '../types';

export function applyRequestSize(req: NextRequest, config: RequestSizeConfig): NextResponse | null {
  const c = { ...DEFAULT_REQUEST_SIZE, ...config };
  if (!c.enabled) return null;

  const contentLength = req.headers.get('content-length');
  if (!contentLength) return null;

  const size = parseInt(contentLength, 10);
  if (isNaN(size)) return null;

  const contentType = req.headers.get('content-type') ?? '';
  const isUpload = contentType.includes('multipart/form-data');
  const limit = isUpload ? c.maxUploadSize : c.maxBodySize;

  if (size > limit) {
    return new NextResponse(
      JSON.stringify({ error: 'Request body too large' }),
      { status: 413, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return null;
}
