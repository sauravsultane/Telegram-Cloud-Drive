import React from 'react';
import { ArrowUp, ChevronDown } from 'lucide-react';
import FileCard from './FileCard';
import FileListItem from './FileListItem';
import FolderCard from './FolderCard';
import FolderListItem from './FolderListItem';

const FileGrid = ({ 
  files, 
  folders = [], 
  selectedItem, 
  onSelectItem, 
  onFolderOpen,
  onDoubleClick,
  onDownload, 
  onRename, 
  onMove, 
  onToggleStar, 
  onDelete, 
  onDetails,
  viewLayout = 'grid'
}) => {
  return (
    <div className="px-6 pb-6">
      {folders.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-700 dark:text-gray-200 font-medium">Folders</h3>
            <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              <ArrowUp size={16} className="mr-1" /> Name <ChevronDown size={16} className="ml-1" />
            </div>
          </div>
          {viewLayout === 'grid' ? (
            <div className="flex flex-wrap gap-6">
              {folders.map((folder, idx) => (
                <FolderCard
                  key={folder._id}
                  folder={folder}
                  index={idx}
                  isSelected={selectedItem?._id === folder._id}
                  onClick={onSelectItem}
                  onDoubleClick={onFolderOpen}
                  onRename={onRename}
                  onMove={onMove}
                  onDelete={onDelete}
                  onDetails={() => {
                    onSelectItem({ type: 'folder', ...folder });
                    if(onDetails) onDetails(folder);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {folders.map((folder, idx) => (
                <FolderListItem
                  key={folder._id}
                  folder={folder}
                  index={idx}
                  isSelected={selectedItem?._id === folder._id}
                  onClick={onSelectItem}
                  onDoubleClick={onFolderOpen}
                  onRename={onRename}
                  onMove={onMove}
                  onDelete={onDelete}
                  onDetails={() => {
                    onSelectItem({ type: 'folder', ...folder });
                    if(onDetails) onDetails(folder);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}


      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-700 dark:text-gray-200 font-medium">Files</h3>
            <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              <ArrowUp size={16} className="mr-1" /> Type <ChevronDown size={16} className="ml-1" />
            </div>
          </div>
          {viewLayout === 'grid' ? (
            <div className="flex flex-wrap gap-4">
              {files.map(file => (
                <FileCard
                  key={file._id}
                  file={file}
                  isSelected={selectedItem?._id === file._id}
                  onClick={() => onSelectItem({ type: 'file', ...file })}
                  onDoubleClick={onDoubleClick}
                  onDownload={onDownload}
                  onRename={onRename}
                  onMove={onMove}
                  onToggleStar={onToggleStar}
                  onDelete={onDelete}
                  onDetails={() => {
                    onSelectItem({ type: 'file', ...file });
                    if(onDetails) onDetails(file);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center px-3 py-2 border-b border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400">
                <span className="flex-1">Name</span>
                <span className="w-32 hidden md:block">Size</span>
                <span className="w-32 hidden sm:block">Last Modified</span>
              </div>
              {files.map(file => (
                <FileListItem
                  key={file._id}
                  file={file}
                  isSelected={selectedItem?._id === file._id}
                  onClick={onSelectItem}
                  onDoubleClick={onDoubleClick}
                  onDownload={onDownload}
                  onRename={onRename}
                  onMove={onMove}
                  onToggleStar={onToggleStar}
                  onDelete={onDelete}
                  onDetails={() => {
                    onSelectItem({ type: 'file', ...file });
                    if(onDetails) onDetails(file);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileGrid;
