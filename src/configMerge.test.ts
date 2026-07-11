import { describe, it, expect, vi } from 'vitest';
import { mergeModuleConfigs } from './configMerge';
import type { ModuleDefinition } from './types';

// Minimal module factory for tests
function makeModule(overrides: Partial<ModuleDefinition> = {}): ModuleDefinition {
  return {
    name: 'test-module',
    basePath: '/test',
    ...overrides,
  };
}

describe('mergeModuleConfigs', () => {
  describe('no modules with nextConfig', () => {
    it('returns the user config unchanged', () => {
      const userConfig = { reactStrictMode: true };
      const module = makeModule(); // no nextConfig
      const result = mergeModuleConfigs([module], userConfig);
      expect(result).toEqual(userConfig);
    });

    it('returns empty object when both are empty', () => {
      const result = mergeModuleConfigs([], {});
      expect(result).toEqual({});
    });
  });

  describe('headers', () => {
    it('merges module headers with user headers', async () => {
      const module = makeModule({
        nextConfig: {
          headers: async () => [
            { source: '/test/:path*', headers: [{ key: 'X-Module', value: 'true' }] },
          ],
        },
      });

      const userConfig = {
        headers: async () => [
          { source: '/user/:path*', headers: [{ key: 'X-User', value: 'true' }] },
        ],
      };

      const result = mergeModuleConfigs([module], userConfig);
      const headers = await result.headers!();

      expect(headers).toHaveLength(2);
      expect(headers[0].source).toBe('/test/:path*');
      expect(headers[1].source).toBe('/user/:path*');
    });

    it('user headers appear after module headers (user takes precedence)', async () => {
      const module = makeModule({
        nextConfig: {
          headers: async () => [
            { source: '/:path*', headers: [{ key: 'X-Header', value: 'module' }] },
          ],
        },
      });

      const userConfig = {
        headers: async () => [
          { source: '/:path*', headers: [{ key: 'X-Header', value: 'user' }] },
        ],
      };

      const result = mergeModuleConfigs([module], userConfig);
      const headers = await result.headers!();

      expect(headers[0].headers[0].value).toBe('module');
      expect(headers[1].headers[0].value).toBe('user');
    });

    it('merges headers from multiple modules', async () => {
      const moduleA = makeModule({
        name: 'module-a',
        nextConfig: {
          headers: async () => [
            { source: '/a/:path*', headers: [{ key: 'X-A', value: 'a' }] },
          ],
        },
      });

      const moduleB = makeModule({
        name: 'module-b',
        nextConfig: {
          headers: async () => [
            { source: '/b/:path*', headers: [{ key: 'X-B', value: 'b' }] },
          ],
        },
      });

      const result = mergeModuleConfigs([moduleA, moduleB], {});
      const headers = await result.headers!();

      expect(headers).toHaveLength(2);
      expect(headers[0].source).toBe('/a/:path*');
      expect(headers[1].source).toBe('/b/:path*');
    });

    it('works with no user headers', async () => {
      const module = makeModule({
        nextConfig: {
          headers: async () => [
            { source: '/test', headers: [{ key: 'X-Test', value: '1' }] },
          ],
        },
      });

      const result = mergeModuleConfigs([module], {});
      const headers = await result.headers!();
      expect(headers).toHaveLength(1);
    });
  });

  describe('redirects', () => {
    it('merges module redirects with user redirects', async () => {
      const module = makeModule({
        nextConfig: {
          redirects: async () => [
            { source: '/old', destination: '/new', permanent: true },
          ],
        },
      });

      const userConfig = {
        redirects: async () => [
          { source: '/legacy', destination: '/current', permanent: false },
        ],
      };

      const result = mergeModuleConfigs([module], userConfig);
      const redirects = await result.redirects!();

      expect(redirects).toHaveLength(2);
      expect(redirects[0].source).toBe('/old');
      expect(redirects[1].source).toBe('/legacy');
    });

    it('works with no user redirects', async () => {
      const module = makeModule({
        nextConfig: {
          redirects: async () => [
            { source: '/old', destination: '/new', permanent: true },
          ],
        },
      });

      const result = mergeModuleConfigs([module], {});
      const redirects = await result.redirects!();
      expect(redirects).toHaveLength(1);
    });
  });

  describe('rewrites', () => {
    it('merges beforeFiles from modules and user', async () => {
      const module = makeModule({
        nextConfig: {
          rewrites: async () => ({
            beforeFiles: [{ source: '/module-alias', destination: '/module' }],
          }),
        },
      });

      const userConfig = {
        rewrites: async () => ({
          beforeFiles: [{ source: '/user-alias', destination: '/user' }],
        }),
      };

      const result = mergeModuleConfigs([module], userConfig);
      const rewrites = await result.rewrites!() as { beforeFiles: any[]; afterFiles: any[]; fallback: any[] };

      expect(rewrites.beforeFiles).toHaveLength(2);
      expect(rewrites.beforeFiles[0].source).toBe('/module-alias');
      expect(rewrites.beforeFiles[1].source).toBe('/user-alias');
    });

    it('merges afterFiles and fallback separately', async () => {
      const module = makeModule({
        nextConfig: {
          rewrites: async () => ({
            afterFiles: [{ source: '/after-module', destination: '/module' }],
            fallback: [{ source: '/fallback-module', destination: '/module' }],
          }),
        },
      });

      const userConfig = {
        rewrites: async () => ({
          afterFiles: [{ source: '/after-user', destination: '/user' }],
          fallback: [{ source: '/fallback-user', destination: '/user' }],
        }),
      };

      const result = mergeModuleConfigs([module], userConfig);
      const rewrites = await result.rewrites!() as { beforeFiles: any[]; afterFiles: any[]; fallback: any[] };

      expect(rewrites.afterFiles[0].source).toBe('/after-module');
      expect(rewrites.afterFiles[1].source).toBe('/after-user');
      expect(rewrites.fallback[0].source).toBe('/fallback-module');
      expect(rewrites.fallback[1].source).toBe('/fallback-user');
    });

    it('handles array-form user rewrites', async () => {
      const module = makeModule({
        nextConfig: {
          rewrites: async () => ({
            beforeFiles: [{ source: '/module-alias', destination: '/module' }],
          }),
        },
      });

      // User returns a flat array (valid Next.js form)
      const userConfig = {
        rewrites: async () => [{ source: '/user-alias', destination: '/user' }],
      };

      const result = mergeModuleConfigs([module], userConfig);
      const rewrites = await result.rewrites!() as { beforeFiles: any[]; afterFiles: any[]; fallback: any[] };

      expect(rewrites.beforeFiles).toHaveLength(1);
      expect(rewrites.afterFiles).toHaveLength(1);
    });
  });

  describe('webpack', () => {
    it('composes module webpack fns with user webpack fn', () => {
      const moduleFn = vi.fn((config: any) => ({ ...config, modulePlugin: true }));
      const userFn = vi.fn((config: any) => ({ ...config, userPlugin: true }));

      const module = makeModule({ nextConfig: { webpack: moduleFn } });
      const userConfig = { webpack: userFn };

      const result = mergeModuleConfigs([module], userConfig);
      const finalConfig = result.webpack!({ plugins: [] } as any, {} as any);

      expect(moduleFn).toHaveBeenCalledOnce();
      expect(userFn).toHaveBeenCalledOnce();
      expect(finalConfig).toMatchObject({ modulePlugin: true, userPlugin: true });
    });

    it('module webpack runs before user webpack', () => {
      const order: string[] = [];
      const module = makeModule({
        nextConfig: {
          webpack: (config) => { order.push('module'); return config; },
        },
      });
      const userConfig = {
        webpack: (config: any) => { order.push('user'); return config; },
      };

      const result = mergeModuleConfigs([module], userConfig);
      result.webpack!({} as any, {} as any);

      expect(order).toEqual(['module', 'user']);
    });

    it('composes multiple module webpack fns in order', () => {
      const order: string[] = [];
      const moduleA = makeModule({
        name: 'a',
        nextConfig: { webpack: (c) => { order.push('a'); return c; } },
      });
      const moduleB = makeModule({
        name: 'b',
        nextConfig: { webpack: (c) => { order.push('b'); return c; } },
      });

      const result = mergeModuleConfigs([moduleA, moduleB], {});
      result.webpack!({} as any, {} as any);

      expect(order).toEqual(['a', 'b']);
    });

    it('works with no user webpack', () => {
      const moduleFn = vi.fn((config: any) => config);
      const module = makeModule({ nextConfig: { webpack: moduleFn } });

      const result = mergeModuleConfigs([module], {});
      result.webpack!({} as any, {} as any);

      expect(moduleFn).toHaveBeenCalledOnce();
    });
  });

  describe('preserves other user config properties', () => {
    it('passes through unrelated user config untouched', () => {
      const module = makeModule({
        nextConfig: {
          headers: async () => [],
        },
      });

      const userConfig = { reactStrictMode: true, poweredByHeader: false };
      const result = mergeModuleConfigs([module], userConfig);

      expect(result.reactStrictMode).toBe(true);
      expect(result.poweredByHeader).toBe(false);
    });
  });
});
