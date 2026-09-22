import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 sm:px-6 flex items-center gap-4 transition-colors">
      {/* Hamburger button - mobile only */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer"
        aria-label="Open menu"
      >
        ☰
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">DevVault</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Your developer knowledge library.</p>
      </div>

      {/* Theme Toggle Component placed and used here */}
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}