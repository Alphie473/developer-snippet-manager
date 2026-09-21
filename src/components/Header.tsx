interface HeaderProps {
  onMenuClick: () => void;
}


export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 flex items-center gap-4">
      {/* Hamburger button - mobile only */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
        aria-label="Open menu"
      >
        ☰
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-900">DevVault</h1>
        <p className="text-xs text-gray-500">Your developer knowledge library.</p>
      </div>
    </header>
  );
}