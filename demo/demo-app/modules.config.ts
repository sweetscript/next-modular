/**
 * Module configuration
 * Add your list of modules here to use in your project
 */
import { exampleModule } from './modules/example-module/src';
import { contentModule } from '@next-modular/content-module';

export const modules = [
  exampleModule,

  contentModule({
    contentDir: './content',
    syntaxHighlight: true,
    tableOfContents: true,
  }),
];
