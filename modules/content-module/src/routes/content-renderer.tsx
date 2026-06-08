import React from 'react';
import { compileMdx, runMdx } from '../compiler';

interface ContentRendererProps {
  source: string;
  components?: Record<string, React.ComponentType>;
}

/**
 * Server component that compiles and renders MDX at runtime.
 * Use this in your pages to render MDX content.
 */
export async function ContentRenderer({ source, components }: ContentRendererProps) {
  const { code } = await compileMdx(source);
  const { default: MDXContent } = await runMdx(code);

  return <MDXContent {...(components ? { components } : {})} />;
}
