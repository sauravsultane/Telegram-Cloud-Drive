import React, { createContext, useState, useCallback, useContext } from 'react';
import api from '../services/api';

export const FileContext = createContext();

export const useFiles = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);

  const fetchContent = useCallback(async (folderId = null, search = '') => {
    setLoading(true);
    try {
      setCurrentFolderId(folderId);
      const fileRes = await api.get('/files', { params: { folderId, search } });
      setFiles(fileRes.data);

      if (!search) {
        const folderRes = await api.get('/folders', { params: { parentId: folderId } });
        setFolders(folderRes.data);
      } else {
        setFolders([]);
      }
    } catch (error) {
      console.error("Failed to fetch content", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFolder = async (name) => {
    try {
      const res = await api.post('/folders', { name, parent: currentFolderId });
      setFolders(prev => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Failed to create folder", error);
    }
  };

  const uploadFile = async (fileObj, folderId) => {
    const uploadId = Date.now().toString() + '-' + fileObj.name;
    
    setUploadQueue(prev => [...prev, {
      id: uploadId,
      file: fileObj,
      progress: 0,
      status: 'uploading'
    }]);

    const formData = new FormData();
    formData.append('file', fileObj);
    formData.append('folderId', folderId || 'null');

    try {
      const res = await api.post('/files/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadQueue(prev => prev.map(item => 
            item.id === uploadId ? { ...item, progress: percentCompleted } : item
          ));
        }
      });

      // After successful upload, update queue status and refresh files if we are in the same folder
      setUploadQueue(prev => prev.map(item => 
        item.id === uploadId ? { ...item, status: 'completed', progress: 100 } : item
      ));

      if (currentFolderId === folderId) {
        setFiles(prev => [res.data, ...prev]);
      }

    } catch (error) {
      console.error("Upload failed", error);
      setUploadQueue(prev => prev.map(item => 
        item.id === uploadId ? { ...item, status: 'error' } : item
      ));
    }
  };

  const deleteFile = async (id) => {
    try {
      await api.delete(`/files/${id}`);
      setFiles(prev => prev.filter(f => f._id !== id));
    } catch (error) {
      console.error("Failed to delete file", error);
    }
  };

  const deleteFolder = async (id) => {
    try {
      await api.delete(`/folders/${id}`);
      setFolders(prev => prev.filter(f => f._id !== id));
    } catch (error) {
      console.error("Failed to delete folder", error);
    }
  };

  return (
    <FileContext.Provider value={{
      files, folders, currentFolderId, loading, uploadQueue,
      fetchContent, createFolder, uploadFile, deleteFile, deleteFolder
    }}>
      {children}
    </FileContext.Provider>
  );
};
