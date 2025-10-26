import { NextModularConfig } from './types';
import { moduleRegistry } from './registry';

// Store the configuration for runtime initialization
let runtimeConfig: NextModularConfig | null = null;

/**
 * Configure Next Modular with modules
 */
export function configureModules(config: NextModularConfig) {
  // Store config for runtime
  runtimeConfig = config;
  
  // Clear existing modules
  moduleRegistry.clear();

  // Register all modules
  for (const module of config.modules) {
    moduleRegistry.register(module);
  }

  return config;
}

/**
 * Get the runtime configuration
 */
export function getRuntimeConfig(): NextModularConfig | null {
  return runtimeConfig;
}

/**
 * Ensure modules are initialized (call this from runtime code)
 */
export function ensureModulesInitialized() {
  if (runtimeConfig && moduleRegistry.getAllModules().length === 0) {
    configureModules(runtimeConfig);
  }
}

/**
 * Create a Next.js config plugin for Next Modular
 */
export function withNextModular(config: NextModularConfig) {
  return (nextConfig: any = {}) => {
    // Initialize modules
    configureModules(config);

    return {
      ...nextConfig,
      // You can add Next.js config modifications here if needed
    };
  };
}

