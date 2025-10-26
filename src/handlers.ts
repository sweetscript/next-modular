import { NextRequest, NextResponse } from 'next/server';
import { matchRoute, matchApiRoute } from './routeMatcher';
import { moduleRegistry } from './registry';
import { ensureModulesInitialized } from './config';

/**
 * Handle route requests - to be used in catch-all route
 */
export async function handleRoute(pathname: string) {
  // Ensure modules are initialized at runtime
  ensureModulesInitialized();
  
  const modules = moduleRegistry.getAllModules();
  console.log('[next-modular] handleRoute called for:', pathname);
  console.log('[next-modular] Registered modules:', modules.map(m => `${m.name} (${m.basePath})`));
  
  const match = matchRoute(pathname);
  
  if (!match) {
    console.log('[next-modular] No match found for:', pathname);
    return null;
  }

  // Check if module and routes feature are enabled
  const moduleConfig = match.module.config;
  if (moduleConfig?.enabled === false) {
    console.log('[next-modular] Module is disabled:', match.module.name);
    return null;
  }
  
  if (moduleConfig?.features?.routes === false) {
    console.log('[next-modular] Routes feature is disabled for module:', match.module.name);
    return null;
  }

  console.log('[next-modular] Matched route:', match.module.name, match.route.path, 'params:', match.params);
  const { route, params } = match;
  return { component: route.component, params };
}

/**
 * Handle API route requests - to be used in catch-all API route
 */
export async function handleApiRoute(req: Request, pathname: string, context?: any) {
  // Ensure modules are initialized at runtime
  ensureModulesInitialized();
  
  const match = matchApiRoute(pathname);
  
  if (!match) {
    return new Response('Not Found', { status: 404 });
  }

  // Check if module and API routes feature are enabled
  const moduleConfig = match.module.config;
  if (moduleConfig?.enabled === false) {
    return new Response(
      JSON.stringify({ error: 'Module is disabled' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  if (moduleConfig?.features?.apiRoutes === false) {
    return new Response(
      JSON.stringify({ error: 'API routes are disabled for this module' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { route, params } = match;
  
  // Merge params into context
  const enhancedContext = {
    ...context,
    params: {
      ...context?.params,
      ...params
    }
  };

  return route.handler(req, enhancedContext);
}

/**
 * Handle middleware - to be called from app middleware
 */
export async function handleMiddleware(req: NextRequest): Promise<NextResponse | void> {
  // Ensure modules are initialized at runtime
  ensureModulesInitialized();
  
  const pathname = req.nextUrl.pathname;
  const modules = moduleRegistry.getAllModules();

  for (const module of modules) {
    if (!module.middleware) continue;

    // Check if module and middleware feature are enabled
    const moduleConfig = module.config;
    if (moduleConfig?.enabled === false) continue;
    if (moduleConfig?.features?.middleware === false) continue;

    // Check if path is within this module's scope
    if (pathname.startsWith(module.basePath) || pathname.startsWith(`/api${module.basePath}`)) {
      const result = await module.middleware.handler(req);
      if (result) {
        return result;
      }
    }
  }

  return;
}

