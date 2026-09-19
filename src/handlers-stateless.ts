import type { Metadata } from 'next';
import { ModuleDefinition } from './types';
import { matchRouteIn, matchApiRouteIn } from './routeMatcher';
import { resolveRouteMetadata } from './metadata';

/**
 * Stateless version of handleRoute.
 * Accepts modules directly — no global registry, safe for Edge Runtime.
 */
export async function handleRouteWith(
  modules: ModuleDefinition[],
  pathname: string
) {
  const match = matchRouteIn(modules, pathname);

  if (!match) return null;

  const moduleConfig = match.module.config;
  if (moduleConfig?.enabled === false) return null;
  if (moduleConfig?.features?.routes === false) return null;

  return { component: match.route.component, params: match.params };
}

/**
 * Stateless version of handleApiRoute.
 * Accepts modules directly — no global registry, safe for Edge Runtime.
 */
export async function handleApiRouteWith(
  modules: ModuleDefinition[],
  req: Request,
  pathname: string,
  context?: any
): Promise<Response> {
  const match = matchApiRouteIn(modules, pathname);

  if (!match) {
    return new Response('Not Found', { status: 404 });
  }

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

  const enhancedContext = {
    ...context,
    params: {
      ...context?.params,
      ...match.params,
    },
  };

  return match.route.handler(req, enhancedContext);
}

/**
 * Stateless version of handleMiddleware.
 * Accepts modules directly — no global registry, safe for Edge Runtime.
 */
export async function handleMiddlewareWith(
  modules: ModuleDefinition[],
  req: any
): Promise<any> {
  const pathname = req.nextUrl?.pathname ?? new URL(req.url).pathname;

  for (const module of modules) {
    if (!module.middleware) continue;

    const moduleConfig = module.config;
    if (moduleConfig?.enabled === false) continue;
    if (moduleConfig?.features?.middleware === false) continue;

    // Global middleware runs on every request; otherwise scope to basePath.
    const inScope =
      module.middleware.global === true ||
      pathname.startsWith(module.basePath) ||
      pathname.startsWith(`/api${module.basePath}`);

    if (inScope) {
      const result = await module.middleware.handler(req);
      if (result) return result;
    }
  }

  return null;
}

/**
 * Stateless version of handleMetadata.
 * Accepts modules directly — no global registry, safe for Edge Runtime.
 */
export async function handleMetadataWith(
  modules: ModuleDefinition[],
  pathname: string
): Promise<Metadata | null> {
  const match = matchRouteIn(modules, pathname);
  if (!match) return null;

  return resolveRouteMetadata(match.route, match.params);
}
