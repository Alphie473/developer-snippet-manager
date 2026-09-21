interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'snippets', label: 'Snippets' },
    { id: 'resources', label: 'Resources' },
    { id: 'favorites', label: 'Favorites' },
  ];

  return (
    <>
      {/* Dark overlay on mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white p-4 space-y-1 transform transition-transform duration-300 md:static md:min-h-[calc(100vh-73px)] md:translate-x-0 md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button - mobile only */}
        <div className="flex justify-end md:hidden mb-2">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onClose();
              }}
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
    </>
  );
}