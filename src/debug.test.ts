import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setDebug, isDebugEnabled, debugLog } from './debug';

describe('debug', () => {
  const originalEnv = process.env.NEXT_MODULAR_DEBUG;

  beforeEach(() => {
    setDebug(false);
    delete process.env.NEXT_MODULAR_DEBUG;
  });

  afterEach(() => {
    setDebug(false);
    if (originalEnv === undefined) {
      delete process.env.NEXT_MODULAR_DEBUG;
    } else {
      process.env.NEXT_MODULAR_DEBUG = originalEnv;
    }
    vi.restoreAllMocks();
  });

  it('is disabled by default', () => {
    expect(isDebugEnabled()).toBe(false);
  });

  it('can be enabled via setDebug', () => {
    setDebug(true);
    expect(isDebugEnabled()).toBe(true);
  });

  it('leaves the value unchanged when passed undefined', () => {
    setDebug(true);
    setDebug(undefined);
    expect(isDebugEnabled()).toBe(true);
  });

  it('can be enabled via the NEXT_MODULAR_DEBUG env var', () => {
    process.env.NEXT_MODULAR_DEBUG = 'true';
    expect(isDebugEnabled()).toBe(true);

    process.env.NEXT_MODULAR_DEBUG = '1';
    expect(isDebugEnabled()).toBe(true);
  });

  it('does not log when disabled', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    debugLog('hello');
    expect(spy).not.toHaveBeenCalled();
  });

  it('logs with the [next-modular] prefix when enabled', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    setDebug(true);
    debugLog('hello', 42);
    expect(spy).toHaveBeenCalledWith('[next-modular]', 'hello', 42);
  });
});
