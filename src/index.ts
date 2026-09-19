export { defineModule } from './defineModule';
export { route } from './route';
export { moduleRegistry } from './registry';
export { matchRoute, matchApiRoute, matchRouteIn, matchApiRouteIn } from './routeMatcher';
export { handleRoute, handleApiRoute, handleMiddleware, handleMetadata } from './handlers';
export { handleRouteWith, handleApiRouteWith, handleMiddlewareWith, handleMetadataWith } from './handlers-stateless';
export { configureModules, withNextModular, ensureModulesInitialized } from './config';
export { mergeModuleConfigs } from './configMerge';
export { getAllModuleStaticParams } from './staticParams';
export { setDebug, isDebugEnabled } from './debug';

export type {
  ModuleRoute,
  ModuleApiRoute,
  ModuleMiddleware,
  ModuleDefinition,
  ModuleNextConfig,
  NextModularConfig,
  BaseModuleConfig,
  RouteGenerateMetadata,
} from './types';
export type { RouteModule } from './route';

import { moduleRegistry } from './registry';

/**
 * Helper function to get module config
 */
export function getModuleConfig<TConfig = any>(moduleName: string): TConfig | undefined {
  return moduleRegistry.getModuleConfig<TConfig>(moduleName);
}

