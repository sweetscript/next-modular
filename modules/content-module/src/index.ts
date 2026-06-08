import { defineModule, moduleRegistry } from 'next-modular';
import { getContentList, getContentBySlug } from './content';
import { ContentPage } from './routes/content-page';
import { ContentListPage } from './routes/content-list';

export interface ContentCollection {
  pattern?: string;
  sort?: 'date' | 'title';
  order?: 'asc' | 'desc';
}

export interface ContentModuleConfig {
  contentDir?: string;
  collections?: Record<string, ContentCollection>;
  syntaxHighlight?: boolean;
  tableOfContents?: boolean;
}

export interface ContentMeta {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  [key: string]: unknown;
}

async function contentListHandler(req: Request): Promise<Response> {
  const config = moduleRegistry.getModuleConfig<ContentModuleConfig>('content-module');
  const contentDir = config?.contentDir ?? './content';
  const url = new URL(req.url);
  const collection = url.searchParams.get('collection') ?? undefined;

  try {
    const items = await getContentList(contentDir, collection ? config?.collections?.[collection] : undefined);
    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to load content' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function contentDetailHandler(req: Request, context: { params?: Record<string, string> }): Promise<Response> {
  const config = moduleRegistry.getModuleConfig<ContentModuleConfig>('content-module');
  const contentDir = config?.contentDir ?? './content';
  const slug = context.params?.slug ?? '';

  try {
    const content = await getContentBySlug(contentDir, slug);
    if (!content) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ meta: content.meta, source: content.source }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to load content' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const contentModule = defineModule<ContentModuleConfig>({
  name: 'content-module',
  basePath: '/content',
  routes: [
    { path: '/', component: ContentListPage },
    { path: '/[...slug]', component: ContentPage },
  ],
  apiRoutes: [
    { path: '/', handler: contentListHandler },
    { path: '/[slug]', handler: contentDetailHandler },
  ],
});

export { getContentList, getContentBySlug };
export { compileMdx } from './compiler';
export { ContentRenderer } from './routes/content-renderer';
export default contentModule;
