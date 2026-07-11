import type { CorsConfig } from '../types';

export const DEFAULT_CORS: Required<CorsConfig> = {
  enabled: false,
  origins: [],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: [],
  exposedHeaders: [],
  credentials: false,
  maxAge: 86400,
};
