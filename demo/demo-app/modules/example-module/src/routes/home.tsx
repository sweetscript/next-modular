import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

// Static route metadata — resolved by next-modular's handleMetadata in the
// catch-all page's generateMetadata.
export const metadata: Metadata = {
  title: 'Example Module',
  description: 'Home page of the example-module.',
};

const exampleItems = [
  { id: '123', name: 'Item 123' },
  { id: 'user-42', name: 'User 42' },
  { id: 'abc-xyz', name: 'ABC XYZ' },
];

export default function ExampleModuleHomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-6 py-20 sm:px-10">
        <header className="flex flex-col gap-3">
          <span className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            example module
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Welcome to the example module
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            This page is served by the module at <code>basePath: &apos;/example&apos;</code>,
            registered with the <code>route()</code> helper and exporting static
            metadata.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Dynamic routes
          </h2>
          <ul className="flex flex-col gap-3">
            {exampleItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/example/${item.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-black/[.08] bg-white p-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:bg-black dark:hover:bg-[#1a1a1a]"
                >
                  <span className="font-medium text-black dark:text-zinc-50">
                    {item.name}
                  </span>
                  <code className="text-sm text-zinc-500">/example/{item.id}</code>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            More
          </h2>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                href="/example/about"
                className="block rounded-xl border border-black/[.08] bg-white p-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:bg-black dark:hover:bg-[#1a1a1a]"
              >
                <span className="font-medium text-black dark:text-zinc-50">
                  About this module
                </span>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  A static route registered with the direct component form.
                </p>
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
