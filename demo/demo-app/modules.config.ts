/**
 * Module configuration
 * Add your list of modules here to use in your project
 */
import { exampleModule } from './modules/example-module/src';
import { contentModule } from '@next-modular/content-module';
import { nextConfigTestModuleWithRoutes } from './modules/next-config-test-module/src/runtime';
import { staticParamsTestModule } from './modules/static-params-test-module/src';

export const modules = [
  exampleModule,

  contentModule({
    contentDir: './content',
    syntaxHighlight: true,
    tableOfContents: true,
  }),

  nextConfigTestModuleWithRoutes,
  staticParamsTestModule,
];
