import React, { useState, useEffect } from 'react';
import { 
  Search, 
  LogOut, 
  Settings as SettingsIcon, 
  SlidersHorizontal, 
  Menu, 
  Send, 
  X,
  User,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFiles } from '../../context/FileContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { fetchContent, currentView, currentFolderId } = useFiles();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchContent(currentView === 'drive' ? currentFolderId : null, searchQuery, currentView);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentView, currentFolderId, fetchContent]);

  const viewNameMap = {
    drive: 'My Drive',
    home: 'Home',
    document: 'Documents',
    archive: 'Archives',
    starred: 'Starred',
    recent: 'Recent',
    trash: 'Trash',
    settings: 'Settings'
  };

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between 
      bg-white/80 dark:bg-[#0c1017]/80 backdrop-blur-xl 
      border-b border-slate-200/80 dark:border-white/5 
      sticky top-0 z-30 transition-colors"
    >
      {/* Left: Mobile Toggle & Context */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        {/* Telegram active status indicator */}
        <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-sky-500/10 dark:bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Telegram Connected</span>
        </div>
      </div>

      {/* Center: Full-width search bar */}
      <div className="flex-1 max-w-xl mx-3 md:mx-6">
        <div className="relative flex items-center group">
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-sky-500 transition-colors">
            <Search size={17} />
          </div>
          <input
            type="text"
            placeholder={`Search ${viewNameMap[currentView] || 'files'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/70 dark:bg-slate-800/50 
              border border-transparent dark:border-white/5 
              focus:border-sky-500/50 dark:focus:border-sky-500/50 
              focus:bg-white dark:focus:bg-slate-900/90 
              focus:ring-2 focus:ring-sky-500/20 
              rounded-xl py-2 pl-10 pr-10 text-sm 
              text-slate-800 dark:text-slate-100 
              placeholder-slate-400 dark:placeholder-slate-500 
              outline-none transition-all duration-200"
          />
          {searchQuery ? (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={15} />
            </button>
          ) : (
            <div className="hidden md:flex absolute right-3 items-center pointer-events-none">
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 border border-slate-300/40 dark:border-slate-600/40">
                ⌘K
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions, Theme, and Profile */}
      <div className="flex items-center space-x-2">
        <ThemeToggle />

        {user && (
          <div className="relative ml-1">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/30" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                  {user.firstName?.charAt(0).toUpperCase() || <User size={14} />}
                </div>
              )}
              <ChevronDown size={14} className="text-slate-400 hidden sm:block mr-1" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute top-11 right-0 w-56 
                  bg-white dark:bg-[#161b22] 
                  border border-slate-200 dark:border-white/10 
                  rounded-2xl shadow-xl shadow-black/15 py-1.5 z-50 
                  animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                      {user.firstName}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  <Link 
                    to="/settings" 
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400 flex items-center space-x-2.5 transition-colors"
                  >
                    <SettingsIcon size={15} />
                    <span>Account Settings</span>
                  </Link>

                  <div className="h-px bg-slate-100 dark:bg-white/5 my-1"></div>

                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2.5 transition-colors"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
