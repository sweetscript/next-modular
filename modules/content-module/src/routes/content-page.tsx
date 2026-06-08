import React from 'react';
import { moduleRegistry } from 'next-modular';
import { getContentBySlug } from '../content';
import { ContentRenderer } from './content-renderer';
import type { ContentModuleConfig } from '../index';

export async function ContentPage({ params }: { params?: Record<string, string> }) {
  const slug = params?.slug ?? '';
  const config = moduleRegistry.getModuleConfig<ContentModuleConfig>('content-module');
  const contentDir = config?.contentDir ?? './content';

  const content = await getContentBySlug(contentDir, slug);

  if (!content) {
    return (
      <div>
        <h1>Not Found</h1>
        <p>Content not found for: {slug}</p>
      </div>
    );
  }

  return (
    <article>
      <header>
        <h1>{content.meta.title}</h1>
        {content.meta.date && <time>{String(content.meta.date)}</time>}
        {content.meta.description && <p>{content.meta.description}</p>}
      </header>
      <ContentRenderer source={content.source} />
    </article>
  );
}
