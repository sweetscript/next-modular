"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Logo({ className = "h-7" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src = mounted && resolvedTheme === "dark"
    ? "/next-modular-logo-dark.svg"
    : "/next-modular-logo.svg";

  return <img src={src} alt="next-modular" className={className} />;
}
