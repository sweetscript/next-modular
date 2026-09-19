/**
 * Debug logging for next-modular.
 *
 * Off by default. Enable it in one of two ways:
 *   1. Config:  configureModules({ modules, debug: true })
 *               withNextModular({ modules, debug: true })
 *   2. Env var: NEXT_MODULAR_DEBUG=true  (truthy: "true" or "1")
 */
let debugEnabled = false;

/**
 * Set the debug flag from config. `undefined` leaves the current value
 * unchanged so an env var can still take effect.
 */
export function setDebug(enabled: boolean | undefined): void {
  if (enabled !== undefined) {
    debugEnabled = enabled;
  }
}

export function isDebugEnabled(): boolean {
  if (debugEnabled) return true;

  const env =
    typeof process !== 'undefined' ? process.env?.NEXT_MODULAR_DEBUG : undefined;
  return env === 'true' || env === '1';
}

/**
 * Log a `[next-modular]`-prefixed message, but only when debug is enabled.
 */
export function debugLog(...args: unknown[]): void {
  if (isDebugEnabled()) {
    console.log('[next-modular]', ...args);
  }
}
