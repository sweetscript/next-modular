import { ModuleDefinition, ModuleRoute, ModuleApiRoute } from './types';
import { moduleRegistry } from './registry';

/**
 * Match a path against registered module routes
 */
export function matchRoute(path: string): { module: ModuleDefinition; route: ModuleRoute; params: Record<string, string> } | null {
  const modules = moduleRegistry.getAllModules();

  for (const module of modules) {
    if (!module.routes) continue;

    // Check if path starts with module's basePath
    if (!path.startsWith(module.basePath)) continue;

    // Get the path relative to the module's basePath
    const relativePath = path === module.basePath ? '/' : path.slice(module.basePath.length);

    // Find matching route
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
 * Match a path against registered module API routes
 */
export function matchApiRoute(path: string): { module: ModuleDefinition; route: ModuleApiRoute; params: Record<string, string> } | null {
  const modules = moduleRegistry.getAllModules();

  for (const module of modules) {
    if (!module.apiRoutes) continue;

    // Check if path starts with module's basePath
    const apiBasePath = `/api${module.basePath}`;
    if (!path.startsWith(apiBasePath)) continue;

    // Get the path relative to the module's API basePath
    const relativePath = path === apiBasePath ? '/' : path.slice(apiBasePath.length);

    // Find matching API route
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
    
    // Check if parts before catch-all match
    for (let i = 0; i < catchAllIndex; i++) {
      if (i >= pathnameParts.length) return null;
      
      const patternPart = patternParts[i];
      const pathnamePart = pathnameParts[i];
      
      if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
        continue; // Dynamic segment, matches anything
      }
      
      if (patternPart !== pathnamePart) {
        return null;
      }
    }
    
    // Catch-all matches remaining path
    const paramName = patternParts[catchAllIndex].slice(4, -1); // Remove '[...' and ']'
    const catchAllValue = pathnameParts.slice(catchAllIndex).join('/');
    
    return { params: { [paramName]: catchAllValue } };
  }

  // Must have same number of parts if no catch-all
  if (patternParts.length !== pathnameParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathnamePart = pathnameParts[i];

    // Dynamic segment
    if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
      const paramName = patternPart.slice(1, -1);
      params[paramName] = pathnamePart;
      continue;
    }

    // Static segment must match exactly
    if (patternPart !== pathnamePart) {
      return null;
    }
  }

  return { params };
}

