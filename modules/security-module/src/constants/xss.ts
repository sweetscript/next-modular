import type { XssConfig } from '../types';

export const DEFAULT_XSS_PATTERNS: RegExp[] = [
  /<script[\s>]/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /eval\s*\(/i,
  /expression\s*\(/i,
  /vbscript:/i,
  /data:\s*text\/html/i,
];

export const DEFAULT_XSS: Required<XssConfig> = {
  enabled: true,
  patterns: DEFAULT_XSS_PATTERNS,
};
