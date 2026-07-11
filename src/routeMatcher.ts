import { ModuleDefinition, ModuleRoute, ModuleApiRoute } from './types';
import { moduleRegistry } from './registry';

/**
 * Match a path against a given list of modules (stateless — no registry).
 * Used by both the registry-based and stateless handlers.
 */
export function matchRouteIn(
  modules: ModuleDefinition[],
  path: string
): { module: ModuleDefinition; route: ModuleRoute; params: Record<string, string> } | null {
  for (const module of modules) {
    if (!module.routes) continue;

    if (!path.startsWith(module.basePath)) continue;

    const relativePath = path === module.basePath ? '/' : path.slice(module.basePath.length);

    for (const route of module.routes) {
      const match = matchPath(relativePath, route.path);
      if (match) {
        return { module, route, params: match.params || {} };
      }
    }
  }

  return null;
}

/**
 * Match a path against API routes in a given list of modules (stateless — no registry).
 */
export function matchApiRouteIn(
  modules: ModuleDefinition[],
  path: string
): { module: ModuleDefinition; route: ModuleApiRoute; params: Record<string, string> } | null {
  for (const module of modules) {
    if (!module.apiRoutes) continue;

    const apiBasePath = `/api${module.basePath}`;
    if (!path.startsWith(apiBasePath)) continue;

    const relativePath = path === apiBasePath ? '/' : path.slice(apiBasePath.length);

    for (const route of module.apiRoutes) {
      const match = matchPath(relativePath, route.path);
      if (match) {
        return { module, route, params: match.params || {} };
      }
    }
  }

  return null;
}

/**
 * Match a path against registered module routes (reads from global registry).
 * Backward-compatible wrapper around matchRouteIn.
 */
export function matchRoute(
  path: string
): { module: ModuleDefinition; route: ModuleRoute; params: Record<string, string> } | null {
  return matchRouteIn(moduleRegistry.getAllModules(), path);
}

/**
 * Match a path against registered module API routes (reads from global registry).
 * Backward-compatible wrapper around matchApiRouteIn.
 */
export function matchApiRoute(
  path: string
): { module: ModuleDefinition; route: ModuleApiRoute; params: Record<string, string> } | null {
  return matchApiRouteIn(moduleRegistry.getAllModules(), path);
}

/**
 * Simple path matching with support for dynamic segments and catch-all routes
 */
function matchPath(pathname: string, pattern: string): { params?: Record<string, string> } | null {
  // Exact match
  if (pathname === pattern) {
    return { params: {} };
  }

  const patternParts = pattern.split('/').filter(Boolean);
  const pathnameParts = pathname.split('/').filter(Boolean);

  // Check for catch-all route
  const hasCatchAll = patternParts.some(part => part.startsWith('[...') && part.endsWith(']'));

  if (hasCatchAll) {
    const catchAllIndex = patternParts.findIndex(part => part.startsWith('[...') && part.endsWith(']'));

    for (let i = 0; i < catchAllIndex; i++) {
      if (i >= pathnameParts.length) return null;

      const patternPart = patternParts[i];
      const pathnamePart = pathnameParts[i];

      if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
        continue;
      }

      if (patternPart !== pathnamePart) {
        return null;
      }
    }

    const paramName = patternParts[catchAllIndex].slice(4, -1);
    const catchAllValue = pathnameParts.slice(catchAllIndex).join('/');

    return { params: { [paramName]: catchAllValue } };
  }

  if (patternParts.length !== pathnameParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathnamePart = pathnameParts[i];

    if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
      const paramName = patternPart.slice(1, -1);
      params[paramName] = pathnamePart;
      continue;
    }

    if (patternPart !== pathnamePart) {
      return null;
    }
  }

  return { params };
}
