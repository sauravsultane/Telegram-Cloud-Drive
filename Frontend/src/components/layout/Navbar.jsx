import React, { useState, useEffect } from 'react';
import { Search, LogOut, Settings, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFiles } from '../../context/FileContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { fetchContent, currentView, currentFolderId } = useFiles();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchContent(currentView === 'drive' ? currentFolderId : null, searchQuery, currentView);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentView, currentFolderId, fetchContent]);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 flex items-center justify-between px-4 mt-2 transition-colors">
      <div className="flex-1 max-w-[720px] ml-4">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-gray-500 dark:text-gray-400">
            <Search size={22} />
          </div>
          <input
            type="text"
            placeholder={`Search in ${currentView}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f1f3f4] dark:bg-gray-800 border border-transparent rounded-full py-3 pl-12 pr-12 text-[16px] text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-white dark:focus:border-gray-600 focus:shadow-md transition-all"
          />
          <div className="absolute right-4 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
            <SlidersHorizontal size={20} />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1 pl-4">
        <ThemeToggle />
        <div className="w-2"></div>
        
        {user && (
          <div className="ml-2 pl-2 flex items-center group cursor-pointer relative">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full border border-gray-200" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#1967d2] flex items-center justify-center text-white text-sm font-medium">
                {user.firstName?.charAt(0)}
              </div>
            )}
            
              <div className="absolute top-10 right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 text-center">
                  <p className="font-medium text-gray-800 dark:text-white">{user.firstName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                
                <Link to="/settings" className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 border-b border-gray-100 dark:border-gray-700">
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>

                <button 
                  onClick={logout} 
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 rounded-b-lg"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
