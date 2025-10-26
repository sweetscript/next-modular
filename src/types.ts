import { NextRequest, NextResponse } from 'next/server';

export interface ModuleRoute {
  path: string;
  component: React.ComponentType<any>;
}

export interface ModuleApiRoute {
  path: string;
  handler: (req: Request, context: any) => Promise<Response> | Response;
}

export interface ModuleMiddleware {
  handler: (req: NextRequest) => Promise<NextResponse | void> | NextResponse | void;
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

export interface ModuleDefinition<TConfig = any> {
  name: string;
  basePath: string;
  routes?: ModuleRoute[];
  apiRoutes?: ModuleApiRoute[];
  middleware?: ModuleMiddleware;
  config?: BaseModuleConfig & TConfig;
  _configurable?: boolean;
  _configure?: (config?: TConfig) => ModuleDefinition<TConfig>;
}

export interface NextModularConfig {
  modules: ModuleDefinition[];
}

