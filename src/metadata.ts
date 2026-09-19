import type { Metadata } from 'next';
import type { ModuleRoute } from './types';

/**
 * Resolve a route's metadata. `generateMetadata` takes precedence over the
 * static `metadata` object when both are present. Returns null when the route
 * declares neither.
 */
export async function resolveRouteMetadata(
  route: ModuleRoute,
  params: Record<string, string>
): Promise<Metadata | null> {
  if (route.generateMetadata) {
    return route.generateMetadata({ params });
  }

  return route.metadata ?? null;
}
