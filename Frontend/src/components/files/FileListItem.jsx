import React, { useState } from 'react';
import { MoreVertical, Star, Download, Edit2, FolderInput, Trash2, Info, File as FileIcon, Image as ImageIcon, Music, Video, FileText, Archive, Eye } from 'lucide-react';
import { formatBytes } from '../../utils/formatBytes';
import { format } from 'date-fns';

const getFileIconSmall = (category, filename) => {
  if (category === 'image') return <ImageIcon size={20} className="text-blue-500" />;
  if (category === 'audio') return <Music size={20} className="text-indigo-400" />;
  if (category === 'video') return <Video size={20} className="text-red-400" />;
  if (category === 'document') return <FileText size={20} className="text-green-500" />;
  if (category === 'archive') return <Archive size={20} className="text-yellow-500" />;
  
  const ext = filename?.split('.').pop().toLowerCase();
  if (['pdf', 'xls', 'xlsx', 'csv', 'doc', 'docx'].includes(ext)) return <FileText size={20} className="text-green-500" />;
  return <FileIcon size={20} className="text-blue-400" />;
};

const FileListItem = ({ file, isSelected, onClick, onDoubleClick, onDownload, onRename, onMove, onToggleStar, onDelete, onDetails }) => {
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
      className={`relative flex items-center p-3 cursor-pointer group border-b border-gray-100 dark:border-gray-800 last:border-0 rounded-lg transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
    >
      <div className="mr-4">
        {getFileIconSmall(file.category, file.name)}
      </div>
      <span className="font-medium text-sm text-gray-700 dark:text-gray-200 flex-1 truncate group-hover:text-[#1967d2] dark:group-hover:text-blue-400 transition-colors">{file.name}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 w-32 hidden md:block">{formatBytes(file.size)}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 w-32 hidden sm:block">{file.createdAt ? format(new Date(file.createdAt), 'MMM d, yyyy') : ''}</span>
      
      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity relative">
        {file.starred && !showMenu && (
          <button onClick={(e) => { e.stopPropagation(); onToggleStar(file); }} className="p-1.5 rounded-full hover:bg-white dark:hover:bg-gray-700 text-gray-400 mr-1 transition-colors">
            <Star size={16} fill="#FCD34D" color="#FCD34D" />
          </button>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1.5 rounded-full hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
        >
          <MoreVertical size={16} />
        </button>

        {showMenu && (
          <div className="absolute top-8 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200">
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
      </div>
    </div>
  );
};

export default FileListItem;
