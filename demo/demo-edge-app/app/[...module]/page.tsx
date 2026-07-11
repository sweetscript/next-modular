export const runtime = 'edge';

import { handleRouteWith } from 'next-modular/edge';
import { notFound } from 'next/navigation';
import { modules } from '../../modules.config';

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string[] }>;
}) {
  const { module } = await params;
  const pathname = '/' + module.join('/');

  const result = await handleRouteWith(modules, pathname);

  if (!result) {
    notFound();
  }

  const { component: Component, params: routeParams } = result;

  return <Component params={routeParams} />;
}
