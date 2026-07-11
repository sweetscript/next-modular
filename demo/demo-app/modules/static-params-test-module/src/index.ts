import { defineModule } from 'next-modular';
import StaticTestIndexPage from './routes/index-page';
import StaticTestSlugPage from './routes/slug-page';
import StaticTestNestedPage from './routes/nested-page';

/**
 * Test module for Plan 02: staticParams support.
 *
 * Declares a fixed deterministic set of static paths so the output
 * of generateStaticParams is fully predictable in tests.
 *
 * Verified by: demo/demo-app/e2e/static-params.spec.ts
 */
export const staticParamsTestModule = defineModule({
  name: 'static-params-test-module',
  basePath: '/static-test',

  staticParams: async () => [
    { path: '/' },                       // basePath root → /static-test
    { path: '/page-one' },               // single segment → /static-test/page-one
    { path: '/page-two' },               // multiple at same level → /static-test/page-two
    { path: '/nested/deep' },            // nested → /static-test/nested/deep
    { path: '/nested/deeper/page' },     // 3 levels → /static-test/nested/deeper/page
  ],

  routes: [
    { path: '/', component: StaticTestIndexPage },
    { path: '/[slug]', component: StaticTestSlugPage },
    { path: '/nested/[...segments]', component: StaticTestNestedPage },
  ],
});

export default staticParamsTestModule;
