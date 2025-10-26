# Next Modular

A modular architecture system for Next.js applications that enables building reusable, self-contained modules with their own routes, API endpoints, and middleware.

## Features

- **Route Modules**: Define page routes within modules
- **API Endpoints**: Create module-specific API routes with dynamic parameters
- **Middleware**: Add module-level middleware logic
- **Type-Safe**: Full TypeScript support
- **CLI Tools**: Initialize, add, and create modules with interactive CLI
- **Easy Integration**: Simple configuration in Next.js apps

## Quick Start

### Using the CLI (Recommended)

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

### Manual Setup

```bash
# 1. Install dependencies
npm install next-modular

# 2. Initialize your Next.js app
npx next-modular init

# 3. Start developing
npm run dev
```

## CLI Commands

### `next-modular init`

Initialize a Next.js app to use Next Modular. Creates all necessary files:
- Catch-all routes (`app/[...module]/page.tsx`)
- Catch-all API routes (`app/api/[...module]/route.ts`)
- Middleware/proxy file (`proxy.ts`)
- Configuration files (`modules.config.ts`, `next-modular.runtime.ts`)

```bash
npx next-modular init
npx next-modular init --directory ./my-app
```

### `next-modular add [module]`

Add modules from the registry or npm:

```bash
# Interactive - shows list of available modules
npx next-modular add

# Add specific module
npx next-modular add @next-modular/auth-module

# Add custom npm package
npx next-modular add @your-org/custom-module

# Skip confirmation
npx next-modular add @next-modular/auth-module --yes
```

**Available Modules:**
- `@next-modular/auth-module` - Authentication with login, register, password reset
- `@next-modular/test-module` - Example module with routes, API, and middleware
- Custom npm packages

### `next-modular create`

Create a new local module with interactive setup:

```bash
# Interactive mode
npx next-modular create

# With options
npx next-modular create --name my-module --path modules
```

**Features:**
- Interactive module name validation
- Customizable path (default: `modules/`)
- Choose features: Routes, API endpoints, Middleware, TypeScript
- Auto-updates `modules.config.ts`
- Generates complete module structure with examples

## Project Structure

```
your-app/
├── app/
│   ├── [...module]/
│   │   └── page.tsx           # Catch-all route for module pages
│   ├── api/
│   │   └── [...module]/
│   │       └── route.ts       # Catch-all API route
│   └── page.tsx
├── modules/                   # Your local modules (created with 'create')
│   └── my-module/
│       └── src/
│           ├── routes/        # Module pages
│           ├── server/        # Server-side logic
│           │   ├── api/       # API handlers
│           │   └── middleware.ts
│           └── index.ts       # Module definition
├── modules.config.ts          # Centralized module configuration
├── next-modular.runtime.ts    # Runtime initialization
├── proxy.ts                   # Middleware
└── next.config.ts
```

## How It Works

### Module Definition

Modules are defined using `defineModule`:

```typescript
import { defineModule } from 'next-modular';
import HomePage from './routes/home';
import { handleApi } from './server/api';
import { middleware } from './server/middleware';

export const myModule = defineModule({
  name: 'my-module',
  basePath: '/my-module',
  routes: [
    { path: '/home', component: HomePage },
    { path: '/about', component: AboutPage },
    { path: '/users/[id]', component: UserDetailPage }, // Dynamic routes
  ],
  apiRoutes: [
    { path: '/hello', handler: handleApi },
    { path: '/users/[id]', handler: getUserHandler }, // Dynamic API routes
  ],
  middleware: {
    handler: middleware,
  },
});
```

### Module Configuration

Create a centralized `modules.config.ts`:

```typescript
import { authModule } from '@next-modular/auth-module';
import { myModule } from './modules/my-module/src';

export const modules = [
  authModule,
  myModule,
];
```

Update `next.config.ts`:

```typescript
import { withNextModular } from "next-modular/config";
import { modules } from "./modules.config";

const nextConfig = {
  /* your config */
};

export default withNextModular({
  modules,
})(nextConfig);
```

Update `next-modular.runtime.ts`:

