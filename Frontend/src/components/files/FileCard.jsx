import React, { useState } from 'react';
import { MoreVertical, Star, Download, Edit2, FolderInput, Trash2, Info, File as FileIcon, Image as ImageIcon, Music, Video, FileText, Archive, Eye } from 'lucide-react';
import { formatBytes } from '../../utils/formatBytes';
import { format } from 'date-fns';

const getFileIcon = (category, filename) => {
  if (category === 'image') return <div className="bg-blue-500 text-white rounded-lg p-3 inline-block shadow-sm"><ImageIcon size={32} /></div>;
  if (category === 'audio') return <div className="bg-indigo-400 text-white rounded-lg p-3 inline-block shadow-sm"><Music size={32} /></div>;
  if (category === 'video') return <div className="bg-red-400 text-white rounded-lg p-3 inline-block shadow-sm"><Video size={32} /></div>;
  if (category === 'document') return <div className="bg-green-500 text-white rounded-lg p-3 inline-block shadow-sm"><FileText size={32} /></div>;
  if (category === 'archive') return <div className="bg-yellow-500 text-white rounded-lg p-3 inline-block shadow-sm"><Archive size={32} /></div>;
  
  // Fallback
  const ext = filename?.split('.').pop().toLowerCase();
  if (['pdf', 'xls', 'xlsx', 'csv', 'doc', 'docx'].includes(ext)) return <div className="bg-green-500 text-white rounded-lg p-3 inline-block shadow-sm"><FileText size={32} /></div>;
  
  return <div className="bg-blue-400 text-white rounded-lg p-3 inline-block shadow-sm"><FileIcon size={32} /></div>;
};

const FileCard = ({ file, isSelected, onClick, onDoubleClick, onDownload, onRename, onMove, onToggleStar, onDelete, onDetails }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e, action) => {
    e.stopPropagation();
    setShowMenu(false);
    if(action) action(file);
  };

  return (
    <div 
      onClick={() => onClick(file)}
      onDoubleClick={() => {
        const previewable = ['image', 'video', 'audio', 'document'];
        if (onDoubleClick && previewable.includes(file.category)) {
          onDoubleClick(file);
        }
      }}
      className={`relative flex flex-col items-center w-36 cursor-pointer group rounded-xl transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex space-x-1">
        {file.starred ? (
           <button onClick={(e) => { e.stopPropagation(); onToggleStar(file); }} className="p-1 rounded-full hover:bg-white/80 dark:hover:bg-gray-700">
             <Star size={16} fill="#FCD34D" color="#FCD34D" />
           </button>
        ) : null}
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1 rounded-full hover:bg-white/80 dark:hover:bg-gray-700"
        >
          <MoreVertical size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {showMenu && (
        <div className="absolute top-8 right-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          {(file.category === 'image' || file.category === 'video' || file.category === 'audio') && (
            <button onClick={(e) => handleMenuClick(e, onDoubleClick)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><Eye size={14} className="mr-2" /> View</button>
          )}
          <button onClick={(e) => handleMenuClick(e, onDownload)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><Download size={14} className="mr-2" /> Download</button>
          <button onClick={(e) => handleMenuClick(e, onRename)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><Edit2 size={14} className="mr-2" /> Rename</button>
          <button onClick={(e) => handleMenuClick(e, onMove)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><FolderInput size={14} className="mr-2" /> Move</button>
          <button onClick={(e) => handleMenuClick(e, onToggleStar)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><Star size={14} className="mr-2" /> {file.starred ? 'Unstar' : 'Star'}</button>
          <button onClick={(e) => handleMenuClick(e, onDelete)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400"><Trash2 size={14} className="mr-2" /> Delete</button>
          <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
          <button onClick={(e) => handleMenuClick(e, onDetails)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"><Info size={14} className="mr-2" /> Details</button>
        </div>
      )}

      {/* Padding */}
      <div className="p-3 w-full flex flex-col items-center">
        <div className="mb-3 transform group-hover:scale-105 transition-transform mt-2 relative">
          {getFileIcon(file.category, file.name)}
          {file.starred && !showMenu && (
             <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm group-hover:hidden">
               <Star size={12} fill="#FCD34D" color="#FCD34D" />
             </div>
          )}
        </div>
        <span className="font-medium text-sm text-gray-700 dark:text-gray-200 truncate w-full text-center mb-1" title={file.name}>{file.name}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{formatBytes(file.size)}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{file.createdAt ? format(new Date(file.createdAt), 'MMM d, yyyy') : ''}</span>
      </div>
    </div>
  );
};

export default FileCard;
