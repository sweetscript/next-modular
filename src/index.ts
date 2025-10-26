export { defineModule } from './defineModule';
export { moduleRegistry } from './registry';
export { matchRoute, matchApiRoute } from './routeMatcher';
export { handleRoute, handleApiRoute, handleMiddleware } from './handlers';
export { configureModules, withNextModular, ensureModulesInitialized } from './config';

export type {
  ModuleRoute,
  ModuleApiRoute,
  ModuleMiddleware,
  ModuleDefinition,
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

