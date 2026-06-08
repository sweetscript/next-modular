"use client";

import { useState } from "react";

const tabs = [
  { id: "config", label: "./modules.config.ts" },
  { id: "module", label: "./modules/my-module/index.ts" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function HeroCodePreview() {
  const [activeTab, setActiveTab] = useState<TabId>("config");

  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-800 shadow-xl">
      {/* Tabs */}
      <div className="px-4 py-2 bg-gray-100 dark:bg-neutral-800 flex items-center gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 text-[11px] font-mono rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-white dark:bg-neutral-700 text-gray-800 dark:text-gray-200 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code */}
      <div className="p-5 text-[12px] font-mono leading-relaxed overflow-x-auto whitespace-nowrap">
        {activeTab === "config" ? <ConfigCode /> : <ModuleCode />}
      </div>
    </div>
  );
}

function ConfigCode() {
  return (
    <>
      <p className="text-gray-400 dark:text-gray-600">{"// Import published module"}</p>
      <p>
        <span className="text-purple-600 dark:text-purple-400">import</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">{"{"} authModule {"}"}</span>{" "}
        <span className="text-purple-600 dark:text-purple-400">from</span>{" "}
        <span className="text-green-600 dark:text-green-400">&apos;@next-modular/auth&apos;</span>
      </p>
      <p className="mt-2 text-gray-400 dark:text-gray-600">{"// Import local module"}</p>
      <p>
        <span className="text-purple-600 dark:text-purple-400">import</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">{"{"} myModule {"}"}</span>{" "}
        <span className="text-purple-600 dark:text-purple-400">from</span>{" "}
        <span className="text-green-600 dark:text-green-400">&apos;./modules/my-module&apos;</span>
      </p>
      <p className="mt-3">
        <span className="text-purple-600 dark:text-purple-400">export const</span>{" "}
        <span className="text-blue-600 dark:text-blue-300">modules</span>{" "}
        <span className="text-gray-500">=</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">[</span>
      </p>
      <p className="pl-4">
        <span className="text-amber-600 dark:text-yellow-300">authModule</span>
        <span className="text-gray-500">({"{"}</span>
      </p>
      <p className="pl-8">
        <span className="text-gray-600 dark:text-gray-400">providers:</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">[</span>
        <span className="text-green-600 dark:text-green-400">&apos;google&apos;</span>
        <span className="text-gray-800 dark:text-gray-300">]</span>
        <span className="text-gray-500">,</span>
      </p>
      <p className="pl-8">
        <span className="text-gray-600 dark:text-gray-400">features:</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">{"{"}</span>
      </p>
      <p className="pl-12">
        <span className="text-gray-600 dark:text-gray-400">routes:</span>{" "}
        <span className="text-purple-600 dark:text-purple-400">true</span>
        <span className="text-gray-500">,</span>
      </p>
      <p className="pl-12">
        <span className="text-gray-600 dark:text-gray-400">apiRoutes:</span>{" "}
        <span className="text-purple-600 dark:text-purple-400">true</span>
        <span className="text-gray-500">,</span>
      </p>
      <p className="pl-12">
        <span className="text-gray-600 dark:text-gray-400">middleware:</span>{" "}
        <span className="text-purple-600 dark:text-purple-400">false</span>
      </p>
      <p className="pl-8">
        <span className="text-gray-800 dark:text-gray-300">{"}"}</span>
      </p>
      <p className="pl-4">
        <span className="text-gray-500">{"}"})</span>
        <span className="text-gray-500">,</span>
      </p>
      <p className="pl-4">
        <span className="text-amber-600 dark:text-yellow-300">myModule</span>
        <span className="text-gray-500">,</span>
      </p>
      <p>
        <span className="text-gray-800 dark:text-gray-300">]</span>
      </p>
      <p className="mt-3 text-gray-400 dark:text-gray-600">{"// Routes, APIs & middleware registered automatically."}</p>
    </>
  );
}

