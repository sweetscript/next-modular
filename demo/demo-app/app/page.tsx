import Link from "next/link";

const moduleRoutes = [
  {
    href: "/example",
    title: "Module home",
    description:
      "Registered with route('/', home). Exports static metadata, resolved through the catch-all page.",
  },
  {
    href: "/example/123",
    title: "Dynamic detail route",
    description:
      "Registered with route('/[id]', detail). Uses generateMetadata to build the title from the route params.",
  },
  {
    href: "/example/about",
    title: "About (direct component form)",
    description:
      "Registered with { path: '/about', component: AboutPage } — the plain object form, no route() helper.",
  },
  {
    href: "/api/example/hello",
    title: "API route",
    description: "GET /api/example/hello — a module API endpoint.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-6 py-20 sm:px-10">
        <header className="flex flex-col gap-3">
          <span className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            next-modular demo
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Modular routes, metadata, and middleware for Next.js
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            This app registers a single example module. The links below are all
            served by that module through the catch-all routes.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Try the example module
          </h2>
          <ul className="flex flex-col gap-3">
            {moduleRoutes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className="block rounded-xl border border-black/[.08] bg-white p-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:bg-black dark:hover:bg-[#1a1a1a]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-black dark:text-zinc-50">
                      {route.title}
                    </span>
                    <code className="text-sm text-zinc-500">{route.href}</code>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {route.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
