import { defineModule } from 'next-modular';
import ExampleModuleHomePage from './routes/home';
import ExampleModuleDetailPage from './routes/detail';
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
  basePath: '/example-module',
  routes: [
    {
      path: '/',
      component: ExampleModuleHomePage,
    },
    {
      path: '/[id]',
      component: ExampleModuleDetailPage,
    },
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
  ],  middleware: {
    handler: exampleModuleMiddleware,
  },
});

export default exampleModule;
