import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

interface DetailPageProps {
  params: {
    id: string;
  };
}

// Dynamic route metadata — receives the matched route params and builds the
// title from the id. Resolved by next-modular's handleMetadata.
export function generateMetadata({ params }: { params: Record<string, string> }): Metadata {
  return {
    title: `Item ${params.id} — Example Module`,
    description: `Detail view for item ${params.id}.`,
  };
}

export default function ExampleModuleDetailPage({ params }: DetailPageProps) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-20 sm:px-10">
        <Link
          href="/example"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-black dark:hover:text-zinc-50"
        >
          ← Back to example module
        </Link>

        <header className="flex flex-col gap-3">
          <span className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            detail view
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Item{' '}
            <code className="rounded-md bg-black/[.04] px-2 py-1 text-2xl dark:bg-white/[.08]">
              {params.id}
            </code>
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            This route is registered with <code>route(&apos;/[id]&apos;, detail)</code> and
            uses <code>generateMetadata</code> to build the page title from the
            route params.
          </p>
        </header>

        <section className="rounded-xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-black">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Route parameter
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Matched the dynamic pattern <code>/[id]</code>. The <code>id</code>{' '}
            parameter (<code>{params.id}</code>) is extracted from the URL and can
            be used to fetch data or render item-specific content.
          </p>
        </section>
      </main>
    </div>
  );
}
