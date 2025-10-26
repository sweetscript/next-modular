import { describe, it, expect, beforeEach } from 'vitest';
import { configureModules, getRuntimeConfig, ensureModulesInitialized, withNextModular } from './config';
import { moduleRegistry } from './registry';
import { ModuleDefinition } from './types';

describe('config', () => {
  beforeEach(() => {
    moduleRegistry.clear();
  });

  describe('configureModules', () => {
    it('should register all modules from config', () => {
      const modules: ModuleDefinition[] = [
        {
          name: 'module1',
          basePath: '/m1',
        },
        {
          name: 'module2',
          basePath: '/m2',
        },
      ];

      configureModules({ modules });

      const registered = moduleRegistry.getAllModules();
      expect(registered).toHaveLength(2);
      expect(registered).toContainEqual(modules[0]);
      expect(registered).toContainEqual(modules[1]);
    });

    it('should clear existing modules before registering', () => {
      const module1: ModuleDefinition = {
        name: 'old-module',
        basePath: '/old',
      };

      moduleRegistry.register(module1);
      expect(moduleRegistry.getAllModules()).toHaveLength(1);

      const newModules: ModuleDefinition[] = [
        {
          name: 'new-module',
          basePath: '/new',
        },
      ];

      configureModules({ modules: newModules });

      const registered = moduleRegistry.getAllModules();
      expect(registered).toHaveLength(1);
      expect(registered[0].name).toBe('new-module');
    });

    it('should store runtime config', () => {
      const config = {
        modules: [
          {
            name: 'test',
            basePath: '/test',
          },
        ],
      };

      configureModules(config);

      expect(getRuntimeConfig()).toEqual(config);
    });

    it('should return the config', () => {
      const config = {
        modules: [
          {
            name: 'test',
            basePath: '/test',
          },
        ],
      };

      const result = configureModules(config);

      expect(result).toEqual(config);
    });
  });

  describe('getRuntimeConfig', () => {
    it('should return runtime config after configureModules', () => {
      const config = {
        modules: [
          {
            name: 'test-get-runtime',
            basePath: '/test-runtime',
          },
        ],
      };

      configureModules(config);

      expect(getRuntimeConfig()).toEqual(config);
    });

    it('should return latest config after multiple calls', () => {
      const config1 = {
        modules: [
          {
            name: 'test1',
            basePath: '/test1',
          },
        ],
      };

      const config2 = {
        modules: [
          {
            name: 'test2',
            basePath: '/test2',
          },
        ],
      };

      configureModules(config1);
      expect(getRuntimeConfig()).toEqual(config1);

      configureModules(config2);
      expect(getRuntimeConfig()).toEqual(config2);
    });
  });

  describe('ensureModulesInitialized', () => {
    it('should initialize modules if registry is empty', () => {
      const config = {
        modules: [
          {
            name: 'test-ensure',
            basePath: '/test-ensure',
          },
        ],
      };

      configureModules(config);
      expect(moduleRegistry.getAllModules().length).toBeGreaterThan(0);
      
      moduleRegistry.clear();
      expect(moduleRegistry.getAllModules()).toHaveLength(0);

      ensureModulesInitialized();

      const modules = moduleRegistry.getAllModules();
      expect(modules.length).toBeGreaterThan(0);
      expect(modules.some(m => m.name === 'test-ensure')).toBe(true);
    });

    it('should not re-initialize if modules already exist', () => {
      const config = {
        modules: [
          {
            name: 'test-no-reinit',
            basePath: '/test-no-reinit',
          },
        ],
      };

      configureModules(config);
      
      const initialCount = moduleRegistry.getAllModules().length;
      expect(initialCount).toBeGreaterThan(0);

      ensureModulesInitialized();

      expect(moduleRegistry.getAllModules().length).toBe(initialCount);
    });

    it('should preserve existing modules when called', () => {
      const config = {
        modules: [
          {
            name: 'test-preserve',
            basePath: '/test-preserve',
          },
        ],
      };

      configureModules(config);
      const moduleName = moduleRegistry.getAllModules()[0]?.name;

      ensureModulesInitialized();

      const modules = moduleRegistry.getAllModules();
      expect(modules.some(m => m.name === moduleName)).toBe(true);
    });
  });

  describe('withNextModular', () => {
    it('should return a function', () => {
      const config = {
        modules: [
          {
            name: 'test',
            basePath: '/test',
          },
        ],
      };

      const plugin = withNextModular(config);

      expect(typeof plugin).toBe('function');
    });

    it('should initialize modules when called', () => {
      const config = {
        modules: [
          {
            name: 'test',
            basePath: '/test',
          },
        ],
      };

      const plugin = withNextModular(config);
      plugin();

      expect(moduleRegistry.getAllModules()).toHaveLength(1);
    });

    it('should merge with existing Next.js config', () => {
      const config = {
        modules: [
          {
            name: 'test',
            basePath: '/test',
          },
        ],
      };

      const existingConfig = {
        reactStrictMode: true,
        images: {
          domains: ['example.com'],
        },
      };

      const plugin = withNextModular(config);
      const result = plugin(existingConfig);

      expect(result.reactStrictMode).toBe(true);
      expect(result.images).toEqual({ domains: ['example.com'] });
    });

    it('should work with empty Next.js config', () => {
      const config = {
        modules: [
          {
            name: 'test',
            basePath: '/test',
          },
        ],
      };

      const plugin = withNextModular(config);
      const result = plugin();

      expect(result).toBeDefined();
    });
  });
});

