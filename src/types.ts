import type { NextConfig } from 'next';

export interface ModuleRoute {
  path: string;
  component: React.ComponentType<any>;
}

export interface ModuleApiRoute {
  path: string;
  handler: (req: Request, context: any) => Promise<Response> | Response;
}

export interface ModuleMiddleware {
  // Typed as `any` for the request to avoid NextRequest version conflicts
  // in monorepo setups where next-modular and the app may resolve different
  // versions of next. The proxy always passes a real NextRequest at runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (req: any) => Promise<any> | any;
}

/**
 * Base configuration available to all modules
 */
export interface BaseModuleConfig {
  enabled?: boolean;
  features?: {
    routes?: boolean;
    apiRoutes?: boolean;
    middleware?: boolean;
  };
}

/**
 * Next.js config contributions a module can declare.
 * Merged by withNextModular into the final next.config.
 */
export interface ModuleNextConfig {
  headers?: NonNullable<NextConfig['headers']>;
  redirects?: NonNullable<NextConfig['redirects']>;
  rewrites?: NonNullable<NextConfig['rewrites']>;
  webpack?: NonNullable<NextConfig['webpack']>;
}

export interface ModuleDefinition<TConfig = any> {
  name: string;
  basePath: string;
  routes?: ModuleRoute[];
  apiRoutes?: ModuleApiRoute[];
  middleware?: ModuleMiddleware;
  nextConfig?: ModuleNextConfig;
  staticParams?: () => Promise<Array<{ path: string }>>;
  config?: BaseModuleConfig & TConfig;
  _configurable?: boolean;
  _configure?: (config?: TConfig) => ModuleDefinition<TConfig>;
}

export interface NextModularConfig {
  modules: ModuleDefinition[];
}

