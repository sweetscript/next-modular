# Next Modular

A modular architecture system for Next.js applications that enables building reusable, self-contained modules with their own routes, API endpoints, and middleware.

## Features

- **Route Modules** - Define page routes within modules
- **Route Metadata** - Per-route Next.js `metadata` / `generateMetadata`, resolved through the catch-all
- **API Endpoints** - Create module-specific API routes with dynamic parameters
- **Middleware** - Add module-level middleware, scoped to the module or global
- **Type-Safe** - Full TypeScript support
- **CLI Tools** - Initialize, add, and create modules with an interactive CLI
- **Module Registry** - Browse and install official and community modules

## Quick Start

```bash
# Initialize a Next.js app for Next Modular
npx next-modular init

# Add modules from registry
npx next-modular add @next-modular/auth-module

# Create custom modules
npx next-modular create --name my-module

# Start your app
npm run dev
```

## How It Works

### Module Definition

Modules are defined using `defineModule`. Use the `route()` helper to wire a
route file in — it pulls the default component plus optional `metadata` /
`generateMetadata` from the file's exports:

```typescript
import { defineModule, route } from 'next-modular';
import * as dashboard from './routes/dashboard';
import { helloHandler } from './server/api/hello';
import { myMiddleware } from './server/middleware';

export const myModule = defineModule({
  name: 'my-module',
  basePath: '/my-module',
  routes: [
    route('/dashboard', dashboard),
  ],
  apiRoutes: [
    { path: '/hello', handler: helloHandler },
  ],
  middleware: {
    handler: myMiddleware,
  },
});
```

The plain object form still works if you don't need metadata:

```typescript
import DashboardPage from './routes/dashboard';

routes: [
  { path: '/dashboard', component: DashboardPage },
],
```

### Module Configuration

Create a centralized `modules.config.ts`:

```typescript
import { authModule } from '@next-modular/auth-module';
import { myModule } from './modules/my-module/src';

export const modules = [
  authModule({ providers: ['google'] }),
  myModule,
];
```

### Request Flow

1. **Page Request** → Catch-all route `[...module]/page.tsx` → `handleRoute()` → Module component
2. **API Request** → Catch-all API route `api/[...module]/route.ts` → `handleApiRoute()` → Module handler
3. **Middleware** → `proxy.ts` → `handleMiddleware()` → Module middleware

## Project Structure

```
your-app/
├── app/
│   ├── [...module]/page.tsx       # Catch-all route for module pages
│   ├── api/[...module]/route.ts   # Catch-all API route
│   └── page.tsx
├── modules/                       # Your local modules
│   └── my-module/
│       └── src/
│           ├── routes/
│           ├── server/
│           │   ├── api/
│           │   └── middleware.ts
│           └── index.ts
├── modules.config.ts
├── next-modular.runtime.ts
├── proxy.ts
└── next.config.ts
```

## CLI Commands

### `next-modular init`

Initialize a Next.js app to use Next Modular. Creates catch-all routes, middleware proxy, and configuration files.

```bash
npx next-modular init
npx next-modular init --directory ./my-app
```

### `next-modular add [module]`

Add modules from the registry or npm:

```bash
npx next-modular add                           # Interactive selection
npx next-modular add @next-modular/auth-module # Specific module
npx next-modular add @your-org/custom-module   # Custom npm package
```

### `next-modular create`

Create a new local module:

```bash
npx next-modular create
npx next-modular create --name my-module --path modules
```

## Module Configuration Options

Modules support typed custom configuration:

```typescript
export interface MyModuleConfig {
  apiKey?: string;
  enableFeature?: boolean;
}

export const myModule = defineModule<MyModuleConfig>({
  name: 'my-module',
  basePath: '/my-module',
  config: {
    apiKey: '',
    enableFeature: true,
  },
  routes: [/* ... */],
});
```

Use with custom configuration:

```typescript
export const modules = [
  myModule({
    apiKey: process.env.MY_API_KEY,
    enableFeature: false,
  }),
];
```

## Dynamic Routes

```typescript
// Route with dynamic segment
{ path: '/products/[id]', component: ProductDetail }

// Access parameters in component
export default function ProductDetail({ params }: { params?: Record<string, string> }) {
  const productId = params?.id;
  return <div>Product: {productId}</div>;
}
```

## Route Metadata

Module route components render through the catch-all page, so Next.js never sees
a per-route `metadata` export directly. next-modular resolves it for you.

Export `metadata` (static) or `generateMetadata` (dynamic) from a route file,
exactly like an idiomatic Next.js page:

```tsx
// routes/detail.tsx
import type { Metadata } from 'next';

// Static:
export const metadata: Metadata = { title: 'Detail' };

// Or dynamic, from the matched params:
export function generateMetadata({ params }: { params: Record<string, string> }): Metadata {
  return { title: `Item ${params.id}` };
}

export default function DetailPage({ params }: { params: { id: string } }) {
  return <div>Item {params.id}</div>;
}
```

Wire the route with `route()` (so the exports get picked up), then resolve
metadata in the catch-all page via `handleMetadata`:

```tsx
// app/[...module]/page.tsx
import { handleMetadata } from 'next-modular';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string[] }>;
}): Promise<Metadata> {
  const { module } = await params;
  return (await handleMetadata('/' + module.join('/'))) ?? {};
}
```

When both are present, `generateMetadata` wins. App-wide defaults still belong
in your root `layout.tsx` as usual. On the Edge Runtime, use `handleMetadataWith(modules, pathname)`.

Note: `params` is passed to `generateMetadata` as a plain resolved object (not a
Promise), since module routes render through the catch-all rather than directly.

## Global Middleware

By default a module's middleware only runs for requests under its `basePath`
(or `/api/{basePath}`). Set `global: true` to run it on every request:

```typescript
export const myModule = defineModule({
  name: 'my-module',
  basePath: '/my-module',
  middleware: {
    handler: myMiddleware,
    global: true, // runs on all requests; do any path filtering in the handler
  },
});
```

Global and scoped middleware run in registration order; the first handler to
return a value short-circuits the chain. The `enabled` and `features.middleware`
toggles still apply.

## Development

```bash
# Clone the repo
git clone https://github.com/sweetscript/next-modular.git
cd next-modular

# Install dependencies
npm install

# Run the demo app
cd demo/demo-app && npm run dev

# Run the docs site
cd docs && npm run dev

# Run tests
npm test
```

## Repository Structure

```
next-modular/
├── src/              # Core next-modular package source
├── cli/              # CLI commands (init, add, create)
├── modules/          # Official modules
│   ├── security-module/
│   └── content-module/
├── demo/             # Demo application
│   └── demo-app/
├── docs/             # Documentation site
└── dist/             # Build output
```

## API Reference

| Function | Description |
|----------|-------------|
| `defineModule(definition)` | Define a new module with routes, API, and middleware |
| `route(path, mod)` | Wire a route file (default component + optional metadata) into a route |
| `handleRoute(pathname)` | Match a pathname to a module route component |
| `handleApiRoute(req, pathname)` | Handle API route requests |
| `handleMiddleware(req)` | Execute middleware for matching (and global) modules |
| `handleMetadata(pathname)` | Resolve Next.js metadata for a matched route |
| `withNextModular(config)` | Next.js config plugin to register modules |
| `getModuleConfig(moduleName)` | Retrieve module configuration at runtime |

Edge Runtime equivalents (`next-modular/edge`): `handleRouteWith`,
`handleApiRouteWith`, `handleMiddlewareWith`, `handleMetadataWith`, plus `route`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute.

## License

MIT
