// All handlers use only Web APIs — no Node.js, safe for Edge Runtime

export async function edgePingHandler(): Promise<Response> {
  return Response.json({ pong: true });
}

export async function edgeHeadersHandler(req: Request): Promise<Response> {
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return Response.json(headers);
}

export async function edgeItemHandler(
  _req: Request,
  context: { params?: Record<string, string> }
): Promise<Response> {
  const id = context.params?.id ?? '';
  return Response.json({ id });
}

export async function edgeTestMiddleware(req: any): Promise<any> {
  const { NextResponse } = await import('next/server');
  const response = NextResponse.next();
  response.headers.set('X-Edge-Module', 'true');
  return response;
}
