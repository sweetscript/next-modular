import { handleApiRoute } from 'next-modular';
import '../../../next-modular.runtime'; // Initialize modules

export async function GET(
  req: Request,
  context: { params: Promise<{ module: string[] }> }
) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  
  return handleApiRoute(req, pathname, { params });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ module: string[] }> }
) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  
  return handleApiRoute(req, pathname, { params });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ module: string[] }> }
) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  
  return handleApiRoute(req, pathname, { params });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ module: string[] }> }
) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  
  return handleApiRoute(req, pathname, { params });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ module: string[] }> }
) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  
  return handleApiRoute(req, pathname, { params });
}
