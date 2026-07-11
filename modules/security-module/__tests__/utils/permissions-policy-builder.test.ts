import { describe, it, expect } from 'vitest';
import { buildPermissionsPolicyString } from '../../src/utils/permissions-policy-builder';

describe('buildPermissionsPolicyString', () => {
  it('builds empty policy for empty arrays', () => {
    const result = buildPermissionsPolicyString({
      camera: [],
      microphone: [],
    });

    expect(result).toBe('camera=(), microphone=()');
  });

  it('builds policy with specific origins', () => {
    const result = buildPermissionsPolicyString({
      geolocation: ['self', 'https://maps.example.com'],
    });

    expect(result).toBe('geolocation=("self" "https://maps.example.com")');
  });

  it('skips undefined values', () => {
    const result = buildPermissionsPolicyString({
      camera: [],
      microphone: undefined,
    });

    expect(result).toBe('camera=()');
  });
});
