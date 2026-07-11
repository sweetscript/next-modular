export interface HstsConfig {
  maxAge: number;
  includeSubDomains?: boolean;
  preload?: boolean;
}

export interface PermissionsPolicyConfig {
  camera?: string[];
  microphone?: string[];
  geolocation?: string[];
  fullscreen?: string[];
  'display-capture'?: string[];
  [key: string]: string[] | undefined;
}

export interface ContentSecurityPolicyConfig {
  'base-uri'?: string[];
  'font-src'?: string[];
  'form-action'?: string[];
  'frame-ancestors'?: string[];
  'img-src'?: string[];
  'object-src'?: string[];
  'script-src'?: string[];
  'script-src-attr'?: string[];
  'style-src'?: string[];
  'upgrade-insecure-requests'?: boolean;
  'connect-src'?: string[];
  'default-src'?: string[];
  'media-src'?: string[];
  [key: string]: string[] | boolean | undefined;
}

export interface SecurityHeadersConfig {
  xFrameOptions?: string | false;
  xContentTypeOptions?: string | false;
  referrerPolicy?: string | false;
  hsts?: HstsConfig | false;
  contentSecurityPolicy?: ContentSecurityPolicyConfig | string | false;
  crossOriginResourcePolicy?: string | false;
  crossOriginOpenerPolicy?: string | false;
  crossOriginEmbedderPolicy?: string | false;
  xDnsPrefetchControl?: string | false;
  xDownloadOptions?: string | false;
  xPermittedCrossDomainPolicies?: string | false;
  permissionsPolicy?: PermissionsPolicyConfig | false;
  hidePoweredBy?: boolean;
}
