import React, { useEffect, useState, useRef } from 'react';
import { Home, Folder, Clock, Star, Trash2, HardDrive, Upload, FolderPlus, X, FileText, Archive, Settings } from 'lucide-react';
import { useFiles } from '../../context/FileContext';
import { formatBytes } from '../../utils/formatBytes';

const Sidebar = () => {
  const { storageStats, fetchStorageStats, createFolder, uploadFile, currentFolderId, currentView, changeView } = useFiles();
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  useEffect(() => {
    if (storageStats.used === 0) {
      fetchStorageStats();
    }
  }, [fetchStorageStats, storageStats.used]);

  const navItems = [
    { name: 'My Drive', view: 'drive', icon: <Folder size={20} /> },
    { name: 'Home', view: 'home', icon: <Home size={20} /> },
    { name: 'Documents', view: 'document', icon: <FileText size={20} /> },
    { name: 'Archives', view: 'archive', icon: <Archive size={20} /> },
    { name: 'Starred', view: 'starred', icon: <Star size={20} /> },
    { name: 'Recent', view: 'recent', icon: <Clock size={20} /> },
    { name: 'Trash', view: 'trash', icon: <Trash2 size={20} /> },
    { name: 'Settings', view: 'settings', icon: <Settings size={20} /> },
  ];

  const storagePercentage = Math.min(100, Math.max(0, (storageStats.used / storageStats.limit) * 100));

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
    // Reset file input so same files can be selected again
    e.target.value = null;
  };

  return (
    <>
      <div className="w-64 bg-[#1967d2] dark:bg-gray-900 text-white flex flex-col h-full rounded-tr-[40px] rounded-br-[40px] shadow-lg z-20 relative transition-colors">
        <div className="p-6 pb-2 flex items-center space-x-3">
          <svg width="32" height="32" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
            <path d="M58.3 78L87.3 27.5L58.3 27.5L29.1 78L58.3 78Z" fill="#FFC107"/>
            <path d="M29.1 78L0 27.5L29.1 27.5L58.3 78L29.1 78Z" fill="#1976D2"/>
            <path d="M87.3 27.5L72.8 0L14.6 0L29.1 27.5L87.3 27.5Z" fill="#4CAF50"/>
          </svg>
          <span className="text-xl font-medium tracking-wide">Telegram Drive</span>
        </div>

        <div className="px-4 py-4 relative">
          <button 
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-full px-5 py-3 flex items-center space-x-3 shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
          >
            <div className="w-6 h-6 flex justify-center items-center">
              <svg width="24" height="24" viewBox="0 0 36 36"><path fill="#34A853" d="M16 16v14h4V20z"></path><path fill="#4285F4" d="M30 16H20l-4 4h14z"></path><path fill="#FBBC05" d="M6 16v4h10l4-4z"></path><path fill="#EA4335" d="M20 16V6h-4v14z"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
            </div>
            <span>New</span>
          </button>

          {/* Dropdown Menu */}
          {isNewMenuOpen && (
            <div className="absolute top-[70px] left-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-56 py-2 text-gray-800 dark:text-gray-100 z-50 border border-transparent dark:border-gray-700">
              <button 
                onClick={() => { setIsFolderModalOpen(true); setIsNewMenuOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 text-sm"
              >
                <FolderPlus size={18} className="text-gray-500 dark:text-gray-400" />
                <span>New folder</span>
              </button>
              
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
              
              <button 
                onClick={() => fileInputRef.current.click()}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 text-sm"
              >
                <Upload size={18} className="text-gray-500 dark:text-gray-400" />
                <span>File upload</span>
              </button>

              <button 
                onClick={() => folderInputRef.current.click()}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 text-sm"
              >
                <FolderPlus size={18} className="text-gray-500 dark:text-gray-400" />
                <span>Folder upload</span>
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

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => changeView(item.view)}
              className={`w-full flex items-center space-x-4 px-4 py-2.5 rounded-full transition-colors duration-200 ${
                currentView === item.view
                  ? 'bg-white/20 font-medium' 
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="opacity-90">{item.icon}</div>
              <span className="text-[15px]">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 pb-8">
          <div className="flex items-center space-x-3 mb-3 text-sm opacity-90">
            <HardDrive size={20} />
            <span>Storage</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-1.5 mb-2">
            <div className="bg-white h-1.5 rounded-full transition-all duration-500" style={{ width: `${storagePercentage}%` }}></div>
          </div>
          <div className="text-xs text-white/80 mb-4">
            {formatBytes(storageStats.used)} Used
          </div>
        </div>
      </div>

      {/* New Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[350px] overflow-hidden border border-transparent dark:border-gray-700">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">New folder</h3>
                <button onClick={() => setIsFolderModalOpen(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateFolder}>
                <input
                  type="text"
                  autoFocus
                  className="w-full bg-white dark:bg-gray-700 border border-blue-500 dark:border-blue-400 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
                  placeholder="Untitled folder"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <div className="flex justify-end mt-6 space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setIsFolderModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={!newFolderName.trim()}
                    className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
