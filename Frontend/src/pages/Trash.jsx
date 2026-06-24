import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { File, Trash2, RotateCcw } from 'lucide-react';
import { formatBytes } from '../utils/formatBytes';
import { format } from 'date-fns';

const Trash = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    try {
      const res = await api.get('/files/trash');
      setFiles(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const restoreFile = async (id) => {
    try {
      await api.post(`/files/${id}/restore`);
      setFiles(prev => prev.filter(f => f._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const deletePermanently = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await api.delete(`/files/${id}/permanent`);
      setFiles(prev => prev.filter(f => f._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-4 border-[#2AABEE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Trash</h2>
      
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#2A2A2A] rounded-2xl bg-[#1A1A1A]/30">
          <Trash2 size={48} className="text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-white">Trash is empty</h3>
          <p className="text-gray-500 mt-1">Deleted files will appear here</p>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium">Deleted Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {files.map(file => (
                <tr key={file._id} className="hover:bg-[#2A2A2A]/50 transition-colors group">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <File size={18} className="text-gray-400" />
                    <span className="font-medium text-white">{file.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{formatBytes(file.size)}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{format(new Date(file.updatedAt), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => restoreFile(file._id)}
                        className="p-2 bg-[#2A2A2A] rounded-lg text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                        title="Restore"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button 
                        onClick={() => deletePermanently(file._id)}
                        className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Trash;
