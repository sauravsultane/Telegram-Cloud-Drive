import React, { useState } from 'react';
import { User, Palette, Folder, HardDrive, Info, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { formatBytes } from '../utils/formatBytes';

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  const [defaultView, setDefaultView] = useState(localStorage.getItem('defaultView') || 'list');

  // Dummy stats for storage
  const totalStorage = 15 * 1024 * 1024 * 1024; // 15GB
  const usedStorage = 2.4 * 1024 * 1024 * 1024; // 2.4GB

  const handleSetDefaultView = (view) => {
    setDefaultView(view);
    localStorage.setItem('defaultView', view);
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={20} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={20} /> },
    { id: 'files', label: 'Files', icon: <Folder size={20} /> },
    { id: 'about', label: 'About', icon: <Info size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Profile</h2>
              <div className="flex items-center space-x-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full border border-gray-200 dark:border-gray-600" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#1967d2] flex items-center justify-center text-white text-3xl font-medium shadow-md">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100">{user?.firstName || 'User'}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Change Password</h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full max-w-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-4 text-gray-800 dark:text-white focus:outline-none focus:border-[#1967d2] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full max-w-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 px-4 text-gray-800 dark:text-white focus:outline-none focus:border-[#1967d2] transition-colors" />
                </div>
                <button className="bg-[#1967d2] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#1557b0] transition-colors mt-2">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Dark Mode</h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Choose how the application looks to you.</p>
                <div className="flex flex-wrap gap-4">
                  {['light', 'dark', 'system'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-6 py-3 rounded-xl capitalize font-medium transition-all border-2 ${theme === t ? 'border-[#1967d2] bg-blue-50 dark:bg-blue-900/20 text-[#1967d2] dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Grid / List View</h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Set your preferred default layout for files and folders.</p>
                <div className="flex flex-wrap gap-4">
                  {['list', 'grid'].map(v => (
                    <button
                      key={v}
                      onClick={() => handleSetDefaultView(v)}
                      className={`px-6 py-3 rounded-xl capitalize font-medium transition-all border-2 ${defaultView === v ? 'border-[#1967d2] bg-blue-50 dark:bg-blue-900/20 text-[#1967d2] dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'}`}
                    >
                      {v} View
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'files':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Default Sort</h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-xl">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Order files by</label>
                <select className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-gray-800 dark:text-white focus:outline-none focus:border-[#1967d2]">
                  <option>Name (A to Z)</option>
                  <option>Name (Z to A)</option>
                  <option>Last Modified</option>
                  <option>Size (Small to Large)</option>
                  <option>Size (Large to Small)</option>
                </select>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Default Upload Location</h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-xl">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Choose where files are uploaded by default if no folder is open.</p>
                <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                  <Folder className="text-[#1967d2] dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">My Drive</span>
                </div>
              </div>
            </div>
          </div>
        );


      case 'about':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">About</h2>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl">
                
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-[#1967d2]/10 dark:bg-[#1967d2]/20 rounded-2xl flex items-center justify-center">
                    <HardDrive size={32} className="text-[#1967d2] dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Google Drive Clone</h3>
                    <p className="text-gray-500 dark:text-gray-400">Version 1.0.0 (Build 2026.08)</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Help & Support</span>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Terms of Service</span>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Privacy Policy</span>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col md:flex-row bg-[#f8f9fa] dark:bg-gray-900 transition-colors p-6 overflow-y-auto rounded-tl-3xl rounded-bl-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
      
      {/* Settings Sidebar */}
      <div className="w-full md:w-64 shrink-0 mb-8 md:mb-0 md:mr-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 pl-4">Settings</h1>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-100/50 dark:bg-blue-900/30 text-[#1967d2] dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;
