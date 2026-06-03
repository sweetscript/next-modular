"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-neutral-800 bg-white/80 dark:bg-[#0f1a1a]/80 backdrop-blur-md">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/">
          <Logo className="h-7" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/docs" className="hover:text-teal-600 transition-colors">
            Docs
          </Link>
          <Link href="/modules" className="hover:text-teal-600 transition-colors">
            Modules
          </Link>
          <a
            href="https://github.com/sweetscript/next-modular"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-600 transition-colors"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-neutral-800 px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/docs" onClick={() => setMenuOpen(false)} className="hover:text-teal-600 transition-colors">
            Docs
          </Link>
          <Link href="/modules" onClick={() => setMenuOpen(false)} className="hover:text-teal-600 transition-colors">
            Modules
          </Link>
          <a
            href="https://github.com/sweetscript/next-modular"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-600 transition-colors"
          >
            GitHub
          </a>
        </div>
      )}
    </header>
  );
}
