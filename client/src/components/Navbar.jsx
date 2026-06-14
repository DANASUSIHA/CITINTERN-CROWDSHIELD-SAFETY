import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, Bell, Shield } from 'lucide-react';

const Navbar = ({ toggleSidebar, title }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800/80 transition-all duration-200">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Trigger */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/60 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Dynamic page title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
          {title || 'Dashboard'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/60 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Identity Display */}
        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-slate-800">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user ? user.name : 'Guest'}
            </p>
            <p className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              {user ? user.role : ''}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
