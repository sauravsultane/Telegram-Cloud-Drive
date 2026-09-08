import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFiles } from '../context/FileContext';
import { 
  UploadCloud, 
  Folder as FolderIcon, 
  File as FileIcon, 
  ChevronDown, 
  ArrowUp, 
  ArrowDown, 
  LayoutGrid, 
  List,
  ChevronRight,
  Filter,
  RotateCcw,
  Sparkles,
  Info,
  X,
  FileText,
  Calendar,
  HardDrive
} from 'lucide-react';
import { formatBytes } from '../utils/formatBytes';
import { format } from 'date-fns';
import FileGrid from '../components/files/FileGrid';
import EmptyState from '../components/files/EmptyState';
import FilePreviewModal from '../components/files/FilePreviewModal';
import Settings from './Settings';

const FilterDropdown = ({ id, label, options, value, onChange, isOpen, onToggle }) => {
  const currentOption = options.find(o => o.value === value);
  const isFiltered = value !== options[0].value;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 border ${
          isFiltered
            ? 'bg-sky-500/10 border-sky-500/40 text-sky-600 dark:text-sky-400 shadow-sm'
            : 'bg-white/70 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/[0.08]'
        }`}
      >
        <span>{currentOption?.label || label}</span>
        <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-10 left-0 bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl shadow-black/15 py-1.5 z-50 min-w-[160px] animate-in fade-in zoom-in-95 duration-150">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); onToggle(); }}
              className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors flex items-center justify-between ${
                value === opt.value 
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 font-semibold' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span>{opt.label}</span>
              {value === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const { 
    files, 
    folders, 
    currentFolderId, 
    folderPath, 
    currentView, 
    loading, 
    fetchContent, 
    uploadFile, 
    toggleStar, 
    deleteFile, 
    navigateToFolder, 
    navigateBack 
  } = useFiles();

  const [selectedItem, setSelectedItem] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');      
  const [sortBy, setSortBy] = useState('date');             
  const [sortOrder, setSortOrder] = useState('desc');       
  const [openDropdown, setOpenDropdown] = useState(null);   
  const [viewLayout, setViewLayout] = useState('grid');     

  useEffect(() => {
    fetchContent(currentFolderId, '', currentView);
  }, [currentFolderId, currentView, fetchContent]);

  const onDrop = useCallback(acceptedFiles => {
    if (currentView !== 'drive' && currentView !== 'home') return;
    acceptedFiles.forEach(file => {
      uploadFile(file, currentView === 'drive' ? currentFolderId : null);
    });
  }, [uploadFile, currentFolderId, currentView]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  const handleDownload = (file) => {
    const token = localStorage.getItem('token');
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/files/${file._id}/download?token=${token}`;
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'drive': return 'My Drive';
      case 'home': return 'Home';
      case 'document': return 'Documents';
      case 'archive': return 'Archives';
      case 'starred': return 'Starred';
      case 'recent': return 'Recent';
      case 'trash': return 'Trash';
      case 'settings': return 'Settings';
      default: return 'My Drive';
    }
  };

  const handleRename = (file) => {
    alert(`Rename ${file.name}`);
  };

  const handleMove = (file) => {
    alert(`Move ${file.name}`);
  };

  const filterRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { 
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenDropdown(null); 
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const processedFiles = React.useMemo(() => {
    let result = [...files];
    if (typeFilter !== 'all') {
      const extMap = {
        document: ['pdf','doc','docx','txt','ppt','pptx','xls','xlsx','csv'],
        image:    ['jpg','jpeg','png','gif','webp','svg','bmp','ico'],
        video:    ['mp4','mkv','avi','mov','webm','flv','wmv'],
        audio:    ['mp3','wav','aac','ogg','flac','m4a'],
        archive:  ['zip','rar','7z','tar','gz','bz2'],
      };
      const exts = extMap[typeFilter] || [];
      result = result.filter(f => {
        if (f.category === typeFilter) return true;
        const ext = f.name.split('.').pop().toLowerCase();
        return exts.includes(ext);
      });
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date')  cmp = new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'size')  cmp = a.size - b.size;
      if (sortBy === 'name')  cmp = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [files, typeFilter, sortBy, sortOrder]);

  const TYPE_OPTIONS = [
    { value: 'all',      label: 'All Types' },
    { value: 'document', label: '📄 Documents' },
    { value: 'image',    label: '🖼️ Images' },
    { value: 'video',    label: '🎥 Videos' },
    { value: 'audio',    label: '🎵 Audio' },
    { value: 'archive',  label: '📦 Archives' },
  ];

  const SORT_OPTIONS = [
    { value: 'date', label: 'Date' },
    { value: 'size', label: 'Size' },
    { value: 'name', label: 'Name' },
  ];

  if (currentView === 'settings') {
    return <Settings />;
  }

  return (
    <div {...getRootProps()} className="w-full h-full flex relative outline-none bg-transparent">
      <input {...getInputProps()} />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${selectedItem ? 'lg:mr-84' : ''}`}>
        
        {/* Full-screen Drag Overlay */}
        {isDragActive && (
          <div className="absolute inset-0 bg-sky-950/40 border-2 border-dashed border-sky-400 z-50 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-xl p-8 rounded-3xl flex flex-col items-center shadow-2xl border border-sky-500/30 max-w-sm text-center">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mb-4 animate-bounce">
                <UploadCloud size={36} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Drop to Upload</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Files will be securely stored to your Telegram Cloud Channel
              </p>
            </div>
          </div>
        )}

        {/* View Header & Breadcrumb */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {getViewTitle()}
            </h1>
            {currentView === 'drive' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold border border-sky-500/20">
                Root
              </span>
            )}
          </div>

          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {processedFiles.length} {processedFiles.length === 1 ? 'file' : 'files'}
            {folders.length > 0 && ` • ${folders.length} ${folders.length === 1 ? 'folder' : 'folders'}`}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div ref={filterRef} className="px-6 py-3 flex items-center gap-2.5 flex-wrap border-b border-slate-200/40 dark:border-white/5 bg-white/20 dark:bg-white/[0.01]">
          <FilterDropdown
            id="type"
            label="Type"
            options={TYPE_OPTIONS}
            value={typeFilter}
            onChange={setTypeFilter}
            isOpen={openDropdown === 'type'}
            onToggle={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
          />
          <FilterDropdown
            id="sort"
            label="Sort by"
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
            isOpen={openDropdown === 'sort'}
            onToggle={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
          />

          {/* Asc / Desc toggle */}
          <button
            onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 border bg-white/70 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/[0.08]"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? <ArrowUp size={13} className="text-sky-500" /> : <ArrowDown size={13} className="text-sky-500" />}
            <span>{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
          </button>

          {/* Active filter reset chip */}
          {(typeFilter !== 'all' || sortBy !== 'date' || sortOrder !== 'desc') && (
            <button
              onClick={() => { setTypeFilter('all'); setSortBy('date'); setSortOrder('desc'); }}
              className="px-2.5 py-1 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

          <div className="flex-1"></div>
          
          {/* View Toggle (Grid / List) */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-200/70 dark:bg-white/[0.06] border border-slate-300/60 dark:border-white/5">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewLayout === 'grid' 
                  ? 'bg-white dark:bg-[#161b22] shadow-sm text-sky-500 dark:text-sky-400 font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewLayout === 'list' 
                  ? 'bg-white dark:bg-[#161b22] shadow-sm text-sky-500 dark:text-sky-400 font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24">
              <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 mt-3 font-medium">Syncing files from Telegram...</p>
            </div>
          ) : (
            <>
              {/* Breadcrumbs for nested folders */}
              {currentView === 'drive' && folderPath.length > 0 && (
                <div className="mb-5 flex items-center gap-2 text-xs font-medium flex-wrap bg-white/50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                  <button
                    onClick={() => navigateBack(-1)}
                    className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
                  >
                    My Drive
                  </button>
                  {folderPath.map((crumb, idx) => (
                    <span key={crumb._id} className="flex items-center gap-2">
                      <ChevronRight size={13} className="text-slate-400" />
                      {idx === folderPath.length - 1 ? (
                        <span className="text-slate-800 dark:text-slate-200 font-bold">{crumb.name}</span>
                      ) : (
                        <button
                          onClick={() => navigateBack(idx)}
                          className="text-sky-600 dark:text-sky-400 hover:underline"
                        >
                          {crumb.name}
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {files.length === 0 && folders.length === 0 ? (
                <EmptyState 
                  message={`No files in ${getViewTitle()}`} 
                  subMessage={currentView === 'drive' ? "Drag and drop files here or click New Upload to start" : ""}
                />
              ) : (
                <FileGrid
                  files={processedFiles}
                  folders={folders}
                  selectedItem={selectedItem}
                  viewLayout={viewLayout}
                  onSelectItem={setSelectedItem}
                  onFolderOpen={navigateToFolder}
                  onDoubleClick={handlePreview}
                  onDownload={handleDownload}
                  onRename={handleRename}
                  onMove={handleMove}
                  onToggleStar={(file) => toggleStar(file._id)}
                  onDelete={(file) => deleteFile(file._id)}
                  onDetails={(file) => setSelectedItem({ type: 'file', ...file })}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Slide-over Details Pane */}
      {selectedItem && (
        <aside className="fixed lg:absolute right-0 top-0 bottom-0 w-80 
          bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-2xl 
          border-l border-slate-200/80 dark:border-white/10 
          flex flex-col z-40 shadow-2xl transition-all duration-300 animate-in slide-in-from-right"
        >
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
                {selectedItem.type === 'folder' ? <FolderIcon size={18} /> : <FileIcon size={18} />}
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate" title={selectedItem.name}>
                {selectedItem.name}
              </h3>
            </div>
            <button 
              onClick={() => setSelectedItem(null)} 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex border-b border-slate-100 dark:border-white/5 px-4 text-xs font-semibold">
            <button className="py-2.5 text-sky-500 border-b-2 border-sky-500 mr-4">
              Properties
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
            <div className="space-y-3">
              <div>
                <span className="text-slate-400 block mb-0.5">Type</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                  {selectedItem.type === 'folder' ? 'Directory Folder' : (selectedItem.category || 'File')}
                </span>
              </div>

              {selectedItem.type === 'file' && (
                <div>
                  <span className="text-slate-400 block mb-0.5">File Size</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {formatBytes(selectedItem.size)}
                  </span>
                </div>
              )}

              <div>
                <span className="text-slate-400 block mb-0.5">Storage Backend</span>
                <span className="font-medium text-sky-500">
                  Telegram Cloud Bot API
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Modified</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedItem.updatedAt ? format(new Date(selectedItem.updatedAt), 'MMM d, yyyy • h:mm a') : 'Unknown'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Created</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedItem.createdAt ? format(new Date(selectedItem.createdAt), 'MMM d, yyyy • h:mm a') : 'Unknown'}
                </span>
              </div>
            </div>

            {selectedItem.type === 'file' && (
              <div className="pt-3 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={() => handleDownload(selectedItem)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 transition-all"
                >
                  Download File
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Preview Modal */}
      <FilePreviewModal 
        file={previewFile} 
        onClose={() => setPreviewFile(null)} 
        onDownload={handleDownload} 
      />
    </div>
  );
};

export default Home;
