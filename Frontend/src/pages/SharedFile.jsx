import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/axiosInstance';
import { Cloud, Download, AlertTriangle } from 'lucide-react';
import { formatBytes } from '../utils/formatBytes';

const SharedFile = () => {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`/share/${token}`);
        setFileInfo(res.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Error loading shared file');
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [token]);

  const handleDownload = () => {
    // Navigate to download stream directly (no auth needed)
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/share/${token}/download`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2AABEE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="bg-red-500/10 p-4 rounded-full inline-block mb-4">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Link Invalid</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2AABEE] rounded-full blur-[120px] opacity-10"></div>
      
      <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#2A2A2A] rounded-3xl p-8 max-w-md w-full shadow-2xl z-10">
        <div className="flex items-center space-x-2 mb-8 justify-center">
          <Cloud className="text-[#2AABEE]" />
          <span className="font-bold text-lg tracking-wide">TeleDrive</span>
        </div>

        <div className="bg-[#0F0F0F] rounded-2xl p-6 border border-[#2A2A2A] mb-8 text-center">
          <h1 className="text-xl font-bold truncate mb-2" title={fileInfo.name}>{fileInfo.name}</h1>
          <p className="text-gray-400 text-sm mb-4">
            Shared by {fileInfo.uploadedBy} • {formatBytes(fileInfo.size)}
          </p>
          {fileInfo.expiresAt && (
            <p className="text-xs text-orange-400 bg-orange-400/10 inline-block px-3 py-1 rounded-full">
              Expires: {new Date(fileInfo.expiresAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <button 
          onClick={handleDownload}
          className="w-full bg-[#2AABEE] text-white rounded-xl py-4 font-bold flex items-center justify-center space-x-2 hover:bg-[#2AABEE]/90 transition-colors shadow-[0_0_20px_rgba(42,171,238,0.3)] hover:shadow-[0_0_30px_rgba(42,171,238,0.5)]"
        >
          <Download size={20} />
          <span>Download File</span>
        </button>
      </div>
    </div>
  );
};

export default SharedFile;
