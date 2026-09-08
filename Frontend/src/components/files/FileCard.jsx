import React, { useState } from 'react';
import { 
  MoreVertical, 
  Star, 
  Download, 
  Edit2, 
  FolderInput, 
  Trash2, 
  Info, 
  File as FileIcon, 
  Image as ImageIcon, 
  Music, 
  Video, 
  FileText, 
  Archive, 
  Eye 
} from 'lucide-react';
import { formatBytes } from '../../utils/formatBytes';
import { format } from 'date-fns';

const getFileIcon = (category, filename) => {
  if (category === 'image') return (
    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center shadow-sm">
      <ImageIcon size={24} />
    </div>
  );
  if (category === 'audio') return (
    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shadow-sm">
      <Music size={24} />
    </div>
  );
  if (category === 'video') return (
    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shadow-sm">
      <Video size={24} />
    </div>
  );
  if (category === 'document') return (
    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shadow-sm">
      <FileText size={24} />
    </div>
  );
  if (category === 'archive') return (
    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-sm">
      <Archive size={24} />
    </div>
  );
  
  const ext = filename?.split('.').pop().toLowerCase();
  if (['pdf', 'xls', 'xlsx', 'csv', 'doc', 'docx'].includes(ext)) return (
    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shadow-sm">
      <FileText size={24} />
    </div>
  );
  
  return (
    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center shadow-sm">
      <FileIcon size={24} />
    </div>
  );
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
      className={`relative flex flex-col items-center w-40 p-4 cursor-pointer group rounded-2xl transition-all duration-200 border ${
        isSelected 
          ? 'bg-sky-500/10 dark:bg-sky-500/15 border-sky-500/50 shadow-sm' 
          : 'bg-white/70 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/5 hover:border-sky-500/30 hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-md'
      }`}
    >
      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex space-x-1">
        {file.starred ? (
          <button onClick={(e) => { e.stopPropagation(); onToggleStar(file); }} className="p-1 rounded-lg hover:bg-white/80 dark:hover:bg-gray-700">
            <Star size={14} fill="#FBBF24" color="#FBBF24" />
          </button>
        ) : null}
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
            {(file.category === 'image' || file.category === 'video' || file.category === 'audio') && (
              <button onClick={(e) => handleMenuClick(e, onDoubleClick)} className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center"><Eye size={13} className="mr-2 text-sky-500" /> Preview</button>
            )}
            <button onClick={(e) => handleMenuClick(e, onDownload)} className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center"><Download size={13} className="mr-2 text-emerald-500" /> Download</button>
            <button onClick={(e) => handleMenuClick(e, onRename)} className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center"><Edit2 size={13} className="mr-2 text-blue-500" /> Rename</button>
            <button onClick={(e) => handleMenuClick(e, onMove)} className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center"><FolderInput size={13} className="mr-2 text-indigo-500" /> Move</button>
            <button onClick={(e) => handleMenuClick(e, onToggleStar)} className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center"><Star size={13} className="mr-2 text-amber-500" /> {file.starred ? 'Unstar' : 'Star'}</button>
            <div className="border-t border-slate-100 dark:border-white/5 my-1"></div>
            <button onClick={(e) => handleMenuClick(e, onDelete)} className="w-full text-left px-3.5 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center text-rose-600 dark:text-rose-400"><Trash2 size={13} className="mr-2" /> Delete</button>
            <button onClick={(e) => handleMenuClick(e, onDetails)} className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center text-slate-500"><Info size={13} className="mr-2" /> Details</button>
          </div>
        </>
      )}

      {/* Icon */}
      <div className="mt-2 mb-3 relative group-hover:scale-105 transition-transform duration-200">
        {getFileIcon(file.category, file.name)}
        {file.starred && !showMenu && (
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm">
            <Star size={11} fill="#FBBF24" color="#FBBF24" />
          </div>
        )}
      </div>

      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate w-full text-center" title={file.name}>
        {file.name}
      </span>
      <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
        {formatBytes(file.size)}
      </span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500">
        {file.createdAt ? format(new Date(file.createdAt), 'MMM d, yyyy') : ''}
      </span>
    </div>
  );
};

export default FileCard;
