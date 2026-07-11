import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 dark:border-neutral-800 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <Logo className="h-6" />
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
              A modular architecture for Next.js applications.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/docs" className="hover:text-teal-600 transition-colors">Documentation</Link></li>
              <li><Link href="/modules" className="hover:text-teal-600 transition-colors">Modules</Link></li>
              <li><Link href="/docs/getting-started" className="hover:text-teal-600 transition-colors">Getting Started</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Community</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="https://github.com/sweetscript/next-modular" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">GitHub</a></li>
              <li><a href="https://github.com/sweetscript/next-modular/issues" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">Issues</a></li>
              <li><a href="https://github.com/sweetscript/next-modular/discussions" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">Discussions</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-neutral-800 text-xs text-gray-400">
          MIT {new Date().getFullYear()} © next-modular
        </div>
      </div>
    </footer>
  );
}
