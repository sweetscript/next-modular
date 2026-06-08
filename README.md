# Next Modular

> Under development, contributions welcome.

A modular architecture system for Next.js applications that enables building reusable, self-contained modules with their own routes, API endpoints, and middleware.

## Features

- **Route Modules** - Define page routes within modules
- **API Endpoints** - Create module-specific API routes with dynamic parameters
- **Middleware** - Add module-level middleware logic
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

Modules are defined using `defineModule`:

```typescript
import { defineModule } from 'next-modular';
import DashboardPage from './routes/dashboard';
import { helloHandler } from './server/api/hello';
import { myMiddleware } from './server/middleware';

export const myModule = defineModule({
  name: 'my-module',
  basePath: '/my-module',
  routes: [
    { path: '/dashboard', component: DashboardPage },
  ],
  apiRoutes: [
    { path: '/hello', handler: helloHandler },
  ],
  middleware: {
    handler: myMiddleware,
  },
});
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
| `handleRoute(pathname)` | Match a pathname to a module route component |
| `handleApiRoute(req, pathname)` | Handle API route requests |
| `handleMiddleware(req)` | Execute middleware for matching modules |
| `withNextModular(config)` | Next.js config plugin to register modules |
| `getModuleConfig(moduleName)` | Retrieve module configuration at runtime |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute.

## License

MIT
