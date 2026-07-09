export const runtime = 'edge';

import { handleApiRouteWith } from 'next-modular/edge';
import { modules } from '../../../modules.config';

async function handle(req: Request, context: { params: Promise<{ module: string[] }> }) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  return handleApiRouteWith(modules, req, pathname, { params });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const PATCH = handle;
export const OPTIONS = handle;
