import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleRoute, handleApiRoute, handleMiddleware } from './handlers';
import { moduleRegistry } from './registry';
import { ModuleDefinition } from './types';

// Mock the config module
vi.mock('./config', () => ({
  ensureModulesInitialized: vi.fn(),
}));

describe('handlers', () => {
  beforeEach(() => {
    moduleRegistry.clear();
    vi.clearAllMocks();
  });

  describe('handleRoute', () => {
    it('should return component and params for matching route', async () => {
      const TestComponent = () => null;
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        routes: [
          {
            path: '/page',
            component: TestComponent,
          },
        ],
      };

      moduleRegistry.register(module);
      const result = await handleRoute('/test/page');

      expect(result).not.toBeNull();
      expect(result?.component).toBe(TestComponent);
      expect(result?.params).toEqual({});
    });

    it('should return null when no route matches', async () => {
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
      const result = await handleRoute('/other/page');

      expect(result).toBeNull();
    });

    it('should return null when module is disabled', async () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        routes: [
          {
            path: '/page',
            component: () => null,
          },
        ],
        config: {
          enabled: false,
        },
      };

      moduleRegistry.register(module);
      const result = await handleRoute('/test/page');

      expect(result).toBeNull();
    });

    it('should return null when routes feature is disabled', async () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        routes: [
          {
            path: '/page',
            component: () => null,
          },
        ],
        config: {
          enabled: true,
          features: {
            routes: false,
          },
        },
      };

      moduleRegistry.register(module);
      const result = await handleRoute('/test/page');

      expect(result).toBeNull();
    });

    it('should handle dynamic route params', async () => {
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
      const result = await handleRoute('/users/123');

      expect(result?.params).toEqual({ id: '123' });
    });
  });

  describe('handleApiRoute', () => {
    it('should handle API route request', async () => {
      const mockHandler = vi.fn(async () => new Response('OK', { status: 200 }));
      
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        apiRoutes: [
          {
            path: '/api',
            handler: mockHandler,
          },
        ],
      };

      moduleRegistry.register(module);
      const req = new Request('http://localhost/api/test/api');
      const response = await handleApiRoute(req, '/api/test/api');

      expect(response.status).toBe(200);
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should return 404 when no route matches', async () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        apiRoutes: [
          {
            path: '/api',
            handler: async () => new Response(),
          },
        ],
      };

      moduleRegistry.register(module);
      const req = new Request('http://localhost/api/other/api');
      const response = await handleApiRoute(req, '/api/other/api');

      expect(response.status).toBe(404);
      expect(await response.text()).toBe('Not Found');
    });

    it('should return 503 when module is disabled', async () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        apiRoutes: [
          {
            path: '/api',
            handler: async () => new Response(),
          },
        ],
        config: {
          enabled: false,
        },
      };

      moduleRegistry.register(module);
      const req = new Request('http://localhost/api/test/api');
      const response = await handleApiRoute(req, '/api/test/api');

      expect(response.status).toBe(503);
      const json = await response.json();
      expect(json).toEqual({ error: 'Module is disabled' });
    });

    it('should return 503 when API routes feature is disabled', async () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        apiRoutes: [
          {
            path: '/api',
            handler: async () => new Response(),
          },
        ],
        config: {
          enabled: true,
          features: {
            apiRoutes: false,
          },
        },
      };

      moduleRegistry.register(module);
      const req = new Request('http://localhost/api/test/api');
      const response = await handleApiRoute(req, '/api/test/api');

      expect(response.status).toBe(503);
      const json = await response.json();
      expect(json).toEqual({ error: 'API routes are disabled for this module' });
    });

    it('should merge params into context', async () => {
      let capturedContext: any;
      const mockHandler = vi.fn(async (req, context) => {
        capturedContext = context;
        return new Response('OK');
      });

      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/users',
        apiRoutes: [
          {
            path: '/[id]',
            handler: mockHandler,
          },
        ],
      };

      moduleRegistry.register(module);
      const req = new Request('http://localhost/api/users/123');
      const context = { params: { existingParam: 'value' } };
      await handleApiRoute(req, '/api/users/123', context);

      expect(capturedContext.params).toEqual({
        existingParam: 'value',
        id: '123',
      });
    });

    it('should handle context without existing params', async () => {
      let capturedContext: any;
      const mockHandler = vi.fn(async (req, context) => {
        capturedContext = context;
        return new Response('OK');
      });

      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/users',
        apiRoutes: [
          {
            path: '/[id]',
            handler: mockHandler,
          },
        ],
      };

      moduleRegistry.register(module);
      const req = new Request('http://localhost/api/users/123');
      await handleApiRoute(req, '/api/users/123');

      expect(capturedContext.params).toEqual({ id: '123' });
    });
  });

  describe('handleMiddleware', () => {
    it('should call middleware for matching module path', async () => {
      const mockMiddleware = vi.fn(async () => undefined);
      
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        middleware: {
          handler: mockMiddleware,
        },
      };

      moduleRegistry.register(module);
      
      const req = {
        nextUrl: { pathname: '/test/page' },
      } as any;

      await handleMiddleware(req);

      expect(mockMiddleware).toHaveBeenCalledWith(req);
    });

    it('should call middleware for matching API path', async () => {
      const mockMiddleware = vi.fn(async () => undefined);
      
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        middleware: {
          handler: mockMiddleware,
        },
      };

      moduleRegistry.register(module);
      
      const req = {
        nextUrl: { pathname: '/api/test/endpoint' },
      } as any;

      await handleMiddleware(req);

      expect(mockMiddleware).toHaveBeenCalledWith(req);
    });

    it('should not call middleware when module is disabled', async () => {
      const mockMiddleware = vi.fn(async () => undefined);
      
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        middleware: {
          handler: mockMiddleware,
        },
        config: {
          enabled: false,
        },
      };

      moduleRegistry.register(module);
      
      const req = {
        nextUrl: { pathname: '/test/page' },
      } as any;

      await handleMiddleware(req);

      expect(mockMiddleware).not.toHaveBeenCalled();
    });

    it('should not call middleware when middleware feature is disabled', async () => {
      const mockMiddleware = vi.fn(async () => undefined);
      
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        middleware: {
          handler: mockMiddleware,
        },
        config: {
          enabled: true,
          features: {
            middleware: false,
          },
        },
      };

      moduleRegistry.register(module);
      
      const req = {
        nextUrl: { pathname: '/test/page' },
      } as any;

      await handleMiddleware(req);

      expect(mockMiddleware).not.toHaveBeenCalled();
    });

    it('should skip modules without middleware', async () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
      };

      moduleRegistry.register(module);
      
      const req = {
        nextUrl: { pathname: '/test/page' },
      } as any;

      const result = await handleMiddleware(req);

      expect(result).toBeUndefined();
    });

    it('should return middleware response if provided', async () => {
      const mockResponse = { status: 302 } as any;
      const mockMiddleware = vi.fn(async () => mockResponse);
      
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        middleware: {
          handler: mockMiddleware,
        },
      };

      moduleRegistry.register(module);
      
      const req = {
        nextUrl: { pathname: '/test/page' },
      } as any;

      const result = await handleMiddleware(req);

      expect(result).toBe(mockResponse);
    });

    it('should continue to next module if middleware returns void', async () => {
      const mockMiddleware1 = vi.fn(async () => undefined);
      const mockMiddleware2 = vi.fn(async () => undefined);
      
      const module1: ModuleDefinition = {
        name: 'module1',
        basePath: '/test',
        middleware: {
          handler: mockMiddleware1,
        },
      };

      const module2: ModuleDefinition = {
        name: 'module2',
        basePath: '/test',
        middleware: {
          handler: mockMiddleware2,
        },
      };

      moduleRegistry.register(module1);
      moduleRegistry.register(module2);
      
      const req = {
        nextUrl: { pathname: '/test/page' },
      } as any;

      await handleMiddleware(req);

      expect(mockMiddleware1).toHaveBeenCalled();
      expect(mockMiddleware2).toHaveBeenCalled();
    });

    it('should not call middleware for non-matching paths', async () => {
      const mockMiddleware = vi.fn(async () => undefined);
      
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        middleware: {
          handler: mockMiddleware,
        },
      };

      moduleRegistry.register(module);
      
      const req = {
        nextUrl: { pathname: '/other/page' },
      } as any;

      await handleMiddleware(req);

      expect(mockMiddleware).not.toHaveBeenCalled();
    });
  });
});

