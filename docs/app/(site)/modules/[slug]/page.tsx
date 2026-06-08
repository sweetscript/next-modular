import fs from "fs";
import path from "path";
import Link from "next/link";
import registry from "../../../../data/modules-registry.json";
import { ModuleReadme } from "./module-readme";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface Module {
  name: string;
  slug: string;
  description: string;
  version: string;
  category: string;
  iconUrl: string;
  features: string[];
  author: string;
}

export function generateStaticParams() {
  return registry.modules.map((mod) => ({
    slug: mod.slug,
  }));
}

function getModuleReadme(slug: string): string {
  const readmePath = path.join(
    process.cwd(),
    "..",
    "modules",
    slug,
    "README.md"
  );
  try {
    return fs.readFileSync(readmePath, "utf-8");
  } catch {
    return `# ${slug}\n\nNo documentation available yet.`;
  }
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const module = registry.modules.find(
    (m) => m.slug === slug
  ) as Module | undefined;

  if (!module) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <p>Module not found.</p>
      </main>
    );
  }

  const readme = getModuleReadme(slug);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/modules"
        className="text-sm text-gray-500 hover:text-teal-600 transition-colors"
      >
        ← Back to Modules
      </Link>

      <div className="mt-6 flex items-center gap-4">
        <img
          src={`${basePath}${module.iconUrl}`}
          alt={`${module.name} icon`}
          width={48}
          height={48}
          className="dark:brightness-300"
        />
        <div>
          <h1 className="text-2xl font-bold">{module.name}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-xs">
              {module.category}
            </span>
            <span>v{module.version}</span>
            <span>
              {module.author === "official" ? "✓ Official" : "👥 Community"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {module.features.map((feature) => (
          <span
            key={feature}
            className="text-xs px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300"
          >
            {feature}
          </span>
        ))}
      </div>

      <hr className="my-8 border-gray-200 dark:border-neutral-800" />

      <ModuleReadme content={readme} />
    </main>
  );
}
