import type { SecurityHeadersConfig } from './headers';
import type { RateLimitConfig } from './rate-limit';
import type { CorsConfig } from './cors';
import type { CsrfConfig } from './csrf';
import type { MethodRestricterConfig } from './method-restricter';
import type { RequestSizeConfig } from './request-size';
import type { XssConfig } from './xss';
import type { NonceConfig } from './nonce';

export interface SecurityModuleConfig {
  headers?: SecurityHeadersConfig | false;
  rateLimit?: RateLimitConfig | false;
  cors?: CorsConfig | false;
  csrf?: CsrfConfig | false;
  methodRestricter?: MethodRestricterConfig | false;
  requestSize?: RequestSizeConfig | false;
  xss?: XssConfig | false;
  nonce?: NonceConfig | false;
}
