import Link from "next/link";
import {
  FolderIcon,
  FileIcon,
  PackageIcon,
  PuzzleIcon,
  BoltIcon,
  ArrowPathIcon,
  CogIcon,
  RouteIcon,
  ShieldIcon,
  CubeIcon,
  WrenchIcon,
  CodeIcon,
} from "../../components/icons";
import { HeroCodePreview } from "../../components/hero-code-preview";

export default function Home() {
  return (
    <>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left - text */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Under development, contributions welcome
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
              Modular architecture
              <br />
              <span className="text-teal-600">for Next.js</span>
            </h1>
            <p className="mt-5 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Build scalable Next.js applications with plug-and-play modules.
              Add authentication, payments, CMS, and more with a single command.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href="/docs"
                className="px-5 py-2.5 bg-teal-600 text-white rounded-lg font-medium text-sm hover:bg-teal-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/modules"
                className="px-5 py-2.5 border border-gray-200 dark:border-neutral-700 rounded-lg font-medium text-sm hover:border-teal-400 transition-colors"
              >
                Browse Modules
              </Link>
            </div>
          </div>

          {/* Right - code preview */}
          <div className="relative flex items-center justify-center">
            <HeroCodePreview />
          </div>
        </div>

        {/* Terminal */}
        <div className="mt-16 max-w-lg mx-auto text-left">
          <div className="bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-800">
            <div className="p-5 text-sm font-mono">
              <p className="text-gray-400 dark:text-gray-400">{"# Initialize"}</p>
              <p className="text-teal-600 dark:text-green-400">npx next-modular init</p>
              <p className="mt-3 text-gray-400 dark:text-gray-400">{"# Add a module"}</p>
              <p className="text-teal-600 dark:text-green-400">npx next-modular add @next-modular/auth-module</p>
            </div>
          </div>
        </div>
      </main>

      {/* How it works - diagram section */}
      <section className="max-w-5xl mx-auto px-6 py-14 border-t border-gray-100 dark:border-neutral-800">
        <h2 className="text-3xl font-bold text-center">How it works</h2>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Every module is a self-contained feature. Pages, APIs, middleware, components, all in one box.
          Drop it into a project, it wires itself up. Move it to another project, same thing.
        </p>

        <div className="mt-14 flex justify-center">
          <svg viewBox="0 0 600 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl" aria-label="Diagram showing a module containing Pages, API, Middleware, and Components being plugged into two different apps">
            {/* Module box */}
            <rect x="10" y="30" width="200" height="160" rx="12" className="stroke-teal-300 dark:stroke-teal-700 fill-teal-50 dark:fill-teal-950/30" strokeWidth="2" />
            <text x="110" y="58" textAnchor="middle" className="fill-teal-700 dark:fill-teal-300" fontSize="13" fontFamily="monospace" fontWeight="600">Module</text>
            {/* Inner boxes */}
            <rect x="28" y="72" width="80" height="28" rx="6" className="fill-white dark:fill-neutral-800 stroke-gray-200 dark:stroke-neutral-700" strokeWidth="1" />
            <text x="68" y="91" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10" fontFamily="monospace">Pages</text>
            <rect x="118" y="72" width="80" height="28" rx="6" className="fill-white dark:fill-neutral-800 stroke-gray-200 dark:stroke-neutral-700" strokeWidth="1" />
            <text x="158" y="91" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10" fontFamily="monospace">API</text>
            <rect x="28" y="110" width="80" height="28" rx="6" className="fill-white dark:fill-neutral-800 stroke-gray-200 dark:stroke-neutral-700" strokeWidth="1" />
            <text x="68" y="129" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10" fontFamily="monospace">Middleware</text>
            <rect x="118" y="110" width="80" height="28" rx="6" className="fill-white dark:fill-neutral-800 stroke-gray-200 dark:stroke-neutral-700" strokeWidth="1" />
            <text x="158" y="129" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400" fontSize="10" fontFamily="monospace">Components</text>

            {/* Arrow from module to fork point */}
            <line x1="210" y1="110" x2="300" y2="110" className="stroke-gray-300 dark:stroke-neutral-600" strokeWidth="1.5" />
            {/* Fork vertical */}
            <line x1="300" y1="60" x2="300" y2="160" className="stroke-gray-300 dark:stroke-neutral-600" strokeWidth="1.5" />
            {/* Top branch arrow */}
            <line x1="300" y1="60" x2="380" y2="60" className="stroke-gray-300 dark:stroke-neutral-600" strokeWidth="1.5" />
            <polygon points="378,55 388,60 378,65" className="fill-gray-300 dark:fill-neutral-600" />
            {/* Bottom branch arrow */}
            <line x1="300" y1="160" x2="380" y2="160" className="stroke-gray-300 dark:stroke-neutral-600" strokeWidth="1.5" />
            <polygon points="378,155 388,160 378,165" className="fill-gray-300 dark:fill-neutral-600" />

            {/* App A */}
            <rect x="390" y="20" width="180" height="80" rx="10" className="fill-white dark:fill-neutral-900 stroke-gray-200 dark:stroke-neutral-700" strokeWidth="1.5" />
            <text x="410" y="40" className="fill-gray-400 dark:fill-gray-500" fontSize="10" fontFamily="monospace">App A</text>
            {/* Dashed slot highlighted */}
            <rect x="405" y="48" width="150" height="20" rx="4" className="fill-teal-50 dark:fill-teal-950/20 stroke-teal-300 dark:stroke-teal-700" strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Other slots */}
            <rect x="405" y="74" width="150" height="16" rx="4" className="fill-none stroke-gray-200 dark:stroke-neutral-700" strokeWidth="1" strokeDasharray="4 3" />

            {/* App B */}
            <rect x="390" y="120" width="180" height="80" rx="10" className="fill-white dark:fill-neutral-900 stroke-gray-200 dark:stroke-neutral-700" strokeWidth="1.5" />
            <text x="410" y="140" className="fill-gray-400 dark:fill-gray-500" fontSize="10" fontFamily="monospace">App B</text>
            {/* Dashed slot highlighted */}
            <rect x="405" y="148" width="150" height="20" rx="4" className="fill-teal-50 dark:fill-teal-950/20 stroke-teal-300 dark:stroke-teal-700" strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Other slots */}
            <rect x="405" y="174" width="150" height="16" rx="4" className="fill-none stroke-gray-200 dark:stroke-neutral-700" strokeWidth="1" strokeDasharray="4 3" />
          </svg>
        </div>

        {/* Features under diagram */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 p-4">
            <PuzzleIcon className="w-7 h-7 text-teal-600 dark:text-teal-400 mb-2" />
            <h3 className="font-semibold text-sm">Plug & Play</h3>
            <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Modules auto-register routes, API endpoints, and middleware. No wiring needed.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 p-4">
            <svg className="w-7 h-7 text-teal-600 dark:text-teal-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" /></svg>
            <h3 className="font-semibold text-sm">Feature-First Organisation</h3>
            <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Everything for a feature lives in one folder. No more hunting across scattered directories.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 p-4">
            <CodeIcon className="w-7 h-7 text-teal-600 dark:text-teal-400 mb-2" />
            <h3 className="font-semibold text-sm">CLI Powered</h3>
            <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Add, create, and manage modules from the command line. Fast and simple.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 p-4">
            <svg className="w-7 h-7 text-teal-600 dark:text-teal-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
            <h3 className="font-semibold text-sm">Community Modules</h3>
            <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Browse the registry or publish your own modules for others to use.
            </p>
          </div>
        </div>
      </section>

      {/* Why not micro-frontends */}
      <section className="max-w-5xl mx-auto px-6 py-14 border-t border-gray-100 dark:border-neutral-800">
        <h2 className="text-3xl font-bold text-center">
          Stop over-engineering
        </h2>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          You don&apos;t need 6 repos and a platform team to ship features independently.
        </p>

        <div className="mt-16 relative">
          <div className="flex flex-col md:flex-row items-stretch gap-6">
            {/* Micro-frontends card */}
            <div className="flex-1 relative rounded-2xl bg-gradient-to-b from-red-50 to-white dark:from-red-950/30 dark:to-neutral-900 border border-red-100 dark:border-red-900/40 p-8 overflow-hidden">
              <div className="absolute top-4 right-4 opacity-10 text-red-500">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red-400">The hard way</p>
              <h3 className="mt-2 text-xl font-bold">Micro-frontends</h3>
              <div className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-[10px]">1</span>
                  <span>Split your app into separate repos and deployments</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-[10px]">2</span>
                  <span>Set up separate CI/CD pipelines for each</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-[10px]">3</span>
                  <span>Solve shared state, auth, routing, and versioning</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-[10px]">4</span>
                  <span>Debug runtime integration issues in production</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-[10px]">5</span>
                  <span>Hire a platform team to maintain it all</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-[10px]">6</span>
                  <span>Pay for hosting, infra, and monitoring per service</span>
                </div>
              </div>
              <p className="mt-6 text-xs text-red-400 font-medium">High complexity · High cost · Slow to ship</p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center md:flex-col">
              <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-teal-600/30">
                or
              </div>
            </div>

            {/* next-modular card */}
            <div className="flex-1 relative rounded-2xl bg-gradient-to-b from-green-50 to-white dark:from-green-950/30 dark:to-neutral-900 border border-green-100 dark:border-green-900/40 p-8 overflow-hidden">
              <div className="absolute top-4 right-4 opacity-10 text-green-500">
                <BoltIcon className="w-16 h-16" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-green-500">The simple way</p>
              <h3 className="mt-2 text-xl font-bold">next-modular</h3>
              <div className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-[10px]">1</span>
                  <span>One repo, one build, one deployment</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-[10px]">2</span>
                  <span>Features isolated into modules with clean boundaries</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-[10px]">3</span>
                  <span>Share state, types, and utilities freely across modules</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-[10px]">4</span>
                  <span>Build a module once, plug it into every project</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-[10px]">5</span>
                  <span>No extra infra, no platform team needed</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-[10px]">6</span>
                  <span>Zero runtime stitching, zero network hops</span>
                </div>
              </div>
              <p className="mt-6 text-xs text-green-500 font-medium">Low complexity · No extra cost · Ship quickly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="max-w-5xl mx-auto px-6 py-14 border-t border-gray-100 dark:border-neutral-800">
        <h2 className="text-3xl font-bold text-center">
          Organize by feature, not by type
        </h2>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Stop hunting for related code across your entire project.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before */}
          <div>
            <div className="rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-neutral-800 px-4 py-2.5 flex items-center border-b border-gray-200 dark:border-neutral-700">
                <span className="text-xs text-gray-500 font-mono">typical-nextjs-app</span>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-900 text-xs font-mono space-y-1">
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-600 dark:text-gray-300">app/</span></div>
                <div className="flex items-center gap-2 pl-5 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">login/</span></div>
                <div className="flex items-center gap-2 pl-9 text-gray-500"><FileIcon className="w-4 h-4" /> page.tsx</div>
                <div className="flex items-center gap-2 pl-5 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">register/</span></div>
                <div className="flex items-center gap-2 pl-9 text-gray-500"><FileIcon className="w-4 h-4" /> page.tsx</div>
                <div className="flex items-center gap-2 pl-5 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">dashboard/</span></div>
                <div className="flex items-center gap-2 pl-9 text-gray-500"><FileIcon className="w-4 h-4" /> page.tsx</div>
                <div className="flex items-center gap-2 pl-5 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">checkout/</span></div>
                <div className="flex items-center gap-2 pl-9 text-gray-500"><FileIcon className="w-4 h-4" /> page.tsx</div>
                <div className="flex items-center gap-2 pl-5 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">api/</span></div>
                <div className="flex items-center gap-2 pl-10 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">auth/</span></div>
                <div className="flex items-center gap-2 pl-14 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">login/</span></div>
                <div className="flex items-center gap-2 pl-[4.5rem] text-gray-500"><FileIcon className="w-4 h-4" /> route.ts</div>
                <div className="flex items-center gap-2 pl-14 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">session/</span></div>
                <div className="flex items-center gap-2 pl-[4.5rem] text-gray-500"><FileIcon className="w-4 h-4" /> route.ts</div>
                <div className="flex items-center gap-2 pl-10 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">payments/</span></div>
                <div className="flex items-center gap-2 pl-14 text-gray-500"><FileIcon className="w-4 h-4" /> route.ts</div>
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">lib/</span></div>
                <div className="flex items-center gap-2 pl-5 text-gray-500"><FileIcon className="w-4 h-4" /> auth.ts</div>
                <div className="flex items-center gap-2 pl-5 text-gray-500"><FileIcon className="w-4 h-4" /> session.ts</div>
                <div className="flex items-center gap-2 pl-5 text-gray-500"><FileIcon className="w-4 h-4" /> payments.ts</div>
                <div className="flex items-center gap-2 text-gray-500"><FileIcon className="w-4 h-4" /> middleware.ts</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-red-600 dark:text-red-400 font-medium px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/20">
              Debugging means grepping across the whole project.
            </p>
            <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/20">
              A single feature scattered across the entire codebase.
            </p>
            <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/20">
              Hard to maintain what you can&apos;t see in one place.
            </p>
          </div>

          {/* After */}
          <div>
            <div className="rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-neutral-800 px-4 py-2.5 flex items-center border-b border-gray-200 dark:border-neutral-700">
                <span className="text-xs text-gray-500 font-mono">next-modular-app</span>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-900 text-xs font-mono space-y-1">
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">app/</span></div>
                <div className="flex items-center gap-2 pl-5 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">dashboard/</span></div>
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">modules/</span></div>
                <div className="flex items-center gap-2 pl-5 text-teal-500 font-medium"><PackageIcon className="w-4 h-4" /> auth-module/</div>
                <div className="flex items-center gap-2 pl-10 text-teal-500"><FileIcon className="w-4 h-4" /> index.ts</div>
                <div className="flex items-center gap-2 pl-10 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">routes/</span></div>
                <div className="flex items-center gap-2 pl-14 text-gray-500"><FileIcon className="w-4 h-4" /> login.tsx</div>
                <div className="flex items-center gap-2 pl-14 text-gray-500"><FileIcon className="w-4 h-4" /> register.tsx</div>
                <div className="flex items-center gap-2 pl-10 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">server/api/</span></div>
                <div className="flex items-center gap-2 pl-14 text-gray-500"><FileIcon className="w-4 h-4" /> login.ts</div>
                <div className="flex items-center gap-2 pl-14 text-gray-500"><FileIcon className="w-4 h-4" /> session.ts</div>
                <div className="flex items-center gap-2 pl-10 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">lib/</span></div>
                <div className="flex items-center gap-2 pl-10 text-gray-500"><FileIcon className="w-4 h-4" /> middleware.ts</div>
                <div className="flex items-center gap-2 pl-5 text-teal-500 font-medium"><PackageIcon className="w-4 h-4" /> payments-module/</div>
                <div className="flex items-center gap-2 pl-10 text-teal-500"><FileIcon className="w-4 h-4" /> index.ts</div>
                <div className="flex items-center gap-2 pl-10 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">routes/</span></div>
                <div className="flex items-center gap-2 pl-14 text-gray-500"><FileIcon className="w-4 h-4" /> checkout.tsx</div>
                <div className="flex items-center gap-2 pl-10 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">server/api/</span></div>
                <div className="flex items-center gap-2 pl-14 text-gray-500"><FileIcon className="w-4 h-4" /> webhook.ts</div>
                <div className="flex items-center gap-2 pl-10 text-amber-500 dark:text-amber-400"><FolderIcon className="w-4 h-4" /> <span className="text-gray-500">lib/</span></div>
                <div className="flex items-center gap-2 text-teal-500"><FileIcon className="w-4 h-4" /> modules.config.ts</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-green-600 dark:text-green-400 font-medium px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950/20">
              Readable at a glance. Debuggable in minutes.
            </p>
            <p className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950/20">
              Delete the folder, delete the feature. That simple.
            </p>
            <p className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950/20">
              One folder, full picture. No mental mapping needed.
            </p>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-5xl mx-auto px-6 py-14 border-t border-gray-100 dark:border-neutral-800">
        <h2 className="text-3xl font-bold text-center">Everything you need</h2>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          A complete toolkit for building modular Next.js applications at any scale.
        </p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <PuzzleIcon className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-semibold">Plug & Play Modules</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Add a module and it auto-registers its routes, APIs, and middleware. No manual wiring.</p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <BoltIcon className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-semibold">CLI Scaffolding</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Init projects, add registry modules, or create new ones from templates in seconds.</p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <ArrowPathIcon className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-semibold">Reusable Across Projects</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Publish a module to npm and use it in every Next.js app. Build once, use everywhere.</p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <CogIcon className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-semibold">Per-Module Configuration</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Enable/disable features, pass custom options, and toggle routes, APIs, or middleware independently.</p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <RouteIcon className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-semibold">Dynamic Route Matching</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Supports static, dynamic, and catch-all routes. Params are extracted and passed automatically.</p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <ShieldIcon className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-semibold">Scoped Middleware</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Each module runs its own middleware only for its own routes. No global middleware soup.</p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <CubeIcon className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-semibold">Module Registry</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Browse community and official modules. Install pre-built features with a single command.</p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <WrenchIcon className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-semibold">Zero Build Overhead</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">No code generation or build plugins. Modules resolve at runtime through standard Next.js catch-all routes.</p>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <CodeIcon className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-semibold">TypeScript Native</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Full type safety for module definitions, configs, and handlers. Autocomplete everywhere.</p>
          </div>
        </div>
      </section>
    </>
  );
}
