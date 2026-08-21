import React from 'react';
import { X, Download, FileText, Archive, File as FileIcon } from 'lucide-react';

const FilePreviewModal = ({ file, onClose, onDownload }) => {
  if (!file) return null;

  const token = localStorage.getItem('token');
  const fileUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/files/${file._id}/download?action=view&token=${token}`;

  const renderContent = () => {
    if (file.category === 'image') {
      return (
        <img
          src={fileUrl}
          alt={file.name}
          className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
        />
      );
    }

    if (file.category === 'video') {
      return (
        <video
          controls
          autoPlay
          className="max-w-full max-h-[85vh] rounded-md outline-none bg-black shadow-2xl"
        >
          <source src={fileUrl} type={file.mimeType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (file.category === 'audio') {
      return (
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl flex flex-col items-center min-w-[340px]">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 truncate max-w-xs text-center">{file.name}</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Audio file</p>
          <audio controls autoPlay className="w-full outline-none">
            <source src={fileUrl} type={file.mimeType} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    if (file.category === 'document' && file.mimeType === 'application/pdf') {
      return (
        <div className="w-full h-[85vh] max-w-4xl rounded-md overflow-hidden shadow-2xl bg-white dark:bg-gray-800">
          <iframe
            src={fileUrl}
            title={file.name}
            className="w-full h-full border-0"
          />
        </div>
      );
    }

    // Non-previewable: show a nice download card
    const IconMap = {
      document: <FileText size={48} className="text-green-600" />,
      archive: <Archive size={48} className="text-yellow-600" />,
    };
    const icon = IconMap[file.category] || <FileIcon size={48} className="text-blue-500" />;

    return (
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl flex flex-col items-center min-w-[320px]">
        <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-5">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 truncate max-w-xs text-center">{file.name}</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Preview not available for this file type</p>
        <button
          onClick={() => onDownload(file)}
          className="flex items-center space-x-2 bg-[#1967d2] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#1557b0] transition-colors"
        >
          <Download size={16} />
          <span>Download File</span>
        </button>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Top action bar */}
      <div className="absolute top-4 right-4 flex space-x-3 z-10">
        <button
          onClick={() => onDownload(file)}
          title="Download"
          className="text-white/80 hover:text-white p-2.5 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
        >
          <Download size={20} />
        </button>
        <button
          onClick={onClose}
          title="Close"
          className="text-white/80 hover:text-white p-2.5 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* File name top-left */}
      <div className="absolute top-4 left-4 text-white/70 text-sm font-medium truncate max-w-[60vw]">
        {file.name}
      </div>

      <div className="relative max-w-6xl w-full flex justify-center items-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default FilePreviewModal;
