import { describe, it, expect } from 'vitest';
import { buildCspString } from '../../src/utils/csp-builder';

describe('buildCspString', () => {
  it('builds directive from array values', () => {
    const result = buildCspString({
      'default-src': ["'self'"],
      'img-src': ["'self'", 'data:'],
    });

    expect(result).toBe("default-src 'self'; img-src 'self' data:");
  });

  it('handles boolean directives', () => {
    const result = buildCspString({
      'upgrade-insecure-requests': true,
      'default-src': ["'self'"],
    });

    expect(result).toContain('upgrade-insecure-requests');
    expect(result).toContain("default-src 'self'");
  });

  it('skips false/undefined directives', () => {
    const result = buildCspString({
      'default-src': ["'self'"],
      'img-src': undefined,
      'upgrade-insecure-requests': false,
    });

    expect(result).toBe("default-src 'self'");
  });

  it('injects nonce via placeholder in script-src', () => {
    const result = buildCspString({
      'script-src': ["'self'", "'nonce-{{nonce}}'"],
    }, 'abc123');

    expect(result).toBe("script-src 'self' 'nonce-abc123'");
  });

  it('removes nonce placeholder when no nonce provided', () => {
    const result = buildCspString({
      'script-src': ["'self'", "'nonce-{{nonce}}'"],
    });

    expect(result).toBe("script-src 'self'");
  });

  it('does not inject nonce without placeholder', () => {
    const result = buildCspString({
      'script-src': ["'self'"],
    }, 'abc123');

    expect(result).toBe("script-src 'self'");
  });
});
