import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { ContentMeta, ContentCollection } from './index';

export async function getContentList(
  contentDir: string,
  collection?: ContentCollection
): Promise<ContentMeta[]> {
  const resolvedDir = path.resolve(process.cwd(), contentDir);

  let files: string[];
  try {
    files = await fs.readdir(resolvedDir);
  } catch {
    return [];
  }

  const mdxFiles = files.filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const items: ContentMeta[] = [];

  for (const file of mdxFiles) {
    const filePath = path.join(resolvedDir, file);
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data } = matter(raw);
    const slug = file.replace(/\.(mdx|md)$/, '');

    items.push({
      slug,
      title: data.title ?? slug,
      description: data.description,
      date: data.date ? String(data.date) : undefined,
      tags: data.tags,
      ...data,
    });
  }

  // Sort
  const sortField = collection?.sort ?? 'date';
  const order = collection?.order ?? 'desc';

  items.sort((a, b) => {
    const aVal = String(a[sortField] ?? '');
    const bVal = String(b[sortField] ?? '');
    const cmp = aVal.localeCompare(bVal);
    return order === 'desc' ? -cmp : cmp;
  });

  return items;
}

export async function getContentBySlug(
  contentDir: string,
  slug: string
): Promise<{ meta: ContentMeta; source: string } | null> {
  const resolvedDir = path.resolve(process.cwd(), contentDir);

  const extensions = ['.mdx', '.md'];
  let filePath: string | null = null;
  let raw: string | null = null;

  for (const ext of extensions) {
    const candidate = path.join(resolvedDir, `${slug}${ext}`);
    try {
      raw = await fs.readFile(candidate, 'utf-8');
      filePath = candidate;
      break;
    } catch {
      continue;
    }
  }

  if (!raw || !filePath) return null;

  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title ?? slug,
      description: data.description,
      date: data.date ? String(data.date) : undefined,
      tags: data.tags,
      ...data,
    },
    source: content,
  };
}
