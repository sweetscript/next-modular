export interface SecurityHeaders {
  xFrameOptions?: string;
  xContentTypeOptions?: string;
  referrerPolicy?: string;
  hsts?: { maxAge: number; includeSubDomains?: boolean };
  csp?: string;
}

export interface RateLimitConfig {
  enabled?: boolean;
  window?: number;
  max?: number;
}

export interface CorsConfig {
  enabled?: boolean;
  origins?: string[];
  methods?: string[];
  credentials?: boolean;
}

export interface SecurityModuleConfig {
  headers?: SecurityHeaders;
  rateLimit?: RateLimitConfig;
  cors?: CorsConfig;
}
