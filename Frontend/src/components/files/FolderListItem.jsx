import React, { useState } from 'react';
import { MoreVertical, Folder as FolderIcon, Edit2, FolderInput, Trash2, Info, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';

const folderColors = ['#1967d2', '#34A853', '#FBBC05', '#EA4335', '#2AABEE'];

const FolderListItem = ({ folder, index, isSelected, onClick, onDoubleClick, onRename, onMove, onDelete, onDetails }) => {
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
      className={`relative flex items-center p-3 cursor-pointer group border-b border-gray-100 dark:border-gray-800 last:border-0 rounded-lg transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
    >
      <FolderIcon size={24} className="mr-4 group-hover:opacity-80 transition-opacity" fill={folderColors[index % folderColors.length]} color={folderColors[index % folderColors.length]} />
      <span className="font-medium text-gray-700 dark:text-gray-200 flex-1 group-hover:text-[#1967d2] dark:group-hover:text-blue-400 transition-colors">{folder.name}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 w-32 hidden md:block">-</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 w-32 hidden sm:block">{folder.createdAt ? format(new Date(folder.createdAt), 'MMM d, yyyy') : ''}</span>
      
      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity relative">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1.5 rounded-full hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
        >
          <MoreVertical size={16} />
        </button>

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
      </div>
    </div>
  );
};

export default FolderListItem;
