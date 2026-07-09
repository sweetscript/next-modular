import { NextModularConfig } from './types';
import { moduleRegistry } from './registry';
import { mergeModuleConfigs } from './configMerge';
import type { NextConfig } from 'next';

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
 * Create a Next.js config plugin for Next Modular.
 * Registers modules and merges all module nextConfig declarations
 * (headers, redirects, rewrites, webpack) into the returned Next.js config.
 */
export function withNextModular(config: NextModularConfig) {
  return (nextConfig: NextConfig = {}): NextConfig => {
    // Initialize modules
    configureModules(config);

    const modules = moduleRegistry.getAllModules();

    // Merge module nextConfig contributions with user's config
    return mergeModuleConfigs(modules, nextConfig);
  };
}

