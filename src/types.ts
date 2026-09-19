import type { NextConfig, Metadata } from 'next';

/**
 * Metadata for a module route. Either a static object or a function that
 * receives the matched route params and returns metadata (sync or async).
 *
 * Note: `params` is passed as a plain resolved object, not a Promise. Module
 * routes render through the catch-all page rather than directly by Next.js, so
 * next-modular resolves the params before calling `generateMetadata`.
 */
export type RouteGenerateMetadata = (args: {
  params: Record<string, string>;
}) => Metadata | Promise<Metadata>;

export interface ModuleRoute {
  path: string;
  component: React.ComponentType<any>;
  /** Static metadata for this route ("being passed"). */
  metadata?: Metadata;
  /** Dynamic metadata resolved from the route params ("read from route"). */
  generateMetadata?: RouteGenerateMetadata;
}

export interface ModuleApiRoute {
  path: string;
  handler: (req: Request, context: any) => Promise<Response> | Response;
}

export interface ModuleMiddleware {
  // Typed as `any` for the request to avoid NextRequest version conflicts
  // in monorepo setups where next-modular and the app may resolve different
  // versions of next. The proxy always passes a real NextRequest at runtime.
  handler: (req: any) => Promise<any> | any;
  /**
   * When true, the middleware runs on every request instead of only paths
   * under the module's basePath. Any per-path filtering is left to the handler.
   */
  global?: boolean;
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

