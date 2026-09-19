import type { ModuleRoute, RouteGenerateMetadata } from './types';
import type { Metadata } from 'next';

/**
 * Shape of a route file imported as a namespace, e.g. `import * as home`.
 * Mirrors the exports of an idiomatic Next.js page: a default component plus
 * optional `metadata` / `generateMetadata`.
 */
export interface RouteModule {
  default: React.ComponentType<any>;
  metadata?: Metadata;
  generateMetadata?: RouteGenerateMetadata;
}

/**
 * Wire a route file into a ModuleRoute.
 *
 * Lets a route file stay idiomatic — export a default component and optionally
 * `metadata` / `generateMetadata` — while the module definition stays terse:
 *
 *   import * as home from './routes/home';
 *   routes: [ route('/', home) ]
 *
 * The plain `{ path, component }` object form still works; this is optional sugar.
 */
export function route(path: string, mod: RouteModule): ModuleRoute {
  return {
    path,
    component: mod.default,
    metadata: mod.metadata,
    generateMetadata: mod.generateMetadata,
  };
}
