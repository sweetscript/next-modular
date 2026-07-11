import { defineModule } from 'next-modular';
import { securityMiddleware } from './server/middleware';
import type { SecurityModuleConfig } from './types';

export type {
  SecurityModuleConfig,
  SecurityHeadersConfig,
  ContentSecurityPolicyConfig,
  PermissionsPolicyConfig,
  HstsConfig,
  RateLimitConfig,
  CorsConfig,
  CsrfConfig,
  MethodRestricterConfig,
  RequestSizeConfig,
  XssConfig,
  NonceConfig,
} from './types';

export const securityModule = defineModule<SecurityModuleConfig>({
  name: 'security-module',
  basePath: '/',
  middleware: {
    handler: securityMiddleware,
  },
});

export default securityModule;
