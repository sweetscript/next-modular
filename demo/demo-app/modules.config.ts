/**
 * Module configuration
 * Add your list of modules here to use in your project
 */
import { exampleModule } from './modules/example-module/src';
import { sitemapModule } from '@next-modular/sitemap-module';
import { securityModule } from '@next-modular/security-module';
import { contentModule } from '@next-modular/content-module';

export const modules = [
  exampleModule,

  sitemapModule({
    baseUrl: 'http://localhost:3000',
    defaultChangeFrequency: 'weekly',
    defaultPriority: 0.7,
    additionalEntries: [
      { url: '/', priority: 1.0, changefreq: 'daily' },
    ],
  }),

  securityModule({
    headers: {
      xFrameOptions: 'SAMEORIGIN',
      referrerPolicy: 'strict-origin-when-cross-origin',
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
    },
    cors: {
      enabled: true,
      origins: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  }),

  contentModule({
    contentDir: './content',
    syntaxHighlight: true,
    tableOfContents: true,
  }),
];
