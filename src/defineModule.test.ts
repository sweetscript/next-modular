import { describe, it, expect } from 'vitest';
import { defineModule } from './defineModule';

describe('defineModule', () => {
  it('should throw error if name is missing', () => {
    expect(() => {
      defineModule({
        name: '',
        basePath: '/test',
      });
    }).toThrow('Module name is required');
  });

  it('should throw error if basePath is missing', () => {
    expect(() => {
      defineModule({
        name: 'test',
        basePath: '',
      });
    }).toThrow('Module basePath is required');
  });

  it('should add leading slash to basePath if missing', () => {
    const module = defineModule({
      name: 'test',
      basePath: 'test',
    });

    expect(module.basePath).toBe('/test');
  });

  it('should remove trailing slash from basePath', () => {
    const module = defineModule({
      name: 'test',
      basePath: '/test/',
    });

    expect(module.basePath).toBe('/test');
  });

  it('should keep single slash as basePath', () => {
    const module = defineModule({
      name: 'test',
      basePath: '/',
    });

    expect(module.basePath).toBe('/');
  });

  it('should set default config', () => {
    const module = defineModule({
      name: 'test',
      basePath: '/test',
    });

    expect(module.config).toEqual({
      enabled: true,
      features: {
        routes: true,
        apiRoutes: true,
        middleware: true,
      },
    });
  });

  it('should merge custom config with defaults', () => {
    const module = defineModule({
      name: 'test',
      basePath: '/test',
      config: {
        enabled: false,
        customOption: 'value',
      },
    });

    expect(module.config).toEqual({
      enabled: false,
      features: {
        routes: true,
        apiRoutes: true,
        middleware: true,
      },
      customOption: 'value',
    });
  });

  it('should mark module as configurable', () => {
    const module = defineModule({
      name: 'test',
      basePath: '/test',
    });

    expect(module._configurable).toBe(true);
  });

  it('should allow calling module as function with config', () => {
    const module = defineModule({
      name: 'test',
      basePath: '/test',
    });

    const configured = module({ enabled: false });

    expect(configured.config?.enabled).toBe(false);
    expect(configured.name).toBe('test');
    expect(configured.basePath).toBe('/test');
  });

  it('should merge features config when calling as function', () => {
    const module = defineModule({
      name: 'test',
      basePath: '/test',
      config: {
        features: {
          routes: false,
        },
      },
    });

    const configured = module({
      features: {
        middleware: false,
      },
    });

    expect(configured.config?.features).toEqual({
      routes: false,
      apiRoutes: true,
      middleware: false,
    });
  });

  it('should preserve routes when configuring', () => {
    const routes = [
      {
        path: '/page',
        component: () => null,
      },
    ];

    const module = defineModule({
      name: 'test',
      basePath: '/test',
      routes,
    });

    const configured = module({ enabled: false });

    expect(configured.routes).toEqual(routes);
  });

  it('should preserve apiRoutes when configuring', () => {
    const apiRoutes = [
      {
        path: '/api',
        handler: async () => new Response(),
      },
    ];

    const module = defineModule({
      name: 'test',
      basePath: '/test',
      apiRoutes,
    });

    const configured = module({ enabled: false });

    expect(configured.apiRoutes).toEqual(apiRoutes);
  });

  it('should preserve middleware when configuring', () => {
    const middleware = {
      handler: async () => {},
    };

    const module = defineModule({
      name: 'test',
      basePath: '/test',
      middleware,
    });

    const configured = module({ enabled: false });

    expect(configured.middleware).toEqual(middleware);
  });

  it('should support custom config types', () => {
    interface CustomConfig {
      apiKey: string;
      timeout: number;
    }

    const module = defineModule<CustomConfig>({
      name: 'test',
      basePath: '/test',
      config: {
        apiKey: 'test-key',
        timeout: 5000,
      },
    });

    expect(module.config?.apiKey).toBe('test-key');
    expect(module.config?.timeout).toBe(5000);
  });

  it('should merge custom config when calling as function', () => {
    interface CustomConfig {
      apiKey: string;
      timeout?: number;
    }

    const module = defineModule<CustomConfig>({
      name: 'test',
      basePath: '/test',
      config: {
        apiKey: 'test-key',
        timeout: 5000,
      },
    });

    const configured = module({
      timeout: 10000,
    });

    expect(configured.config?.apiKey).toBe('test-key');
    expect(configured.config?.timeout).toBe(10000);
  });

  it('should handle module without initial config', () => {
    const module = defineModule({
      name: 'test',
      basePath: '/test',
    });

    const configured = module({
      features: {
        routes: false,
      },
    });

    expect(configured.config?.features?.routes).toBe(false);
  });

  it('should preserve _configurable property on configured module', () => {
    const module = defineModule({
      name: 'test',
      basePath: '/test',
    });

    const configured = module({ enabled: false });

    expect(configured._configurable).toBe(true);
  });
});

