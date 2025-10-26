import { describe, it, expect, beforeEach } from 'vitest';
import { getModuleConfig } from './index';
import { moduleRegistry } from './registry';
import { ModuleDefinition } from './types';

describe('index', () => {
  beforeEach(() => {
    moduleRegistry.clear();
  });

  describe('getModuleConfig', () => {
    it('should return module config when module exists', () => {
      const config = { enabled: true, apiKey: 'test-key' };
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        config,
      };

      moduleRegistry.register(module);
      const result = getModuleConfig('test-module');

      expect(result).toEqual(config);
    });

    it('should return undefined when module does not exist', () => {
      const result = getModuleConfig('non-existent');
      expect(result).toBeUndefined();
    });

    it('should return undefined when module has no config', () => {
      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
      };

      moduleRegistry.register(module);
      const result = getModuleConfig('test-module');

      expect(result).toBeUndefined();
    });

    it('should support typed config', () => {
      interface CustomConfig {
        apiKey: string;
        timeout: number;
      }

      const config: CustomConfig = {
        apiKey: 'test-key',
        timeout: 5000,
      };

      const module: ModuleDefinition = {
        name: 'test-module',
        basePath: '/test',
        config,
      };

      moduleRegistry.register(module);
      const result = getModuleConfig<CustomConfig>('test-module');

      expect(result?.apiKey).toBe('test-key');
      expect(result?.timeout).toBe(5000);
    });
  });
});

