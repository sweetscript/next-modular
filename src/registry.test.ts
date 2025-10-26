import { describe, it, expect, beforeEach, vi } from 'vitest';
import { moduleRegistry } from './registry';
import { ModuleDefinition } from './types';

describe('ModuleRegistry', () => {
  beforeEach(() => {
    moduleRegistry.clear();
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new module', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
      };

      moduleRegistry.register(module);
      const retrieved = moduleRegistry.getModule('test-module');

      expect(retrieved).toEqual(module);
    });

    it('should warn and overwrite when registering duplicate module', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const module1: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test1',
      };
      
      const module2: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test2',
      };

      moduleRegistry.register(module1);
      moduleRegistry.register(module2);

      expect(consoleSpy).toHaveBeenCalledWith('Module "test-module" is already registered. Overwriting...');
      expect(moduleRegistry.getModule('test-module')).toEqual(module2);
    });
  });

  describe('getModule', () => {
    it('should return module by name', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
      };

      moduleRegistry.register(module);
      expect(moduleRegistry.getModule('test-module')).toEqual(module);
    });

    it('should return undefined for non-existent module', () => {
      expect(moduleRegistry.getModule('non-existent')).toBeUndefined();
    });
  });

  describe('getModuleConfig', () => {
    it('should return module config when it exists', () => {
      const config = { enabled: true, apiKey: 'test-key' };
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        config,
      };

      moduleRegistry.register(module);
      expect(moduleRegistry.getModuleConfig('test-module')).toEqual(config);
    });

    it('should return undefined for module without config', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
      };

      moduleRegistry.register(module);
      expect(moduleRegistry.getModuleConfig('test-module')).toBeUndefined();
    });

    it('should return undefined for non-existent module', () => {
      expect(moduleRegistry.getModuleConfig('non-existent')).toBeUndefined();
    });
  });

  describe('getAllModules', () => {
    it('should return empty array when no modules registered', () => {
      expect(moduleRegistry.getAllModules()).toEqual([]);
    });

    it('should return all registered modules', () => {
      const module1: ModuleDefinition = {
        name: 'module1',
        basePath: '/m1',
      };
      
      const module2: ModuleDefinition = {
        name: 'module2',
        basePath: '/m2',
      };

      moduleRegistry.register(module1);
      moduleRegistry.register(module2);

      const allModules = moduleRegistry.getAllModules();
      expect(allModules).toHaveLength(2);
      expect(allModules).toContainEqual(module1);
      expect(allModules).toContainEqual(module2);
    });
  });

  describe('clear', () => {
    it('should remove all registered modules', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
      };

      moduleRegistry.register(module);
      expect(moduleRegistry.getAllModules()).toHaveLength(1);

      moduleRegistry.clear();
      expect(moduleRegistry.getAllModules()).toHaveLength(0);
    });
  });
});

