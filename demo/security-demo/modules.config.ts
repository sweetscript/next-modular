import { securityModule } from '@next-modular/security-module';

export const modules = [
  securityModule({
    headers: {
      xFrameOptions: 'SAMEORIGIN',
      referrerPolicy: 'strict-origin-when-cross-origin',
      contentSecurityPolicy: {
        'base-uri': ["'none'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'script-src': ["'self'", 'https:', "'unsafe-inline'", "'unsafe-eval'"],
        'upgrade-insecure-requests': true,
      },
    },
    rateLimit: {
      enabled: true,
      windowMs: 60_000,
      max: 100,
    },
    cors: {
      enabled: true,
      origins: ['http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    xss: {
      enabled: true,
    },
    requestSize: {
      enabled: true,
      maxBodySize: 2_000_000,
      maxUploadSize: 8_000_000,
    },
  }),
];
