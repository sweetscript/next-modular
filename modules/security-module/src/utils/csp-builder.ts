import type { ContentSecurityPolicyConfig } from '../types';

export function buildCspString(config: ContentSecurityPolicyConfig, nonce?: string): string {
  const directives: string[] = [];

  for (const [key, value] of Object.entries(config)) {
    if (value === undefined || value === false) continue;

    if (value === true) {
      directives.push(key);
      continue;
    }

    if (Array.isArray(value)) {
      // Replace {{nonce}} placeholder if nonce is provided
      const sources = nonce
        ? value.map((s) => s === "'nonce-{{nonce}}'" ? `'nonce-${nonce}'` : s)
        : value.filter((s) => s !== "'nonce-{{nonce}}'");

      directives.push(`${key} ${sources.join(' ')}`);
    }
  }

  return directives.join('; ');
}
