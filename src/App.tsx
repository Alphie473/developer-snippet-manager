import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SnippetCard from './components/SnippetCard';
import SnippetForm, { type NewSnippetData } from './components/SnippetForm';

const API_BASE = 'https://developer-snippet-manager.onrender.com/api/snippets';

interface Snippet {
  id: number;
  title: string;
  language: string;
  tags: string[];
  code: string;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('snippets');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch snippets from MySQL
  useEffect(() => {
    fetch(API_BASE)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setSnippets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  const handleAddSnippet = async (newSnippet: NewSnippetData) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSnippet),
      });
      const savedSnippet = await res.json();
      setSnippets((prev) => [savedSnippet, ...prev]);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to create snippet:', err);
    }
  };

  const handleDeleteSnippet = async (id: number) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      setSnippets((prev) => prev.filter((s) => s.id !== id));
      setFavorites((prev) => prev.filter((favId) => favId !== id));
    } catch (err) {
      console.error('Failed to delete snippet:', err);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const filteredSnippets = (items: Snippet[]) =>
    items.filter((snippet) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        snippet.title?.toLowerCase().includes(query) ||
        snippet.language?.toLowerCase().includes(query) ||
        snippet.tags?.some((t) => t.toLowerCase().includes(query))
      );
    });

  // Calculate languages for Dashboard
  const languageCounts = snippets.reduce((acc, snippet) => {
    acc[snippet.language] = (acc[snippet.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header onMenuClick={() => setIsMenuOpen(true)} />
      <div className="flex">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        <main className="flex-1 p-6 space-y-6">
          {/* DASHBOARD TAB */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-500 font-medium">Total Snippets</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{snippets.length}</p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-500 font-medium">Favorites</p>
                  <p className="text-3xl font-bold text-amber-500 mt-2">{favorites.length}</p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-500 font-medium">Languages Tracked</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">
                    {Object.keys(languageCounts).length}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Snippets by Language</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(languageCounts).map(([lang, count]) => (
                    <span
                      key={lang}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      {lang}: {count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SNIPPETS TAB */}
          {currentTab === 'snippets' && (
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="max-w-md flex-1">
                  <input
                    type="text"
                    placeholder="Search snippets by title, language, or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition cursor-pointer"
                >
                  {isFormOpen ? '✕ Close Form' : '+ New Snippet'}
                </button>
              </div>

              {isFormOpen && (
                <SnippetForm
                  onAddSnippet={handleAddSnippet}
                  onCancel={() => setIsFormOpen(false)}
                />
              )}

              {loading ? (
                <p className="text-gray-500 text-sm">Connecting to database...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSnippets(snippets).map((snippet) => (
                    <div key={snippet.id} className="relative group">
                      <SnippetCard
                        title={snippet.title}
                        language={snippet.language}
                        tags={snippet.tags}
                        code={snippet.code}
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(snippet.id)}
                          className="text-lg cursor-pointer"
                          title="Toggle favorite"
                        >
                          {favorites.includes(snippet.id) ? '★' : '☆'}
                        </button>
                        <button
                          onClick={() => handleDeleteSnippet(snippet.id)}
                          className="text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* RESOURCES TAB */}
          {currentTab === 'resources' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Developer Docs & Reference</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', desc: 'Standard JavaScript, HTML, and CSS documentation' },
                  { name: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs', desc: 'Utility-first CSS framework references' },
                  { name: 'React Documentation', url: 'https://react.dev', desc: 'Hooks, components, and state architecture' },
                  { name: 'MySQL 8.0 Reference', url: 'https://dev.mysql.com/doc/', desc: 'SQL schema, queries, and index commands' }
                ].map((res) => (
                  <a
                    key={res.name}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition shadow-sm"
                  >
                    <p className="font-semibold text-blue-600">{res.name} ↗</p>
                    <p className="text-xs text-gray-500 mt-1">{res.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* FAVORITES TAB */}
          {currentTab === 'favorites' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Starred Snippets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {snippets.filter((s) => favorites.includes(s.id)).length > 0 ? (
                  snippets
                    .filter((s) => favorites.includes(s.id))
                    .map((snippet) => (
                      <div key={snippet.id} className="relative group">
                        <SnippetCard
                          title={snippet.title}
                          language={snippet.language}
                          tags={snippet.tags}
                          code={snippet.code}
                        />
                        <button
                          onClick={() => toggleFavorite(snippet.id)}
                          className="absolute top-2 right-2 text-lg text-amber-500 cursor-pointer"
                        >
                          ★
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No favorites yet. Click the ☆ on any snippet to save it here.
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}