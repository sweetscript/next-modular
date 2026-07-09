import type { NextConfig } from 'next';
import type { ModuleDefinition } from './types';

/**
 * Merges all module nextConfig declarations with the user's Next.js config.
 * Module configs are applied first; user config takes precedence (runs last).
 */
export function mergeModuleConfigs(
  modules: ModuleDefinition[],
  userConfig: NextConfig = {}
): NextConfig {
  const modulesWithConfig = modules.filter((m) => m.nextConfig);

  if (modulesWithConfig.length === 0) {
    return userConfig;
  }

  return {
    ...userConfig,
    headers: mergeHeaders(modulesWithConfig, userConfig.headers),
    redirects: mergeRedirects(modulesWithConfig, userConfig.redirects),
    rewrites: mergeRewrites(modulesWithConfig, userConfig.rewrites),
    webpack: mergeWebpack(modulesWithConfig, userConfig.webpack),
  };
}

function mergeHeaders(
  modules: ModuleDefinition[],
  userHeaders: NextConfig['headers']
): NextConfig['headers'] {
  const moduleHeaderFns = modules
    .map((m) => m.nextConfig?.headers)
    .filter((h): h is NonNullable<NextConfig['headers']> => !!h);

  if (moduleHeaderFns.length === 0) return userHeaders;

  return async () => {
    const results = await Promise.all(moduleHeaderFns.map((fn) => fn()));
    const moduleHeaders = results.flat();
    const userResult = userHeaders ? await userHeaders() : [];
    // User headers last so they override modules
    return [...moduleHeaders, ...userResult];
  };
}

function mergeRedirects(
  modules: ModuleDefinition[],
  userRedirects: NextConfig['redirects']
): NextConfig['redirects'] {
  const moduleRedirectFns = modules
    .map((m) => m.nextConfig?.redirects)
    .filter((r): r is NonNullable<NextConfig['redirects']> => !!r);

  if (moduleRedirectFns.length === 0) return userRedirects;

  return async () => {
    const results = await Promise.all(moduleRedirectFns.map((fn) => fn()));
    const moduleRedirects = results.flat();
    const userResult = userRedirects ? await userRedirects() : [];
    // User redirects last so they override modules
    return [...moduleRedirects, ...userResult];
  };
}

function mergeRewrites(
  modules: ModuleDefinition[],
  userRewrites: NextConfig['rewrites']
): NextConfig['rewrites'] {
  const moduleRewriteFns = modules
    .map((m) => m.nextConfig?.rewrites)
    .filter((r): r is NonNullable<NextConfig['rewrites']> => !!r);

  if (moduleRewriteFns.length === 0) return userRewrites;

  return async () => {
    const results = await Promise.all(moduleRewriteFns.map((fn) => fn()));
    const userResult = userRewrites ? await userRewrites() : { beforeFiles: [], afterFiles: [], fallback: [] };

    // Normalise each result into the object form
    const normalise = (r: Awaited<ReturnType<NonNullable<NextConfig['rewrites']>>>) =>
      Array.isArray(r)
        ? { beforeFiles: [], afterFiles: r, fallback: [] }
        : { beforeFiles: r.beforeFiles ?? [], afterFiles: r.afterFiles ?? [], fallback: r.fallback ?? [] };

    const normalisedUser = normalise(userResult);
    const normalisedModules = results.map(normalise);

    return {
      beforeFiles: [
        ...normalisedModules.flatMap((r) => r.beforeFiles),
        ...normalisedUser.beforeFiles,
      ],
      afterFiles: [
        ...normalisedModules.flatMap((r) => r.afterFiles),
        ...normalisedUser.afterFiles,
      ],
      fallback: [
        ...normalisedModules.flatMap((r) => r.fallback),
        ...normalisedUser.fallback,
      ],
    };
  };
}

function mergeWebpack(
  modules: ModuleDefinition[],
  userWebpack: NextConfig['webpack']
): NextConfig['webpack'] {
  const moduleWebpackFns = modules
    .map((m) => m.nextConfig?.webpack)
    .filter((w): w is NonNullable<NextConfig['webpack']> => !!w);

  if (moduleWebpackFns.length === 0) return userWebpack;

  // Compose: module fns run first (in order), user fn runs last
  return (config, context) => {
    let result = config;
    for (const fn of moduleWebpackFns) {
      result = fn(result, context);
    }
    if (userWebpack) {
      result = userWebpack(result, context);
    }
    return result;
  };
}
