"use client";

import { useState, useMemo } from "react";
import registry from "../../../data/modules-registry.json";

interface Module {
  name: string;
  description: string;
  version: string;
  category: string;
  icon: string;
  features: string[];
  author: string;
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "authentication", label: "Authentication" },
  { id: "security", label: "Security" },
  { id: "seo", label: "SEO" },
  { id: "content", label: "Content" },
  { id: "devtools", label: "Dev Tools" },
  { id: "analytics", label: "Analytics" },
  { id: "communication", label: "Communication" },
  { id: "payments", label: "Payments" },
  { id: "storage", label: "Storage" },
];

function ModuleCard({ module }: { module: Module }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-neutral-700 p-5 hover:border-teal-500 dark:hover:border-teal-400 transition-colors hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{module.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{module.name}</h3>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400">
            {module.category}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {module.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1">
        {module.features.slice(0, 3).map((feature) => (
          <span
            key={feature}
            className="text-xs px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300"
          >
            {feature}
          </span>
        ))}
        {module.features.length > 3 && (
          <span className="text-xs text-gray-400">
            +{module.features.length - 3}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          {module.author === "official" ? "✓ Official" : "👥 Community"}
        </span>
        <span>v{module.version}</span>
      </div>
    </div>
  );
}

export default function ModulesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredModules = useMemo(() => {
    return (registry.modules as Module[]).filter((mod) => {
      const matchesSearch =
        search === "" ||
        mod.name.toLowerCase().includes(search.toLowerCase()) ||
        mod.description.toLowerCase().includes(search.toLowerCase()) ||
        mod.features.some((f) =>
          f.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCategory =
        activeCategory === "all" || mod.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold">Modules</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Discover and install modules to extend your Next.js application.
      </p>

      {/* Search */}
      <div className="mt-8">
        <input
          type="text"
          placeholder="Search modules..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Search modules"
        />
      </div>

      {/* Category filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${
              activeCategory === cat.id
                ? "bg-teal-500 text-white border-teal-500"
                : "border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-400 hover:border-teal-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mt-6 text-sm text-gray-500">
        {filteredModules.length} module
        {filteredModules.length !== 1 ? "s" : ""} found
      </p>

      {/* Module grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((mod) => (
          <ModuleCard key={mod.name} module={mod} />
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="mt-12 text-center text-gray-500">
          No modules found matching your criteria.
        </div>
      )}
    </main>
  );
}
