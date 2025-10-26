import { ModuleDefinition, BaseModuleConfig } from './types';

/**
 * Define a Next.js module with routes, API endpoints, and middleware
 * Can be called with config to create a configured instance: authModule({ enabled: true })
 */
export function defineModule<TConfig = any>(
  definition: Omit<ModuleDefinition<TConfig>, '_configurable' | '_configure'>
): ModuleDefinition<TConfig> & ((config?: Partial<BaseModuleConfig & TConfig>) => ModuleDefinition<TConfig>) {
  // Validate module definition
  if (!definition.name) {
    throw new Error('Module name is required');
  }
  
  if (!definition.basePath) {
    throw new Error('Module basePath is required');
  }

  // Ensure basePath starts with /
  if (!definition.basePath.startsWith('/')) {
    definition.basePath = '/' + definition.basePath;
  }

  // Remove trailing slash from basePath
  if (definition.basePath.endsWith('/') && definition.basePath.length > 1) {
    definition.basePath = definition.basePath.slice(0, -1);
  }

  // Set default base config
  const defaultConfig: BaseModuleConfig = {
    enabled: true,
    features: {
      routes: true,
      apiRoutes: true,
      middleware: true,
    },
  };

  const baseDefinition: ModuleDefinition<TConfig> = {
    ...definition,
    config: {
      ...defaultConfig,
      ...definition.config,
    } as BaseModuleConfig & TConfig,
    _configurable: true,
  };

  // Create a callable module that can accept configuration
  const configurableModule = function(userConfig?: Partial<BaseModuleConfig & TConfig>): ModuleDefinition<TConfig> {
    const mergedConfig = {
      ...defaultConfig,
      ...definition.config,
      ...userConfig,
      features: {
        ...defaultConfig.features,
        ...definition.config?.features,
        ...(userConfig as any)?.features,
      },
    };

    return {
      ...definition,
      config: mergedConfig as BaseModuleConfig & TConfig,
      _configurable: true,
    };
  } as ModuleDefinition<TConfig> & ((config?: Partial<BaseModuleConfig & TConfig>) => ModuleDefinition<TConfig>);

  // Copy all non-function properties to the function object
  // We need to be careful not to override read-only properties like 'name', 'length', etc.
  Object.keys(baseDefinition).forEach((key) => {
    if (key !== 'name' && key !== 'length' && key !== 'prototype') {
      try {
        (configurableModule as any)[key] = (baseDefinition as any)[key];
      } catch {
        // Ignore read-only property errors
      }
    }
  });

  return configurableModule;
}

