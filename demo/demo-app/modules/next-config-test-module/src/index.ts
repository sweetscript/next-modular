import { defineModule } from 'next-modular';

/**
 * Test module for Plan 01: nextConfig extension.
 *
 * Declares headers, redirects, rewrites, and a webpack plugin.
 * Routes are intentionally omitted from this index to keep it
 * safe to import in next.config.ts (no React/JSX at build time).
 *
 * If you need a rendered page at /next-config-test, add routes here
 * and import from a separate runtime-only entry point.
 *
 * Verified by: demo/demo-app/e2e/next-config.spec.ts
 */
export const nextConfigTestModule = defineModule({
  name: 'next-config-test-module',
  basePath: '/next-config-test',

  nextConfig: {
    // Test: headers are injected on module routes
    headers: async () => [
      {
        source: '/next-config-test/:path*',
        headers: [
          { key: 'X-Test-Module-Header', value: 'present' },
          { key: 'X-Custom-Cache', value: 'no-store' },
        ],
      },
    ],

    // Test: redirects are registered
    redirects: async () => [
      {
        source: '/old-next-config-test',
        destination: '/next-config-test',
        permanent: true,
      },
    ],

    // Test: rewrites (beforeFiles and afterFiles)
    rewrites: async () => ({
      beforeFiles: [
        {
          source: '/next-config-test-alias',
          destination: '/next-config-test',
        },
      ],
      afterFiles: [
        {
          source: '/next-config-test/legacy/:slug',
          destination: '/next-config-test/:slug',
        },
      ],
    }),

    // Test: webpack composition — adds a no-op plugin to confirm the fn is called
    webpack: (config) => {
      // Annotate the config so tests can verify webpack ran
      (config as any)._nextModularTestPlugin = true;
      return config;
    },
  },
});

export default nextConfigTestModule;