```typescript
import { configureModules } from 'next-modular';
import { modules } from './modules.config';

configureModules({ modules });
export { modules };
```

### Module Configuration Options

Modules support custom configuration:

```typescript
// Define config interface
export interface MyModuleConfig {
  apiKey?: string;
  timeout?: number;
  enableFeature?: boolean;
}

// Create module with config support
export const myModule = defineModule<MyModuleConfig>({
  name: 'my-module',
  basePath: '/my-module',
  config: {
    // Default configuration
    apiKey: '',
    timeout: 5000,
    enableFeature: true,
  },
  routes: [/* ... */],
  apiRoutes: [/* ... */],
});
```

Use with custom configuration:

```typescript
// modules.config.ts
export const modules = [
  myModule({
    apiKey: process.env.MY_API_KEY,
    timeout: 10000,
    enableFeature: false,
  }),
];
```

Access config in handlers:

```typescript
import { getModuleConfig } from 'next-modular';
import { MyModuleConfig } from '../index';

export async function handler(req: Request) {
  const config = getModuleConfig<MyModuleConfig>('my-module');
  
  if (config?.enableFeature) {
    // Do something
  }
  
  return new Response(JSON.stringify({ config }));
}
```

### Request Flow

1. **Page Request** → Catch-all route `[...module]/page.tsx` → `handleRoute()` → Module component
2. **API Request** → Catch-all API route `api/[...module]/route.ts` → `handleApiRoute()` → Module handler
3. **Middleware** → `proxy.ts` → `handleMiddleware()` → Module middleware

## Creating Modules

### Using CLI (Recommended)

```bash
npx next-modular create --name blog
```

This creates a complete module structure with starter files.

### Manual Creation

#### 1. Create Module Structure

```bash
mkdir -p modules/blog/src/{routes,server/api}
cd modules/blog
npm init -y
```

#### 2. Add Dependencies

```json
{
  "name": "@your-org/blog",
  "peerDependencies": {
    "next": ">=14.0.0",
    "react": ">=18.0.0",
    "next-modular": "*"
  }
}
```

#### 3. Create Components

`modules/blog/src/routes/home.tsx`:
```tsx
export default function BlogHome() {
  return (
    <div>
      <h1>Blog</h1>
      <p>Welcome to the blog!</p>
    </div>
  );
}
```

#### 4. Create API Handlers

`modules/blog/src/server/api/posts.ts`:
```typescript
export async function handlePosts(req: Request) {
  const posts = [
    { id: 1, title: 'First Post' },
    { id: 2, title: 'Second Post' },
  ];
  
  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

#### 5. Define Module

`modules/blog/src/index.ts`:
```typescript
import { defineModule } from 'next-modular';
import BlogHome from './routes/home';
import { handlePosts } from './server/api/posts';

export const blogModule = defineModule({
  name: 'blog',
  basePath: '/blog',
  routes: [
    { path: '/home', component: BlogHome },
  ],
  apiRoutes: [
    { path: '/posts', handler: handlePosts },
  ],
});
```

#### 6. Register Module

Add to `modules.config.ts`:
```typescript
import { blogModule } from './modules/blog/src';

export const modules = [
  authModule,
  blogModule, // Add your new module
];
```

## Dynamic Routes

Modules support dynamic route parameters:

```typescript
// Route with dynamic segment
{ path: '/products/[id]', component: ProductDetail }

// API with dynamic segment
{ path: '/api/products/[id]', handler: getProduct }

// Access parameters in component
export default function ProductDetail({ params }: { params?: Record<string, string> }) {
  const productId = params?.id;
  return <div>Product: {productId}</div>;
}

// Access parameters in API handler
export async function getProduct(req: Request, context: any) {
  const productId = context.params?.id;
  return new Response(JSON.stringify({ id: productId }));
}
```

## Example Modules

### Auth Module

The included `@next-modular/auth-module` demonstrates:

- **Routes**: Login (`/auth/login`), register (`/auth/register`), forgot password (`/auth/forgot-password`)
- **API Endpoints**: 
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/logout` - User logout
  - `GET /api/auth/session` - Get current session
