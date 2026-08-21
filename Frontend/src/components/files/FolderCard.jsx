import React, { useState } from 'react';
import { MoreVertical, Folder as FolderIcon, Edit2, FolderInput, Trash2, Info, FolderOpen } from 'lucide-react';

const folderColors = ['#1967d2', '#34A853', '#FBBC05', '#EA4335', '#2AABEE'];

const FolderCard = ({ folder, index, isSelected, onClick, onDoubleClick, onRename, onMove, onDelete, onDetails }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e, action) => {
    e.stopPropagation();
    setShowMenu(false);
    if(action) action(folder);
  };

  return (
    <div 
      onClick={() => onClick({ type: 'folder', ...folder })}
      onDoubleClick={() => onDoubleClick && onDoubleClick(folder)}
      className={`relative flex flex-col items-center w-32 cursor-pointer group transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 rounded-xl p-2' : 'p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
    >
      <div className="absolute top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex space-x-1">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1 rounded-full hover:bg-white/80 dark:hover:bg-gray-700"
        >
          <MoreVertical size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {showMenu && (
        <div className="absolute top-8 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          <button onClick={(e) => handleMenuClick(e, onDoubleClick)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><FolderOpen size={14} className="mr-2" /> Open</button>
          <button onClick={(e) => handleMenuClick(e, onRename)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><Edit2 size={14} className="mr-2" /> Rename</button>
          <button onClick={(e) => handleMenuClick(e, onMove)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><FolderInput size={14} className="mr-2" /> Move</button>
          <button onClick={(e) => handleMenuClick(e, onDelete)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400"><Trash2 size={14} className="mr-2" /> Delete</button>
          <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
          <button onClick={(e) => handleMenuClick(e, onDetails)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><Info size={14} className="mr-2" /> Details</button>
        </div>
      )}

      <FolderIcon size={80} className="mb-2 group-hover:opacity-80 transition-opacity" fill={folderColors[index % folderColors.length]} color={folderColors[index % folderColors.length]} />
      <span className="font-medium text-gray-700 dark:text-gray-200 truncate w-full text-center group-hover:text-[#1967d2] dark:group-hover:text-blue-400 transition-colors">{folder.name}</span>
      <span className="text-xs text-gray-400 mt-0.5">Double-click to open</span>
    </div>
  );
};

export default FolderCard;
