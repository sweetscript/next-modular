import { describe, it, expect, beforeEach } from 'vitest';
import { getAllModuleStaticParams } from './staticParams';
import { moduleRegistry } from './registry';
import { configureModules } from './config';

beforeEach(() => {
  moduleRegistry.clear();
});

describe('getAllModuleStaticParams', () => {
  it('returns empty array when no modules have staticParams', async () => {
    configureModules({
      modules: [{ name: 'no-static', basePath: '/no-static' }],
    });

    const result = await getAllModuleStaticParams();
    expect(result).toEqual([]);
  });

  it('converts basePath root path correctly', async () => {
    configureModules({
      modules: [{
        name: 'test',
        basePath: '/content',
        staticParams: async () => [{ path: '/' }],
      }],
    });

    const result = await getAllModuleStaticParams();
    expect(result).toEqual([{ module: ['content'] }]);
  });

  it('converts single segment path correctly', async () => {
    configureModules({
      modules: [{
        name: 'test',
        basePath: '/content',
        staticParams: async () => [{ path: '/hello-world' }],
      }],
    });

    const result = await getAllModuleStaticParams();
    expect(result).toEqual([{ module: ['content', 'hello-world'] }]);
  });

  it('converts nested path correctly', async () => {
    configureModules({
      modules: [{
        name: 'test',
        basePath: '/content',
        staticParams: async () => [{ path: '/nested/deep-page' }],
      }],
    });

    const result = await getAllModuleStaticParams();
    expect(result).toEqual([{ module: ['content', 'nested', 'deep-page'] }]);
  });

  it('handles multiple static paths from one module', async () => {
    configureModules({
      modules: [{
        name: 'test',
        basePath: '/static-test',
        staticParams: async () => [
          { path: '/' },
          { path: '/page-one' },
          { path: '/page-two' },
          { path: '/nested/deep' },
          { path: '/nested/deeper/page' },
        ],
      }],
    });

    const result = await getAllModuleStaticParams();
    expect(result).toEqual([
      { module: ['static-test'] },
      { module: ['static-test', 'page-one'] },
      { module: ['static-test', 'page-two'] },
      { module: ['static-test', 'nested', 'deep'] },
      { module: ['static-test', 'nested', 'deeper', 'page'] },
    ]);
  });

  it('collects static params from multiple modules without collision', async () => {
    configureModules({
      modules: [
        {
          name: 'module-a',
          basePath: '/a',
          staticParams: async () => [{ path: '/page-one' }],
        },
        {
          name: 'module-b',
          basePath: '/b',
          staticParams: async () => [{ path: '/page-two' }],
        },
      ],
    });

    const result = await getAllModuleStaticParams();
    expect(result).toEqual([
      { module: ['a', 'page-one'] },
      { module: ['b', 'page-two'] },
    ]);
  });

  it('skips modules without staticParams', async () => {
    configureModules({
      modules: [
        { name: 'no-static', basePath: '/no-static' },
        {
          name: 'with-static',
          basePath: '/with-static',
          staticParams: async () => [{ path: '/page' }],
        },
      ],
    });

    const result = await getAllModuleStaticParams();
    expect(result).toEqual([{ module: ['with-static', 'page'] }]);
  });

  it('skips disabled modules', async () => {
    configureModules({
      modules: [{
        name: 'disabled',
        basePath: '/disabled',
        staticParams: async () => [{ path: '/page' }],
        config: { enabled: false },
      }],
    });

    const result = await getAllModuleStaticParams();
    expect(result).toEqual([]);
  });

  it('handles path without leading slash', async () => {
    configureModules({
      modules: [{
        name: 'test',
        basePath: '/content',
        staticParams: async () => [{ path: 'no-slash' }],
      }],
    });

    const result = await getAllModuleStaticParams();
    expect(result).toEqual([{ module: ['content', 'no-slash'] }]);
  });
});
