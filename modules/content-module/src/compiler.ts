import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

export interface CompiledMdx {
  code: string;
}

/**
 * Compile MDX source string into executable code.
 * This runs on the server during rendering.
 */
export async function compileMdx(source: string): Promise<CompiledMdx> {
  const code = String(
    await compile(source, {
      outputFormat: 'function-body',
      development: false,
    })
  );

  return { code };
}

/**
 * Run compiled MDX code and return a React component.
 * Must be called in a server component context.
 */
export async function runMdx(code: string): Promise<{ default: React.ComponentType<Record<string, unknown>> }> {
  const result = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  } as Parameters<typeof run>[1]);
  return result as { default: React.ComponentType<Record<string, unknown>> };
}
