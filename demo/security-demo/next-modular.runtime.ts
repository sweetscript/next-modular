/**
 * Runtime module initialization
 * This file is imported by the catch-all routes to ensure modules are registered at runtime
 */
import { configureModules } from 'next-modular';
import { modules } from './modules.config';

// Initialize modules for runtime
configureModules({
  modules,
});

export { modules };
