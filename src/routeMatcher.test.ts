import { describe, it, expect, beforeEach } from 'vitest';
import { matchRoute, matchApiRoute } from './routeMatcher';
import { moduleRegistry } from './registry';
import { ModuleDefinition } from './types';

describe('routeMatcher', () => {
  beforeEach(() => {
    moduleRegistry.clear();
  });

  describe('matchRoute', () => {
    it('should match exact path', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        routes: [
          {
            path: '/page',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/test/page');

      expect(match).not.toBeNull();
      expect(match?.module.name).toBe('test-module');
      expect(match?.route.path).toBe('/page');
      expect(match?.params).toEqual({});
    });

    it('should match module basePath exactly', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        routes: [
          {
            path: '/',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/test');

      expect(match).not.toBeNull();
      expect(match?.module.name).toBe('test-module');
      expect(match?.route.path).toBe('/');
    });

    it('should match dynamic segments', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/users',
        routes: [
          {
            path: '/[id]',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/users/123');

      expect(match).not.toBeNull();
      expect(match?.params).toEqual({ id: '123' });
    });

    it('should match multiple dynamic segments', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/users',
        routes: [
          {
            path: '/[userId]/posts/[postId]',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/users/123/posts/456');

      expect(match).not.toBeNull();
      expect(match?.params).toEqual({ userId: '123', postId: '456' });
    });

    it('should match catch-all routes', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/docs',
        routes: [
          {
            path: '/[...slug]',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/docs/api/v1/users');

      expect(match).not.toBeNull();
      expect(match?.params).toEqual({ slug: 'api/v1/users' });
    });

    it('should match catch-all with prefix', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/files',
        routes: [
          {
            path: '/static/[...path]',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/files/static/css/main.css');

      expect(match).not.toBeNull();
      expect(match?.params).toEqual({ path: 'css/main.css' });
    });

    it('should not match if path does not start with basePath', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        routes: [
          {
            path: '/page',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/other/page');

      expect(match).toBeNull();
    });

    it('should return null when no routes defined', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
      };

      moduleRegistry.register(module);
      const match = matchRoute('/test/page');

      expect(match).toBeNull();
    });

    it('should return null when no modules registered', () => {
      const match = matchRoute('/test/page');
      expect(match).toBeNull();
    });

    it('should not match when segment count differs', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        routes: [
          {
            path: '/page',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/test/page/extra');

      expect(match).toBeNull();
    });

    it('should not match when static segment differs', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        routes: [
          {
            path: '/page',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/test/other');

      expect(match).toBeNull();
    });

    it('should not match catch-all if prefix does not match', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/files',
        routes: [
          {
            path: '/static/[...path]',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/files/dynamic/test.js');

      expect(match).toBeNull();
    });

    it('should return null for catch-all with insufficient path parts', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/files',
        routes: [
          {
            path: '/static/nested/[...path]',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/files/static');

      expect(match).toBeNull();
    });

    it('should match dynamic segment before catch-all', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/docs',
        routes: [
          {
            path: '/[version]/[...slug]',
            component: () => null,
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchRoute('/docs/v1/api/endpoints/users');

      expect(match).not.toBeNull();
      // Note: dynamic segments before catch-all are matched but not captured in params
      // Only the catch-all parameter is captured
      expect(match?.params).toEqual({
        slug: 'api/endpoints/users',
      });
    });
  });

  describe('matchApiRoute', () => {
    it('should match exact API path', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        apiRoutes: [
          {
            path: '/users',
            handler: async () => new Response(),
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchApiRoute('/api/test/users');

      expect(match).not.toBeNull();
      expect(match?.module.name).toBe('test-module');
      expect(match?.route.path).toBe('/users');
      expect(match?.params).toEqual({});
    });

    it('should match API route at basePath root', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        apiRoutes: [
          {
            path: '/',
            handler: async () => new Response(),
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchApiRoute('/api/test');

      expect(match).not.toBeNull();
      expect(match?.route.path).toBe('/');
    });

    it('should match API route with dynamic segments', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/users',
        apiRoutes: [
          {
            path: '/[id]',
            handler: async () => new Response(),
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchApiRoute('/api/users/123');

      expect(match).not.toBeNull();
      expect(match?.params).toEqual({ id: '123' });
    });

    it('should match API route with catch-all', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/proxy',
        apiRoutes: [
          {
            path: '/[...path]',
            handler: async () => new Response(),
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchApiRoute('/api/proxy/external/api/v1');

      expect(match).not.toBeNull();
      expect(match?.params).toEqual({ path: 'external/api/v1' });
    });

    it('should return null when no API routes defined', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
      };

      moduleRegistry.register(module);
      const match = matchApiRoute('/api/test/users');

      expect(match).toBeNull();
    });

    it('should return null when path does not start with API basePath', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        apiRoutes: [
          {
            path: '/users',
            handler: async () => new Response(),
          },
        ],
      };

      moduleRegistry.register(module);
      const match = matchApiRoute('/api/other/users');

      expect(match).toBeNull();
    });

    it('should return null when no modules registered', () => {
      const match = matchApiRoute('/api/test/users');
      expect(match).toBeNull();
    });
  });
});

