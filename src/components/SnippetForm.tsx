import { useState, type FormEvent } from 'react';

export interface NewSnippetData {
  title: string;
  language: string;
  tags: string[];
  code: string;
}

interface SnippetFormProps {
  onAddSnippet: (snippet: NewSnippetData) => void;
  onCancel: () => void;
}

export default function SnippetForm({ onAddSnippet, onCancel }: SnippetFormProps) {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [tagsInput, setTagsInput] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !code.trim()) return;

    // Split comma-separated tags into a clean array
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddSnippet({
      title,
      language,
      tags: parsedTags,
      code,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4 max-w-xl"
    >
      <h3 className="font-semibold text-gray-900 text-lg">Add New Snippet</h3>

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Array Reducer"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Language */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none bg-white"
        >
          <option value="JavaScript">JavaScript</option>
          <option value="React">React</option>
          <option value="CSS">CSS</option>
          <option value="Node.js">Node.js</option>
          <option value="SQL">SQL</option>
          <option value="Python">Python</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Hooks, ES6, Functional"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Code */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Code</label>
        <textarea
          required
          rows={4}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste snippet here..."
          className="w-full rounded-md border border-gray-300 p-2 font-mono text-xs focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Save Snippet
        </button>
      </div>
    </form>
  );
}