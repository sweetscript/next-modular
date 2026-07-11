/**
 * Runtime-only entry point for next-config-test-module.
 * Import this from modules.config.ts (not next-modular.config.ts).
 * Contains React components — not safe for next.config.ts context.
 */
import NextConfigTestPage from './routes/home';
import { nextConfigTestModule } from './index';
import type { ModuleDefinition } from 'next-modular';

// Attach routes directly to the existing module definition object
const withRoutes: ModuleDefinition = {
  name: nextConfigTestModule.name,
  basePath: nextConfigTestModule.basePath,
  nextConfig: nextConfigTestModule.nextConfig,
  routes: [
    { path: '/', component: NextConfigTestPage },
    { path: '/[slug]', component: NextConfigTestPage },
  ],
};

export const nextConfigTestModuleWithRoutes = withRoutes;
export { nextConfigTestModule };
