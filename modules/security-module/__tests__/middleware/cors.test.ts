import { describe, it, expect } from 'vitest';
import { applyCors } from '../../src/middleware/cors';
import { createRequest, createResponse } from '../helpers';

describe('applyCors', () => {
  it('returns null when disabled', () => {
    const req = createRequest();
    const res = createResponse();
    const result = applyCors(req, res, { enabled: false });
    expect(result).toBeNull();
  });

  it('sets CORS headers for allowed origin', () => {
    const req = createRequest('http://localhost:3000/', {
      headers: { origin: 'http://example.com' },
    });
    const res = createResponse();

    applyCors(req, res, {
      enabled: true,
      origins: ['http://example.com'],
      methods: ['GET', 'POST'],
    });

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST');
  });

  it('does not set headers for disallowed origin', () => {
    const req = createRequest('http://localhost:3000/', {
      headers: { origin: 'http://evil.com' },
    });
    const res = createResponse();

    const result = applyCors(req, res, {
      enabled: true,
      origins: ['http://example.com'],
    });

    expect(result).toBeNull();
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('allows all origins with wildcard', () => {
    const req = createRequest('http://localhost:3000/', {
      headers: { origin: 'http://anything.com' },
    });
    const res = createResponse();

    applyCors(req, res, {
      enabled: true,
      origins: ['*'],
      methods: ['GET'],
    });

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://anything.com');
  });

  it('sets credentials header when enabled', () => {
    const req = createRequest('http://localhost:3000/', {
      headers: { origin: 'http://example.com' },
    });
    const res = createResponse();

    applyCors(req, res, {
      enabled: true,
      origins: ['http://example.com'],
      credentials: true,
    });

    expect(res.headers.get('Access-Control-Allow-Credentials')).toBe('true');
  });

  it('returns 204 for preflight OPTIONS requests', () => {
    const req = createRequest('http://localhost:3000/', {
      method: 'OPTIONS',
      headers: { origin: 'http://example.com' },
    });
    const res = createResponse();

    const result = applyCors(req, res, {
      enabled: true,
      origins: ['http://example.com'],
      methods: ['GET', 'POST'],
      maxAge: 3600,
    });

    expect(result).not.toBeNull();
    expect(result?.status).toBe(204);
  });
});
