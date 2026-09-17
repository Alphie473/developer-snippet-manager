interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export default function Sidebar({ currentTab, onSelectTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'snippets', label: 'Snippets' },
    { id: 'resources', label: 'Resources' },
    { id: 'favorites', label: 'Favorites' },
  ];

  return (
    <aside className="w-64 min-h-[calc(100vh-73px)] border-r border-gray-200 bg-white p-4 space-y-1">
      {navItems.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
              isActive
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </aside>
  );
}