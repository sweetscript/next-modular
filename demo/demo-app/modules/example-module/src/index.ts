import { defineModule, route } from 'next-modular';
// Import the route file as a namespace so route() can pull the default
// component plus any metadata / generateMetadata exports.
import * as home from './routes/home';
import * as detail from './routes/detail';
// You can also import the component directly and pass it as `component`.
import ExampleModuleAboutPage from './routes/about';
import { helloHandler } from './server/api/hello';
import { getItemHandler } from './server/api/items';
import { exampleModuleMiddleware } from './server/middleware';

export interface ExampleModuleConfig {
  // Add your custom config here
  customOption?: string;
}

/**
 * ExampleModule Module Definition
 * 
 * Configure this module in modules.config.ts:
 * 
 * import { exampleModule } from './modules/example-module/src';
 * 
 * export const modules = [
 *   // Basic usage with all features enabled by default
 *   exampleModule,
 *   
 *   // Configure base features
 *   exampleModule({
 *     enabled: true,
 *     features: {
 *       routes: true,      // Enable/disable page routes
 *       apiRoutes: true,   // Enable/disable API endpoints
 *       middleware: true   // Enable/disable middleware
 *     }
 *   }),
 *   
 *   // Or add custom configuration
 *   exampleModule({
 *     enabled: true,
 *     customOption: 'your value'
 *   })
 * ];
 */
export const exampleModule = defineModule<ExampleModuleConfig>({
  name: 'example-module',
  basePath: '/example',
  routes: [
    // route() reads the component and metadata from the route file.
    route('/', home),
    // You can also pass a component directly.
    { path: '/about', component: ExampleModuleAboutPage },
    route('/[id]', detail),
  ],
  apiRoutes: [
    {
      path: '/hello',
      handler: helloHandler,
    },
    {
      path: '/items/[id]',
      handler: getItemHandler,
    },
  ],
  middleware: {
    handler: exampleModuleMiddleware,
    // Runs on every request (not just /example paths). Any path
    // filtering is handled inside the middleware itself.
    global: true,
  },
});

export default exampleModule;
