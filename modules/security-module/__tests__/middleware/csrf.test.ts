import { describe, it, expect } from 'vitest';
import { applyCsrf } from '../../src/middleware/csrf';
import { createRequest, createResponse } from '../helpers';

describe('applyCsrf', () => {
  it('returns null when disabled', () => {
    const req = createRequest('http://localhost:3000/', { method: 'POST' });
    const res = createResponse();
    const result = applyCsrf(req, res, { enabled: false });
    expect(result).toBeNull();
  });

  it('allows GET requests without token', () => {
    const req = createRequest('http://localhost:3000/', { method: 'GET' });
    const res = createResponse();
    const result = applyCsrf(req, res, { enabled: true });
    expect(result).toBeNull();
  });

  it('blocks POST without matching token', () => {
    const req = createRequest('http://localhost:3000/', {
      method: 'POST',
      headers: { 'x-csrf-token': 'wrong' },
    });
    const res = createResponse();
    const result = applyCsrf(req, res, { enabled: true });

    expect(result).not.toBeNull();
    expect(result?.status).toBe(403);
  });

  it('allows POST with matching cookie and header token', () => {
    const req = new Request('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'x-csrf-token': 'valid-token',
        cookie: '__csrf=valid-token',
      },
    });
    const nextReq = new (require('next/server').NextRequest)(req);
    const res = createResponse();
    const result = applyCsrf(nextReq, res, { enabled: true });

    expect(result).toBeNull();
  });

  it('skips excluded paths', () => {
    const req = createRequest('http://localhost:3000/api/webhook', { method: 'POST' });
    const res = createResponse();
    const result = applyCsrf(req, res, {
      enabled: true,
      excludePaths: ['/api/webhook'],
    });

    expect(result).toBeNull();
  });
});
