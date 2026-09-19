import React from 'react';
import Link from 'next/link';

// This route is registered by passing the component directly in the module
// definition (see index.ts), rather than via the route() helper. If you want
// metadata for a route wired this way, attach it in the route object.
export default function ExampleModuleAboutPage() {
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
            about
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Registered with the direct component form
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            The home and detail routes use the <code>route()</code> helper, which
            also wires up their metadata / generateMetadata exports. This route is
            registered by passing the component directly.
          </p>
        </header>

        <section className="rounded-xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-black">
          <pre className="overflow-x-auto text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            <code>{`{ path: '/about', component: ExampleModuleAboutPage }`}</code>
          </pre>
        </section>
      </main>
    </div>
  );
}
