"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function Logo({ className = "h-7" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src = mounted && resolvedTheme === "dark"
    ? `${basePath}/next-modular-logo-dark.svg`
    : `${basePath}/next-modular-logo.svg`;

  return <img src={src} alt="next-modular" className={className} />;
}
