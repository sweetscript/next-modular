import { defineModule } from 'next-modular';
import EdgeTestPage from './routes/home';
import EdgeTestDetailPage from './routes/detail';
import {
  edgePingHandler,
  edgeHeadersHandler,
  edgeItemHandler,
  edgeTestMiddleware,
} from './handlers';

/**
 * Test module for Plan 03: Edge runtime compatibility.
 * Uses only Web APIs — zero Node.js dependencies.
 * Verified by: demo/demo-edge-app/e2e/edge-runtime.spec.ts
 */
export const edgeTestModule = defineModule({
  name: 'edge-test-module',
  basePath: '/edge-test',

  routes: [
    { path: '/', component: EdgeTestPage },
    { path: '/[id]', component: EdgeTestDetailPage },
  ],

  apiRoutes: [
    { path: '/ping', handler: edgePingHandler },
    { path: '/headers', handler: edgeHeadersHandler },
    { path: '/[id]', handler: edgeItemHandler },
  ],

  middleware: {
    handler: edgeTestMiddleware,
  },
});

export default edgeTestModule;
