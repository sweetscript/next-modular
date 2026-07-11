export { defineModule } from './defineModule';
export { moduleRegistry } from './registry';
export { matchRoute, matchApiRoute, matchRouteIn, matchApiRouteIn } from './routeMatcher';
export { handleRoute, handleApiRoute, handleMiddleware } from './handlers';
export { handleRouteWith, handleApiRouteWith, handleMiddlewareWith } from './handlers-stateless';
export { configureModules, withNextModular, ensureModulesInitialized } from './config';
export { mergeModuleConfigs } from './configMerge';
export { getAllModuleStaticParams } from './staticParams';

export type {
  ModuleRoute,
  ModuleApiRoute,
  ModuleMiddleware,
  ModuleDefinition,
  ModuleNextConfig,
  NextModularConfig,
  BaseModuleConfig,
} from './types';

import { moduleRegistry } from './registry';

/**
 * Helper function to get module config
 */
export function getModuleConfig<TConfig = any>(moduleName: string): TConfig | undefined {
  return moduleRegistry.getModuleConfig<TConfig>(moduleName);
}