function ModuleCode() {
  return (
    <>
    <p className="text-gray-400 dark:text-gray-600">{"// Import next-modular utils"}</p>
      <p>
        <span className="text-purple-600 dark:text-purple-400">import</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">{"{"} defineModule {"}"}</span>{" "}
        <span className="text-purple-600 dark:text-purple-400">from</span>{" "}
        <span className="text-green-600 dark:text-green-400">&apos;next-modular&apos;</span>
      </p>
      <p className="text-gray-400 dark:text-gray-600 mt-2">{"// Import module resources"}</p>
      <p>
        <span className="text-purple-600 dark:text-purple-400">import</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">{"{"} DashboardPage {"}"}</span>{" "}
        <span className="text-purple-600 dark:text-purple-400">from</span>{" "}
        <span className="text-green-600 dark:text-green-400">&apos;./routes/dashboard&apos;</span>
      </p>
      <p>
        <span className="text-purple-600 dark:text-purple-400">import</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">{"{"} helloHandler {"}"}</span>{" "}
        <span className="text-purple-600 dark:text-purple-400">from</span>{" "}
        <span className="text-green-600 dark:text-green-400">&apos;./server/api/hello&apos;</span>
      </p>
      <p>
        <span className="text-purple-600 dark:text-purple-400">import</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">{"{"} myMiddleware {"}"}</span>{" "}
        <span className="text-purple-600 dark:text-purple-400">from</span>{" "}
        <span className="text-green-600 dark:text-green-400">&apos;./server/middleware&apos;</span>
      </p>
      <p className="mt-2">
        <span className="text-purple-600 dark:text-purple-400">export const</span>{" "}
        <span className="text-blue-600 dark:text-blue-300">myModule</span>{" "}
        <span className="text-gray-500">=</span>{" "}
        <span className="text-amber-600 dark:text-yellow-300">defineModule</span>
        <span className="text-gray-800 dark:text-gray-300">({"{"}</span>
      </p>
      <p className="pl-4">
        <span className="text-gray-600 dark:text-gray-400">name:</span>{" "}
        <span className="text-green-600 dark:text-green-400">&apos;my-module&apos;</span>
        <span className="text-gray-500">,</span>
      </p>
      <p className="pl-4">
        <span className="text-gray-600 dark:text-gray-400">basePath:</span>{" "}
        <span className="text-green-600 dark:text-green-400">&apos;/my-module&apos;</span>
        <span className="text-gray-500">,</span>
      </p>
      <p className="pl-4">
        <span className="text-gray-600 dark:text-gray-400">routes:</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">[</span>
      </p>
      <p className="pl-8">
        <span className="text-gray-800 dark:text-gray-300">{"{"}</span>{" "}
        <span className="text-gray-600 dark:text-gray-400">path:</span>{" "}
        <span className="text-green-600 dark:text-green-400">&apos;/&apos;</span>
        <span className="text-gray-500">,</span>{" "}
        <span className="text-gray-600 dark:text-gray-400">component:</span>{" "}
        <span className="text-blue-600 dark:text-blue-300">DashboardPage</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">{"}"}</span>
      </p>
      <p className="pl-4">
        <span className="text-gray-800 dark:text-gray-300">]</span>
        <span className="text-gray-500">,</span>
      </p>
      <p className="pl-4">
        <span className="text-gray-600 dark:text-gray-400">apiRoutes:</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">[</span>
      </p>
      <p className="pl-8">
        <span className="text-gray-800 dark:text-gray-300">{"{"}</span>{" "}
        <span className="text-gray-600 dark:text-gray-400">path:</span>{" "}
        <span className="text-green-600 dark:text-green-400">&apos;/hello&apos;</span>
        <span className="text-gray-500">,</span>{" "}
        <span className="text-gray-600 dark:text-gray-400">handler:</span>{" "}
        <span className="text-blue-600 dark:text-blue-300">helloHandler</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">{"}"}</span>
      </p>
      <p className="pl-4">
        <span className="text-gray-800 dark:text-gray-300">]</span>
        <span className="text-gray-500">,</span>
      </p>
      <p className="pl-4">
        <span className="text-gray-600 dark:text-gray-400">middleware:</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">{"{"}</span>{" "}
        <span className="text-gray-600 dark:text-gray-400">handler:</span>{" "}
        <span className="text-blue-600 dark:text-blue-300">myMiddleware</span>{" "}
        <span className="text-gray-800 dark:text-gray-300">{"}"}</span>
      </p>
      <p>
        <span className="text-gray-800 dark:text-gray-300">{"}"})</span>
      </p>
    </>
  );
}
