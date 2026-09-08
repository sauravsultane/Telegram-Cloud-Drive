import React, { useState } from 'react';
import { MoreVertical, Folder as FolderIcon, Edit2, FolderInput, Trash2, Info, FolderOpen } from 'lucide-react';

const folderGradientColors = [
  'from-sky-500 to-blue-600',
  'from-indigo-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
];

const FolderCard = ({ folder, index, isSelected, onClick, onDoubleClick, onRename, onMove, onDelete, onDetails }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e, action) => {
    e.stopPropagation();
    setShowMenu(false);
    if(action) action(folder);
  };

  const gradient = folderGradientColors[index % folderGradientColors.length];

  return (
    <div 
      onClick={() => onClick({ type: 'folder', ...folder })}
      onDoubleClick={() => onDoubleClick && onDoubleClick(folder)}
      className={`relative flex flex-col items-center w-40 p-4 cursor-pointer group rounded-2xl transition-all duration-200 border ${
        isSelected 
          ? 'bg-sky-500/10 dark:bg-sky-500/15 border-sky-500/50 shadow-sm' 
          : 'bg-white/70 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/5 hover:border-sky-500/30 hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-md'
      }`}
    >
      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex space-x-1">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
          <div className="absolute top-9 right-2 w-44 bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-xl rounded-xl shadow-xl py-1.5 z-50 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95">
            <button onClick={(e) => handleMenuClick(e, onDoubleClick)} className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center"><FolderOpen size={13} className="mr-2 text-sky-500" /> Open</button>
            <button onClick={(e) => handleMenuClick(e, onRename)} className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center"><Edit2 size={13} className="mr-2 text-blue-500" /> Rename</button>
            <button onClick={(e) => handleMenuClick(e, onMove)} className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center"><FolderInput size={13} className="mr-2 text-indigo-500" /> Move</button>
            <div className="border-t border-slate-100 dark:border-white/5 my-1"></div>
            <button onClick={(e) => handleMenuClick(e, onDelete)} className="w-full text-left px-3.5 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center text-rose-600 dark:text-rose-400"><Trash2 size={13} className="mr-2" /> Delete</button>
            <button onClick={(e) => handleMenuClick(e, onDetails)} className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center text-slate-500"><Info size={13} className="mr-2" /> Details</button>
          </div>
        </>
      )}

      {/* Folder Icon badge */}
      <div className="mt-2 mb-3 relative group-hover:scale-105 transition-transform duration-200">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center shadow-md shadow-sky-500/15 text-white`}>
          <FolderIcon size={28} className="fill-white/80" />
        </div>
      </div>

      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate w-full text-center" title={folder.name}>
        {folder.name}
      </span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
        Folder
      </span>
    </div>
  );
};

export default FolderCard;
