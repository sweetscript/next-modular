import { describe, it, expect } from 'vitest';
import { applyMethodRestricter } from '../../src/middleware/method-restricter';
import { createRequest } from '../helpers';

describe('applyMethodRestricter', () => {
  it('returns null when disabled', () => {
    const req = createRequest('http://localhost:3000/', { method: 'DELETE' });
    const result = applyMethodRestricter(req, { enabled: false });
    expect(result).toBeNull();
  });

  it('returns null when methods is wildcard', () => {
    const req = createRequest('http://localhost:3000/', { method: 'DELETE' });
    const result = applyMethodRestricter(req, { enabled: true, methods: '*' });
    expect(result).toBeNull();
  });

  it('allows a permitted method', () => {
    const req = createRequest('http://localhost:3000/', { method: 'GET' });
    const result = applyMethodRestricter(req, { enabled: true, methods: ['GET', 'POST'] });
    expect(result).toBeNull();
  });

  it('blocks a disallowed method with 405', () => {
    const req = createRequest('http://localhost:3000/', { method: 'DELETE' });
    const result = applyMethodRestricter(req, { enabled: true, methods: ['GET', 'POST'] });

    expect(result).not.toBeNull();
    expect(result?.status).toBe(405);
    expect(result?.headers.get('Allow')).toBe('GET, POST');
  });
});
