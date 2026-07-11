import { describe, it, expect, beforeEach } from 'vitest';
import { applyRateLimit } from '../../src/middleware/rate-limit';
import { createRequest } from '../helpers';

describe('applyRateLimit', () => {
  beforeEach(() => {
    // Reset the internal store between tests by hitting a unique IP
  });

  it('returns null when disabled', () => {
    const req = createRequest('http://localhost:3000/', {
      headers: { 'x-forwarded-for': '1.1.1.1' },
    });
    const result = applyRateLimit(req, { enabled: false });
    expect(result).toBeNull();
  });

  it('allows requests within the limit', () => {
    const ip = `test-${Date.now()}`;
    const req = createRequest('http://localhost:3000/', {
      headers: { 'x-forwarded-for': ip },
    });

    const result = applyRateLimit(req, { enabled: true, windowMs: 60000, max: 5 });
    expect(result).toBeNull();
  });

  it('blocks requests exceeding the limit', () => {
    const ip = `blocked-${Date.now()}`;

    for (let i = 0; i < 3; i++) {
      const req = createRequest('http://localhost:3000/', {
        headers: { 'x-forwarded-for': ip },
      });
      applyRateLimit(req, { enabled: true, windowMs: 60000, max: 3 });
    }

    const req = createRequest('http://localhost:3000/', {
      headers: { 'x-forwarded-for': ip },
    });
    const result = applyRateLimit(req, { enabled: true, windowMs: 60000, max: 3 });

    expect(result).not.toBeNull();
    expect(result?.status).toBe(429);
  });

  it('includes rate limit headers when configured', () => {
    const ip = `headers-${Date.now()}`;

    for (let i = 0; i < 2; i++) {
      const req = createRequest('http://localhost:3000/', {
        headers: { 'x-forwarded-for': ip },
      });
      applyRateLimit(req, { enabled: true, windowMs: 60000, max: 2, headers: true });
    }

    const req = createRequest('http://localhost:3000/', {
      headers: { 'x-forwarded-for': ip },
    });
    const result = applyRateLimit(req, { enabled: true, windowMs: 60000, max: 2, headers: true });

    expect(result?.headers.get('X-RateLimit-Limit')).toBe('2');
    expect(result?.headers.get('X-RateLimit-Remaining')).toBe('0');
  });
});
