import React from 'react';
import { moduleRegistry } from 'next-modular';
import { getContentList } from '../content';
import type { ContentModuleConfig } from '../index';

export async function ContentListPage({ params: _params }: { params?: Record<string, string> }) {
  const config = moduleRegistry.getModuleConfig<ContentModuleConfig>('content-module');
  const contentDir = config?.contentDir ?? './content';

  const items = await getContentList(contentDir);

  return (
    <div>
      <h1>Content</h1>
      {items.length === 0 ? (
        <p>No content found.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.slug}>
              <a href={`/content/${item.slug}`}>
                <h2>{item.title}</h2>
                {item.description && <p>{item.description}</p>}
                {item.date && <time>{String(item.date)}</time>}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
