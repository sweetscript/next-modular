import { describe, it, expect } from 'vitest';
import { handleRouteWith, handleApiRouteWith, handleMiddlewareWith } from './handlers-stateless';
import type { ModuleDefinition } from './types';

// Minimal stub component
const StubComponent = () => null;

// Minimal module factory
function makeModule(overrides: Partial<ModuleDefinition> = {}): ModuleDefinition {
  return {
    name: 'test-module',
    basePath: '/test',
    ...overrides,
  };
}

// Minimal NextRequest-like stub for middleware tests
function makeRequest(pathname: string, headers: Record<string, string> = {}): any {
  const url = `http://localhost${pathname}`;
  return {
    url,
    nextUrl: { pathname },
    headers: new Headers(headers),
    method: 'GET',
  };
}

describe('handleRouteWith', () => {
  it('returns null when no module matches', async () => {
    const modules = [makeModule({ basePath: '/other' })];
    const result = await handleRouteWith(modules, '/test');
    expect(result).toBeNull();
  });

  it('returns component and params for matching route', async () => {
    const modules = [makeModule({
      routes: [{ path: '/', component: StubComponent }],
    })];
    const result = await handleRouteWith(modules, '/test');
    expect(result).not.toBeNull();
    expect(result?.component).toBe(StubComponent);
    expect(result?.params).toEqual({});
  });

  it('extracts dynamic params from route', async () => {
    const modules = [makeModule({
      routes: [{ path: '/[id]', component: StubComponent }],
    })];
    const result = await handleRouteWith(modules, '/test/42');
    expect(result?.params).toEqual({ id: '42' });
  });

  it('returns null for disabled module', async () => {
    const modules = [makeModule({
      routes: [{ path: '/', component: StubComponent }],
      config: { enabled: false },
    })];
    const result = await handleRouteWith(modules, '/test');
    expect(result).toBeNull();
  });

  it('returns null when routes feature is disabled', async () => {
    const modules = [makeModule({
      routes: [{ path: '/', component: StubComponent }],
      config: { features: { routes: false } },
    })];
    const result = await handleRouteWith(modules, '/test');
    expect(result).toBeNull();
  });

  it('does not use global registry', async () => {
    // Pass empty modules — should not fall back to registry
    const result = await handleRouteWith([], '/test');
    expect(result).toBeNull();
  });
});

describe('handleApiRouteWith', () => {
  it('returns 404 when no module matches', async () => {
    const modules = [makeModule({ basePath: '/other' })];
    const req = new Request('http://localhost/api/test/ping');
    const result = await handleApiRouteWith(modules, req, '/api/test/ping');
    expect(result.status).toBe(404);
  });

  it('calls matching handler and returns its response', async () => {
    const handler = async () => Response.json({ pong: true });
    const modules = [makeModule({
      apiRoutes: [{ path: '/ping', handler }],
    })];
    const req = new Request('http://localhost/api/test/ping');
    const result = await handleApiRouteWith(modules, req, '/api/test/ping');
    expect(result.status).toBe(200);
    const body = await result.json();
    expect(body.pong).toBe(true);
  });

  it('passes dynamic params to handler', async () => {
    const handler = async (_req: Request, ctx: any) =>
      Response.json({ id: ctx.params.id });
    const modules = [makeModule({
      apiRoutes: [{ path: '/[id]', handler }],
    })];
    const req = new Request('http://localhost/api/test/abc');
    const result = await handleApiRouteWith(modules, req, '/api/test/abc');
    const body = await result.json();
    expect(body.id).toBe('abc');
  });

  it('returns 503 for disabled module', async () => {
    const handler = async () => Response.json({ ok: true });
    const modules = [makeModule({
      apiRoutes: [{ path: '/ping', handler }],
      config: { enabled: false },
    })];
    const req = new Request('http://localhost/api/test/ping');
    const result = await handleApiRouteWith(modules, req, '/api/test/ping');
    expect(result.status).toBe(503);
  });

  it('returns 503 when apiRoutes feature is disabled', async () => {
    const handler = async () => Response.json({ ok: true });
    const modules = [makeModule({
      apiRoutes: [{ path: '/ping', handler }],
      config: { features: { apiRoutes: false } },
    })];
    const req = new Request('http://localhost/api/test/ping');
    const result = await handleApiRouteWith(modules, req, '/api/test/ping');
    expect(result.status).toBe(503);
  });

  it('does not use global registry', async () => {
    const req = new Request('http://localhost/api/test/ping');
    const result = await handleApiRouteWith([], req, '/api/test/ping');
    expect(result.status).toBe(404);
  });
});

describe('handleMiddlewareWith', () => {
  it('returns null when no module matches path', async () => {
    const modules = [makeModule({ basePath: '/other' })];
    const req = makeRequest('/test');
    const result = await handleMiddlewareWith(modules, req);
    expect(result).toBeNull();
  });

  it('calls middleware handler for matching path', async () => {
    const handler = async () => new Response('intercepted', { status: 200 });
    const modules = [makeModule({
      middleware: { handler },
    })];
    const req = makeRequest('/test/something');
    const result = await handleMiddlewareWith(modules, req);
    expect(result).not.toBeNull();
    expect(result.status).toBe(200);
  });

  it('returns null when middleware handler returns nothing', async () => {
    const handler = async () => undefined;
    const modules = [makeModule({
      middleware: { handler },
    })];
    const req = makeRequest('/test/something');
    const result = await handleMiddlewareWith(modules, req);
    expect(result).toBeNull();
  });

  it('skips disabled modules', async () => {
    const handler = async () => new Response('should not reach', { status: 200 });
    const modules = [makeModule({
      middleware: { handler },
      config: { enabled: false },
    })];
    const req = makeRequest('/test/something');
    const result = await handleMiddlewareWith(modules, req);
    expect(result).toBeNull();
  });

  it('matches API paths under module basePath', async () => {
    const handler = async () => new Response('api intercepted', { status: 200 });
    const modules = [makeModule({
      middleware: { handler },
    })];
    const req = makeRequest('/api/test/something');
    const result = await handleMiddlewareWith(modules, req);
    expect(result).not.toBeNull();
  });

  it('does not use global registry', async () => {
    const req = makeRequest('/test/something');
    const result = await handleMiddlewareWith([], req);
    expect(result).toBeNull();
  });
});
