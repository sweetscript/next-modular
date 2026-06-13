import type { SecurityHeadersConfig, ContentSecurityPolicyConfig, PermissionsPolicyConfig } from '../types';

export const DEFAULT_CSP: ContentSecurityPolicyConfig = {
  'base-uri': ["'none'"],
  'font-src': ["'self'", 'https:', 'data:'],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
  'img-src': ["'self'", 'data:'],
  'object-src': ["'none'"],
  'script-src-attr': ["'none'"],
  'style-src': ["'self'", 'https:', "'unsafe-inline'"],
  'script-src': ["'self'", 'https:', "'unsafe-inline'"],
  'upgrade-insecure-requests': true,
};

export const DEFAULT_PERMISSIONS_POLICY: PermissionsPolicyConfig = {
  camera: [],
  'display-capture': [],
  fullscreen: [],
  geolocation: [],
  microphone: [],
};

export const DEFAULT_HEADERS: SecurityHeadersConfig = {
  xFrameOptions: 'SAMEORIGIN',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  hsts: { maxAge: 31536000, includeSubDomains: true },
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: 'same-origin',
  crossOriginOpenerPolicy: 'same-origin',
  crossOriginEmbedderPolicy: 'credentialless',
  xDnsPrefetchControl: 'off',
  xDownloadOptions: 'noopen',
  xPermittedCrossDomainPolicies: 'none',
  permissionsPolicy: DEFAULT_PERMISSIONS_POLICY,
  hidePoweredBy: true,
};