- **Middleware**: Request logging and authentication checking
- **Mock Implementation**: Ready-to-customize authentication logic

### Test Module

The `@next-modular/test-module` showcases:

- **Static Routes**: `/test`, `/test/about`
- **Dynamic Routes**: `/test/products/[id]`, `/test/users/[username]`
- **API Endpoints**: Hello, status, products CRUD, users
- **Middleware**: Request logging and custom headers

## Testing Your Module

```bash
# Start the development server
cd apps/test-app
npm run dev
```

Visit your module routes:
- `http://localhost:3010/your-module/home`
- `http://localhost:3010/api/your-module/endpoint`

Test API endpoints:
```bash
curl http://localhost:3010/api/your-module/hello
```

## Development

### Watch Mode

For development with hot reload:

```bash
# Terminal 1 - Watch module changes
cd modules/my-module && npm run dev

# Terminal 2 - Run Next.js app
cd apps/your-app && npm run dev
```

### Building

```bash
# Build specific module
cd modules/my-module && npm run build

# Build all packages (in monorepo)
npm run build
```

## Architecture Benefits

- **Modularity**: Self-contained modules with their own routes, API, and logic
- **Reusability**: Share modules across multiple Next.js applications
- **Type Safety**: Full TypeScript support throughout
- **Scalability**: Easy to add, remove, or update modules
- **Separation of Concerns**: Each module manages its own functionality
- **Maintainability**: Clear structure and boundaries between modules
- **Configuration**: Per-module configuration with type safety
- **Dynamic Routing**: Support for dynamic route parameters

## Advanced Features

### Environment-Based Configuration

```typescript
const isDevelopment = process.env.NODE_ENV === 'development';

export const modules = [
  myModule({
    enableLogging: isDevelopment,
    apiRateLimit: isDevelopment ? 1000 : 100,
  }),
];
```

### Feature Flags

```typescript
export const modules = [
  myModule({
    features: {
      newFeature: process.env.ENABLE_NEW_FEATURE === 'true',
    },
  }),
];
```

### Module-Level Middleware

```typescript
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log(`[My Module] ${req.method} ${req.url}`);
  
  // Add custom headers
  const response = NextResponse.next();
  response.headers.set('X-Module', 'my-module');
  return response;
}
```

## API Reference

### `defineModule<TConfig>(definition: ModuleDefinition)`

Defines a new module with routes, API endpoints, and middleware.

**Parameters:**
- `name` - Unique module identifier
- `basePath` - Base URL path for the module
- `config` - Default configuration (optional)
- `routes` - Array of page routes
- `apiRoutes` - Array of API endpoints
- `middleware` - Middleware handler (optional)

### `handleRoute(pathname: string)`

Matches a pathname to a module route and returns the component.

### `handleApiRoute(req: Request, pathname: string, context?: any)`

Handles API route requests and returns a Response.

### `handleMiddleware(req: NextRequest)`

Executes middleware for matching modules.

### `withNextModular(config: NextModularConfig)`

Next.js config plugin that registers modules.

### `getModuleConfig<T>(moduleName: string)`

Retrieves module configuration at runtime.

## Package Documentation

- [next-modular](packages/next-modular/README.md) - Core package documentation
- [auth-module](packages/auth-module/README.md) - Authentication module
- [test-module](packages/test-module/README.md) - Test/example module

## Troubleshooting

### Module not found

Make sure you:
1. Built the module (`npm run build` in the module directory)
2. Installed dependencies (`npm install`)
3. Registered the module in `modules.config.ts`
4. Imported the module configuration in `next.config.ts` and `next-modular.runtime.ts`

### Route not working

Check that:
1. The module is registered
2. The `basePath` and `path` are correct
3. The component is exported as default
4. You've restarted the dev server

### API endpoint not working

Verify:
1. The API route handler is properly defined
2. The path pattern matches your request
3. The HTTP method is supported in the catch-all route
4. Check server console for errors

### TypeScript errors

Run:
```bash
npm run build
```

Check for linting errors and fix them.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
