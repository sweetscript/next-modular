/**
 * Next Modular build-time config.
 *
 * This file is imported by next.config.ts at build time.
 * It must NOT import React components or anything that cannot run
 * in a plain Node.js CJS context (no JSX, no client-only APIs).
 *
 * Pass stripped module definitions — only nextConfig is needed here.
 * Routes, apiRoutes, and middleware are registered at runtime via next-modular.runtime.ts.
 */
import type { ModuleDefinition } from 'next-modular';
import { nextConfigTestModule } from './modules/next-config-test-module/src';

// Strip routes/apiRoutes/middleware — only keep nextConfig for the build step
function buildOnly(module: ModuleDefinition): ModuleDefinition {
  return {
    name: module.name,
    basePath: module.basePath,
    nextConfig: module.nextConfig,
  };
}

export const nextModularBuildConfig = {
  modules: [
    buildOnly(nextConfigTestModule),
  ],
};
