import { handleRoute, handleMetadata, getAllModuleStaticParams } from 'next-modular';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../../next-modular.runtime'; // Initialize modules

export async function generateStaticParams() {
  return getAllModuleStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string[] }>;
}): Promise<Metadata> {
  const { module } = await params;
  const pathname = '/' + module.join('/');
  return (await handleMetadata(pathname)) ?? {};
}

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
