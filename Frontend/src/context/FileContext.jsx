import React, { createContext, useState, useCallback, useContext } from 'react';
import api from '../services/api';

export const FileContext = createContext();

export const useFiles = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folderPath, setFolderPath] = useState([]); // [{_id, name}] breadcrumb trail
  const [currentView, setCurrentView] = useState('home');
  const [loading, setLoading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);

  const [storageStats, setStorageStats] = useState({ used: 0, limit: 15 * 1024 * 1024 * 1024 });

  const fetchStorageStats = useCallback(async () => {
    try {
      const res = await api.get('/files/storage');
      setStorageStats(res.data);
    } catch (error) {
      console.error("Failed to fetch storage stats", error);
    }
  }, []);

  const fetchContent = useCallback(async (folderId = null, search = '', view = currentView) => {
    setLoading(true);
    console.log('[fetchContent] view:', view, '| folderId:', folderId, '| search:', search);
    try {
      setCurrentFolderId(folderId);
      
      let fileRes;
      
      if (!['drive', 'home'].includes(view)) {
        setFolders([]);
      }
      setFiles([]); // Clear existing files while loading to prevent stale data on error

      if (['document', 'image', 'video', 'audio', 'archive'].includes(view)) {
        fileRes = await api.get(`/files/category/${view}`, { params: { search } });
        console.log('[fetchContent] category result:', fileRes.data);
        setFiles(fileRes.data);
      } else if (view === 'recent') {
        fileRes = await api.get('/files/recent', { params: { search } });
        console.log('[fetchContent] recent result:', fileRes.data);
        setFiles(fileRes.data);
      } else if (view === 'starred') {
        fileRes = await api.get('/files/starred', { params: { search } });
        console.log('[fetchContent] starred result:', fileRes.data);
        setFiles(fileRes.data);
      } else if (view === 'trash') {
        fileRes = await api.get('/files/trash', { params: { search } });
        console.log('[fetchContent] trash result:', fileRes.data);
        setFiles(fileRes.data);
      } else if (view === 'home') {
        fileRes = await api.get('/files/recent', { params: { search } });
        console.log('[fetchContent] home/recent result:', fileRes.data);
        setFiles(fileRes.data);
        if (!search) {
          const folderRes = await api.get('/folders', { params: { parentId: null } });
          setFolders(folderRes.data.slice(0, 5));
        }
      } else {
        // default 'drive'
        fileRes = await api.get('/files', { params: { folderId, search } });
        console.log('[fetchContent] drive result:', fileRes.data);
        setFiles(fileRes.data);
        if (!search) {
          const folderRes = await api.get('/folders', { params: { parentId: folderId } });
          setFolders(folderRes.data);
        }
      }
      
      // Update storage stats whenever we fetch content
      fetchStorageStats();
    } catch (error) {
      console.error('[fetchContent] ERROR for view:', view, error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [fetchStorageStats, currentView]);

  const changeView = (view) => {
    setCurrentView(view);
    if (view !== 'drive') {
      setCurrentFolderId(null);
      setFolderPath([]);
    } else {
      setFolderPath([]);
      setCurrentFolderId(null);
    }
    fetchContent(null, '', view);
  };

  // Navigate into a sub-folder (drive view)
  const navigateToFolder = (folder) => {
    setCurrentView('drive');
    setCurrentFolderId(folder._id);
    setFolderPath(prev => [...prev, { _id: folder._id, name: folder.name }]);
    fetchContent(folder._id, '', 'drive');
  };

  // Navigate up: go back to a specific breadcrumb index (-1 = root)
  const navigateBack = (index = -1) => {
    if (index === -1) {
      // Back to root of My Drive
      setFolderPath([]);
      setCurrentFolderId(null);
      fetchContent(null, '', 'drive');
    } else {
      const newPath = folderPath.slice(0, index + 1);
      const target = newPath[index];
      setFolderPath(newPath);
      setCurrentFolderId(target._id);
      fetchContent(target._id, '', 'drive');
    }
  };

  const toggleStar = async (id) => {
    try {
      const res = await api.patch(`/files/${id}/star`);
      setFiles(prev => prev.map(f => f._id === id ? { ...f, starred: res.data.starred } : f));
    } catch (error) {
      console.error("Failed to toggle star", error);
    }
  };

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
      
      fetchStorageStats();

      // Remove from queue after 3 seconds
      setTimeout(() => {
        setUploadQueue(prev => prev.filter(item => item.id !== uploadId));
      }, 3000);

    } catch (error) {
      console.error("Upload failed", error);
      setUploadQueue(prev => prev.map(item => 
        item.id === uploadId ? { ...item, status: 'error' } : item
      ));

      // Remove from queue after 3 seconds
      setTimeout(() => {
        setUploadQueue(prev => prev.filter(item => item.id !== uploadId));
      }, 3000);
    }
  };

  const deleteFile = async (id) => {
    try {
      await api.delete(`/files/${id}`);
      setFiles(prev => prev.filter(f => f._id !== id));
      fetchStorageStats();
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
      files, folders, currentFolderId, folderPath, currentView, loading, uploadQueue, storageStats,
      fetchContent, changeView, navigateToFolder, navigateBack, createFolder, uploadFile, deleteFile, deleteFolder, fetchStorageStats, toggleStar
    }}>
      {children}
    </FileContext.Provider>
  );
};
