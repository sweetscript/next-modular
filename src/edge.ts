/**
 * next-modular/edge
 *
 * Edge Runtime compatible entry point.
 * Exports stateless handlers that accept modules directly — no global registry,
 * no Node.js APIs. Safe to use with `export const runtime = 'edge'`.
 *
 * Usage:
 *   import { handleApiRouteWith, handleMiddlewareWith } from 'next-modular/edge';
 */
export { handleRouteWith, handleApiRouteWith, handleMiddlewareWith } from './handlers-stateless';
export { matchRouteIn, matchApiRouteIn } from './routeMatcher';
export { defineModule } from './defineModule';

export type {
  ModuleDefinition,
  ModuleRoute,
  ModuleApiRoute,
  ModuleMiddleware,
  ModuleNextConfig,
  BaseModuleConfig,
} from './types';
