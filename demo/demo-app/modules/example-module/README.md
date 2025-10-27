# ExampleModule Module

A Next Modular module.

## Features

- Routes (pages)
- ✅ API endpoints
- ✅ Middleware


## Usage

Add to your `modules.config.ts`:

```typescript
import { exampleModule } from './modules/example-module/src';

export const modules = [
  // Basic usage - all features enabled by default
  exampleModule,
  
  // Control module features:
  exampleModule({
    enabled: true,          // Enable/disable entire module
    features: {
      routes: true,         // Enable/disable page routes
      apiRoutes: true,      // Enable/disable API endpoints
      middleware: true      // Enable/disable middleware
    }
  }),
  
  // Disable specific features:
  exampleModule({
    features: {
      apiRoutes: false      // Disable API routes, keep pages and middleware
    }
  }),
];
```

## Routes

- `/example-module` - Home page
- `/example-module/[id]` - Detail page with dynamic ID parameter

## API Endpoints

- `GET /api/example-module/hello` - Hello endpoint
- `GET /api/example-module/items/[id]` - Get item by ID (dynamic route)

## Configuration

The module supports Next Modular's base configuration:

- `enabled` (boolean): Enable/disable the entire module
- `features.routes` (boolean): Enable/disable page routes
- `features.apiRoutes` (boolean): Enable/disable API endpoints
- `features.middleware` (boolean): Enable/disable middleware

You can also add custom configuration by extending the config interface.

## Development

Edit the files in `src/` to customize your module.
