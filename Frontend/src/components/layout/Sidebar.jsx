import React, { useEffect, useState, useRef } from 'react';
import { 
  Home, 
  Folder, 
  Clock, 
  Star, 
  Trash2, 
  HardDrive, 
  Upload, 
  FolderPlus, 
  X, 
  FileText, 
  Archive, 
  Settings,
  Plus,
  Cloud,
  Layers,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useFiles } from '../../context/FileContext';
import { formatBytes } from '../../utils/formatBytes';

const Sidebar = ({ isOpen = true, onClose }) => {
  const { storageStats, fetchStorageStats, createFolder, uploadFile, currentFolderId, currentView, changeView } = useFiles();
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const newMenuRef = useRef(null);

  useEffect(() => {
    if (storageStats.used === 0) {
      fetchStorageStats();
    }
  }, [fetchStorageStats, storageStats.used]);

  // Close new menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target)) {
        setIsNewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'My Drive', view: 'drive', icon: Folder, count: null },
    { name: 'Home', view: 'home', icon: Home, count: null },
    { name: 'Documents', view: 'document', icon: FileText, count: null },
    { name: 'Archives', view: 'archive', icon: Archive, count: null },
    { name: 'Starred', view: 'starred', icon: Star, count: null },
    { name: 'Recent', view: 'recent', icon: Clock, count: null },
    { name: 'Trash', view: 'trash', icon: Trash2, count: null },
    { name: 'Settings', view: 'settings', icon: Settings, count: null },
  ];



  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setIsFolderModalOpen(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach(file => {
        uploadFile(file, currentFolderId);
      });
    }
    setIsNewMenuOpen(false);
    e.target.value = null;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 flex flex-col 
          bg-slate-900/95 dark:bg-[#0c1017]/95 backdrop-blur-xl 
          border-r border-slate-800/80 dark:border-white/10 
          text-slate-200 transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header Branding */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 dark:border-white/5">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => changeView('home')}>
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200">
                {/* Telegram Paper Plane Icon */}
                <Send size={18} className="text-white transform -rotate-12 translate-x-[-1px] translate-y-[1px]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold tracking-tight text-white flex items-center gap-1.5">
                Telegram Drive
              </span>
              <span className="text-[11px] text-sky-400/90 font-medium tracking-wide uppercase">
                Cloud Storage
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Button Section */}
        <div className="p-4" ref={newMenuRef}>
          <div className="relative">
            <button 
              onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
              className="w-full h-11 px-4 rounded-xl 
                bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 
                text-white font-medium text-sm flex items-center justify-center space-x-2 
                shadow-lg shadow-sky-500/25 hover:shadow-sky-500/35 
                transition-all duration-200 active:scale-[0.98]"
            >
              <Plus size={18} className="stroke-[2.5]" />
              <span className="font-semibold tracking-wide">New Upload</span>
            </button>

            {/* Dropdown Menu */}
            {isNewMenuOpen && (
              <div className="absolute top-12 left-0 right-0 mt-1.5 
                bg-slate-800/95 dark:bg-[#161b22]/95 backdrop-blur-xl 
                border border-slate-700/80 dark:border-white/10 
                rounded-xl shadow-2xl shadow-black/50 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <button 
                  onClick={() => { setIsFolderModalOpen(true); setIsNewMenuOpen(false); }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-sky-500/20 flex items-center space-x-2.5 transition-colors"
                >
                  <FolderPlus size={16} className="text-sky-400" />
                  <span>New Folder</span>
                </button>
                
                <div className="h-px bg-slate-700/60 dark:bg-white/5 my-1"></div>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-sky-500/20 flex items-center space-x-2.5 transition-colors"
                >
                  <Upload size={16} className="text-emerald-400" />
                  <span>Upload Files</span>
                </button>

                <button 
                  onClick={() => folderInputRef.current?.click()}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-sky-500/20 flex items-center space-x-2.5 transition-colors"
                >
                  <Layers size={16} className="text-amber-400" />
                  <span>Upload Folder</span>
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple
              onChange={handleFileUpload} 
            />
            <input 
              type="file" 
              ref={folderInputRef} 
              className="hidden" 
              webkitdirectory="true"
              directory="true"
              multiple
              onChange={handleFileUpload} 
            />
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-1.5 pt-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Overview
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.name}
                onClick={() => {
                  changeView(item.view);
                  if (onClose) onClose();
                }}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/20 to-blue-500/10 text-sky-400 border border-sky-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    size={18} 
                    className={`transition-colors ${
                      isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} 
                  />
                  <span className="text-[13.5px] tracking-tight">{item.name}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Storage Footer */}
        <div className="p-4 border-t border-slate-800/80 dark:border-white/5 bg-slate-950/40">
          <div className="p-3 rounded-xl bg-slate-800/40 dark:bg-white/[0.03] border border-slate-700/50 dark:border-white/5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <HardDrive size={15} className="text-sky-400" />
                <span>Storage</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Unlimited
              </span>
            </div>

            <div className="text-sm font-bold text-white tracking-tight">
              {formatBytes(storageStats.used)} <span className="text-xs font-normal text-slate-400">used</span>
            </div>
          </div>
        </div>
      </aside>

      {/* New Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <FolderPlus size={20} />
                </div>
                <h3 className="text-base font-semibold text-white">Create New Folder</h3>
              </div>
              <button 
                onClick={() => setIsFolderModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  autoFocus
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  placeholder="e.g. Project Assets"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
