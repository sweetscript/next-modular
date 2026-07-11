"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ModuleReadme({ content }: { content: string }) {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-teal-600 dark:prose-a:text-teal-400">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-200 dark:border-neutral-700">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-neutral-800">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="text-left p-2.5 border border-gray-200 dark:border-neutral-700 font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2.5 border border-gray-200 dark:border-neutral-700">
              {children}
            </td>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-900 dark:bg-neutral-950 text-gray-100 border border-gray-200 dark:border-neutral-800 rounded-lg overflow-x-auto p-4 text-sm">
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.startsWith("language-");
            if (isBlock) {
              return (
                <code className={`${className} text-gray-100`} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm text-gray-800 dark:text-gray-200" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
