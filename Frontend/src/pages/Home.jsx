import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFiles } from '../context/FileContext';
import { UploadCloud, Folder as FolderIcon, File as FileIcon } from 'lucide-react';
import { formatBytes } from '../utils/formatBytes';
import { format } from 'date-fns';

const Home = () => {
  const { files, folders, currentFolderId, loading, fetchContent, uploadFile } = useFiles();

  useEffect(() => {
    fetchContent(currentFolderId);
  }, [currentFolderId, fetchContent]);

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      uploadFile(file, currentFolderId);
    });
  }, [uploadFile, currentFolderId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  const handleDownload = (file) => {
    const token = localStorage.getItem('token');
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/files/${file._id}/download?token=${token}`;
    // A better way is using fetch/axios to stream it, but for simplicity of the UI we can just navigate or download it directly
  };

  return (
    <div {...getRootProps()} className="min-h-full flex flex-col relative outline-none">
      <input {...getInputProps()} />
      
      {isDragActive && (
        <div className="absolute inset-0 bg-[#2AABEE]/10 border-2 border-dashed border-[#2AABEE] z-40 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl flex flex-col items-center shadow-2xl border border-[#2A2A2A]">
            <UploadCloud size={48} className="text-[#2AABEE] mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-white">Drop files to upload</h2>
            <p className="text-gray-400 mt-2">Files will be securely saved to Telegram</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#2AABEE] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {folders.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Folders</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {folders.map(folder => (
                  <div key={folder._id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 flex items-center space-x-3 cursor-pointer hover:border-[#2AABEE] hover:bg-[#2A2A2A] transition-colors group">
                    <FolderIcon size={24} className="text-[#2AABEE] group-hover:fill-[#2AABEE]/20 transition-colors" />
                    <span className="font-medium truncate flex-1">{folder.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Files</h3>
            {files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#2A2A2A] rounded-2xl bg-[#1A1A1A]/30">
                <div className="bg-[#2A2A2A] p-4 rounded-full mb-4">
                  <UploadCloud size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white">No files here</h3>
                <p className="text-gray-500 mt-1">Drag and drop files to upload</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {files.map(file => (
                  <div key={file._id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#2AABEE] transition-colors group flex flex-col cursor-context-menu">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="p-3 bg-[#2A2A2A] rounded-xl group-hover:bg-[#2AABEE]/10 transition-colors">
                        <FileIcon size={24} className="text-gray-400 group-hover:text-[#2AABEE] transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="font-medium text-white truncate" title={file.name}>{file.name}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                          <span>{formatBytes(file.size)}</span>
                          <span>•</span>
                          <span>{format(new Date(file.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-[#2A2A2A] flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDownload(file)} className="text-sm px-3 py-1.5 bg-[#2AABEE]/10 text-[#2AABEE] rounded-lg hover:bg-[#2AABEE] hover:text-white transition-colors">
                        Download
                      </button>
                      <button className="text-sm px-3 py-1.5 bg-[#2A2A2A] text-gray-300 rounded-lg hover:text-white hover:bg-gray-700 transition-colors">
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
