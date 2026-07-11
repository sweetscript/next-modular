import { moduleRegistry } from './registry';
import { ensureModulesInitialized } from './config';

/**
 * Collects static params from all registered modules that declare `staticParams`.
 * Converts each module's basePath + relative path into the { module: string[] }
 * format expected by Next.js catch-all generateStaticParams.
 *
 * Usage in app/[...module]/page.tsx:
 *
 *   export async function generateStaticParams() {
 *     return getAllModuleStaticParams();
 *   }
 */
export async function getAllModuleStaticParams(): Promise<Array<{ module: string[] }>> {
  ensureModulesInitialized();

  const modules = moduleRegistry.getAllModules();
  const results: Array<{ module: string[] }> = [];

  for (const mod of modules) {
    if (!mod.staticParams) continue;

    // Skip disabled modules
    if (mod.config?.enabled === false) continue;

    const params = await mod.staticParams();

    for (const param of params) {
      // Combine basePath + relative path, then split into segments
      const fullPath = param.path === '/'
        ? mod.basePath
        : `${mod.basePath}${param.path.startsWith('/') ? param.path : `/${param.path}`}`;

      const segments = fullPath.split('/').filter(Boolean);

      results.push({ module: segments });
    }
  }

  return results;
}
