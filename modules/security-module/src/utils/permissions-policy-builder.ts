import type { PermissionsPolicyConfig } from '../types';

export function buildPermissionsPolicyString(config: PermissionsPolicyConfig): string {
  const directives: string[] = [];

  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) continue;

    if (value.length === 0) {
      directives.push(`${key}=()`);
    } else {
      const sources = value.map((s) => `"${s}"`).join(' ');
      directives.push(`${key}=(${sources})`);
    }
  }

  return directives.join(', ');
}
