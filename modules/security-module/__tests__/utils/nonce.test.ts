import { describe, it, expect } from 'vitest';
import { generateNonce } from '../../src/utils/nonce';

describe('generateNonce', () => {
  it('returns a non-empty string', () => {
    const nonce = generateNonce();
    expect(nonce).toBeTruthy();
    expect(typeof nonce).toBe('string');
  });

  it('returns a base64 encoded string', () => {
    const nonce = generateNonce();
    expect(() => atob(nonce)).not.toThrow();
  });

  it('generates unique values', () => {
    const nonces = new Set(Array.from({ length: 100 }, () => generateNonce()));
    expect(nonces.size).toBe(100);
  });
});
