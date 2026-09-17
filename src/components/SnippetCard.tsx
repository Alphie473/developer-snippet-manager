import { useState } from 'react';

export interface SnippetCardProps {
  title: string;
  language: string;
  tags?: string[];
  code: string;
}

export default function SnippetCard({
  title,
  language,
  tags = [],
  code,
}: SnippetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
            {language}
          </span>
        </div>

        <pre className="overflow-x-auto rounded bg-gray-900 p-3 text-xs font-mono text-gray-100 my-2">
          <code>{code}</code>
        </pre>
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}