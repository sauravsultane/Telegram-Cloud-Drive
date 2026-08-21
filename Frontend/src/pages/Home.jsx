import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFiles } from '../context/FileContext';
import { UploadCloud, Folder as FolderIcon, File as FileIcon, ChevronDown, ArrowUp, ArrowDown, LayoutGrid, List } from 'lucide-react';
import { formatBytes } from '../utils/formatBytes';
import { format } from 'date-fns';
import FileGrid from '../components/files/FileGrid';
import EmptyState from '../components/files/EmptyState';
import FilePreviewModal from '../components/files/FilePreviewModal';
import Settings from './Settings';

const Home = () => {
  const { files, folders, currentFolderId, folderPath, currentView, loading, fetchContent, uploadFile, toggleStar, deleteFile, navigateToFolder, navigateBack } = useFiles();
  const [selectedItem, setSelectedItem] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');      // all | document | image | video | audio | archive
  const [sortBy, setSortBy] = useState('date');             // date | size | name
  const [sortOrder, setSortOrder] = useState('desc');       // asc | desc
  const [openDropdown, setOpenDropdown] = useState(null);   // 'type' | 'sort' | 'order' | null
  const [viewLayout, setViewLayout] = useState('list');     // 'grid' | 'list'

  useEffect(() => {
    fetchContent(currentFolderId, '', currentView);
  }, [currentFolderId, currentView, fetchContent]);

  const onDrop = useCallback(acceptedFiles => {
    if (currentView !== 'drive' && currentView !== 'home') return; // Maybe restrict drops to drive/home
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

  // Close dropdown when clicking outside
  const filterRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setOpenDropdown(null); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Apply type filter and sorting to the files list
  const processedFiles = React.useMemo(() => {
    let result = [...files];
    // Type filter
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
    // Sort
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

  const FilterDropdown = ({ id, label, options, value, onChange }) => (
    <div className="relative">
      <button
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
        className={`border rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1.5 transition-colors ${
          value !== options[0].value
            ? 'border-[#1967d2] text-[#1967d2] bg-[#e8f0fe]'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span>{options.find(o => o.value === value)?.label || label}</span>
        <ChevronDown size={14} />
      </button>
      {openDropdown === id && (
        <div className="absolute top-9 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 z-50 min-w-[140px]">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpenDropdown(null); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                value === opt.value ? 'text-[#1967d2] font-medium bg-[#e8f0fe] dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (currentView === 'settings') {
    return <Settings />;
  }

  return (
    <div {...getRootProps()} className="min-h-full flex relative outline-none w-full bg-white dark:bg-gray-900 rounded-tl-3xl rounded-bl-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition-colors">
      <input {...getInputProps()} />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all ${selectedItem ? 'mr-80' : ''}`}>
        {isDragActive && (
          <div className="absolute inset-0 bg-[#1967d2]/5 border-2 border-dashed border-[#1967d2] z-40 rounded-3xl flex items-center justify-center backdrop-blur-[2px] transition-all">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl flex flex-col items-center shadow-xl border border-gray-200 dark:border-gray-700">
              <UploadCloud size={48} className="text-[#1967d2] mb-4 animate-bounce" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Drop files to upload</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Files will be securely saved to Telegram</p>
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center space-x-2 text-gray-800 dark:text-gray-100">
          <h1 className="text-2xl font-normal">{getViewTitle()}</h1>
          {currentView === 'drive' && <ChevronDown size={20} className="text-gray-500 dark:text-gray-400 mt-1 cursor-pointer" />}
        </div>

        <div ref={filterRef} className="px-6 py-3 flex items-center gap-2 flex-wrap">
          <FilterDropdown
            id="type"
            label="Type"
            options={TYPE_OPTIONS}
            value={typeFilter}
            onChange={setTypeFilter}
          />
          <FilterDropdown
            id="sort"
            label="Sort by"
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
          />
          {/* Asc / Desc toggle */}
          <button
            onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
            className="border border-gray-300 dark:border-gray-600 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5 transition-colors"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
          {/* Active filter chips */}
          {(typeFilter !== 'all' || sortBy !== 'date' || sortOrder !== 'desc') && (
            <button
              onClick={() => { setTypeFilter('all'); setSortBy('date'); setSortOrder('desc'); }}
              className="text-xs text-gray-400 hover:text-red-500 underline ml-1 transition-colors"
            >
              Reset
            </button>
          )}

          <div className="flex-1"></div>
          
          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded-md transition-colors ${viewLayout === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewLayout === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#1967d2] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {currentView === 'home' && (
                <div className="px-6 mb-6">
                  <h2 className="text-[#1967d2] font-medium mb-4">Suggested</h2>
                  {/* Dashboard like summary could go here */}
                </div>
              )}

              {/* Breadcrumb — only show when inside a sub-folder in drive view */}
              {currentView === 'drive' && folderPath.length > 0 && (
                <div className="px-6 mb-4 flex items-center gap-1.5 text-sm flex-wrap">
                  <button
                    onClick={() => navigateBack(-1)}
                    className="text-[#1967d2] hover:underline font-medium"
                  >
                    My Drive
                  </button>
                  {folderPath.map((crumb, idx) => (
                    <span key={crumb._id} className="flex items-center gap-1.5">
                      <span className="text-gray-400 dark:text-gray-600">/</span>
                      {idx === folderPath.length - 1 ? (
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{crumb.name}</span>
                      ) : (
                        <button
                          onClick={() => navigateBack(idx)}
                          className="text-[#1967d2] hover:underline"
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
                  message={`No items in ${getViewTitle()}`} 
                  subMessage={currentView === 'drive' ? "Drag and drop files here to upload" : ""}
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

      {/* Right Sidebar Details Pane */}
      {selectedItem && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.05)] z-20 transition-colors">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-100">
              {selectedItem.type === 'folder' ? (
                <FolderIcon fill="#1967d2" color="#1967d2" size={24} />
              ) : (
                <FileIcon className="text-blue-500" size={24} />
              )}
              <h3 className="font-medium truncate w-48" title={selectedItem.name}>{selectedItem.name}</h3>
            </div>
            <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button className="flex-1 py-3 text-sm font-medium text-[#1967d2] border-b-2 border-[#1967d2]">Details</button>
            <button className="flex-1 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50">Activity</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{selectedItem.type === 'folder' ? 'Folder Properties' : 'File Properties'}</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Type</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{selectedItem.type === 'folder' ? 'Folder' : 'File'}</p>
                </div>
                {selectedItem.type === 'file' && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Size</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{formatBytes(selectedItem.size)}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Location</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{currentView}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Modified</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{selectedItem.updatedAt ? format(new Date(selectedItem.updatedAt), 'MMM d, yyyy') : 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Created</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{selectedItem.createdAt ? format(new Date(selectedItem.createdAt), 'MMM d, yyyy') : 'Unknown'}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">Description</p>
              <div className="text-sm text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                Add a description
              </div>
            </div>
          </div>
        </div>
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
