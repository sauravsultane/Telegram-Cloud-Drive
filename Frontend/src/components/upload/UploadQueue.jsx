import React from 'react';
import { useFiles } from '../../context/FileContext';
import { X, File, CheckCircle } from 'lucide-react';
import { formatBytes } from '../../utils/formatBytes';

const UploadQueue = () => {
  const { uploadQueue } = useFiles();

  if (uploadQueue.length === 0) return null;

  // Find completed uploads
  const completedUploads = uploadQueue.filter(u => u.status === 'completed');

  // If all completed and we want to auto-hide, we could set a timeout
  // For now, we'll just show it always if there are items

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[400px]">
      <div className="bg-[#2A2A2A]/50 px-4 py-3 border-b border-[#2A2A2A] flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white">
          Uploads ({completedUploads.length}/{uploadQueue.length})
        </h3>
        {/* We can add a close button to clear queue later if needed */}
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 space-y-2">
        {uploadQueue.map(item => (
          <div key={item.id} className="bg-[#0F0F0F] rounded-lg p-3 border border-[#2A2A2A]">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {item.status === 'completed' ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : item.status === 'error' ? (
                  <X size={16} className="text-red-500" />
                ) : (
                  <File size={16} className="text-[#2AABEE]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.file.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{formatBytes(item.file.size)}</span>
                  {item.status === 'uploading' && (
                    <span className="text-xs text-[#2AABEE]">{item.progress}%</span>
                  )}
                  {item.status === 'error' && (
                    <span className="text-xs text-red-500">Failed</span>
                  )}
                </div>
                
                {item.status === 'uploading' && (
                  <div className="w-full bg-[#2A2A2A] rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className="bg-[#2AABEE] h-1.5 rounded-full transition-all duration-300 ease-out" 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadQueue;
