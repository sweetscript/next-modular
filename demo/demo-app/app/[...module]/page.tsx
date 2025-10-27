import { handleRoute } from 'next-modular';
import { notFound } from 'next/navigation';
import '../../next-modular.runtime'; // Initialize modules

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string[] }>;
}) {
  const { module } = await params;
  const pathname = '/' + module.join('/');

  const result = await handleRoute(pathname);

  if (!result) {
    notFound();
  }

  const { component: Component, params: routeParams } = result;

  return <Component params={routeParams} />;
}
