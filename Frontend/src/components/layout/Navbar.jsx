import React from 'react';
import { Search, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-20 border-b border-[#2A2A2A] bg-[#1A1A1A]/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="max-w-xl w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search files and folders..."
            className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#2AABEE] transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 bg-[#2A2A2A] py-1.5 px-3 rounded-full">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#2AABEE] flex items-center justify-center text-sm font-bold">
                {user.firstName?.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium pr-2">{user.firstName}</span>
            <button onClick={logout} className="text-gray-400 hover:text-white transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
