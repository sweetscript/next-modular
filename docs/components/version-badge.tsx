"use client";

import { useEffect, useState } from "react";

const badgeClass =
  "text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300";

/**
 * Shows the latest published version of the npm package, fetched live from the
 * npm registry. Falls back to "Beta" while loading or if the request fails.
 */
export function VersionBadge({ packageName = "next-modular" }: { packageName?: string }) {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch(`https://registry.npmjs.org/${packageName}/latest`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.version) {
          setVersion(data.version);
        }
      })
      .catch(() => {
        /* keep the fallback */
      });

    return () => {
      active = false;
    };
  }, [packageName]);

  return <span className={badgeClass}>{version ? `v${version}` : "Beta"}</span>;
}
