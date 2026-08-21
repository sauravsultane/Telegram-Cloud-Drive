const File = require('../models/File.model');
const telegramService = require('../services/telegram.service');
const chunkService = require('../services/chunk.service');

const getFileCategory = (mimetype, filename = '') => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  if (documentTypes.includes(mimetype)) return 'document';
  
  const archiveTypes = [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-zip',
    'application/x-rar-compressed',
    'application/vnd.rar',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/gzip',
    'application/x-bzip2',
  ];
  if (archiveTypes.includes(mimetype)) return 'archive';

  // Fallback: detect by file extension (useful when browser sends application/octet-stream)
  const ext = filename.split('.').pop().toLowerCase();
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)) return 'archive';
  if (['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx', 'csv'].includes(ext)) return 'document';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) return 'image';
  if (['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'].includes(ext)) return 'audio';

  return 'other';
};

const getFiles = async (req, res) => {
  try {
    const { folderId = null, search, sortBy = 'createdAt' } = req.query;
    
    let query = { owner: req.user._id, isDeleted: false };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    } else {
      query.folderId = folderId === 'null' ? null : folderId;
    }

    const sortOption = {};
    if (sortBy === 'name') sortOption.name = 1;
    else if (sortBy === 'size') sortOption.size = -1;
    else sortOption.createdAt = -1;

    const files = await File.find(query).sort(sortOption);
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching files' });
  }
};

const getTrashFiles = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { owner: req.user._id, isDeleted: true };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const files = await File.find(query).sort({ updatedAt: -1 });
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching trash files' });
  }
};

const getFileMetadata = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching file metadata' });
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const folderId = req.body.folderId === 'null' || !req.body.folderId ? null : req.body.folderId;

    let telegramData = {};
    let chunks = [];

    if (size > chunkService.CHUNK_SIZE) {
      // Large file, chunk it
      chunks = await chunkService.splitAndUploadBuffer(buffer, originalname, mimetype);
    } else {
      // Normal file, single upload
      telegramData = await telegramService.uploadDocument(buffer, originalname, mimetype);
    }

    const category = getFileCategory(mimetype, originalname);

    const newFile = await File.create({
      name: originalname,
      originalName: originalname,
      mimeType: mimetype,
      category,
      size,
      telegramFileId: telegramData.fileId || null,
      telegramMessageId: telegramData.messageId || null,
      folderId,
      owner: req.user._id,
      chunks,
    });

    res.status(201).json(newFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const disposition = req.query.action === 'view' ? 'inline' : 'attachment';
    res.setHeader('Content-Disposition', `${disposition}; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimeType);

    if (file.chunks && file.chunks.length > 0) {
      // Stream chunks sequentially
      for (const chunk of file.chunks.sort((a, b) => a.index - b.index)) {
        const stream = await telegramService.getFileStream(chunk.fileId);
        // We use a promise to wait for each stream to finish before piping the next
        await new Promise((resolve, reject) => {
          stream.pipe(res, { end: false });
          stream.on('end', resolve);
          stream.on('error', reject);
        });
      }
      res.end();
    } else {
      // Single file download
      const stream = await telegramService.getFileStream(file.telegramFileId);
      stream.pipe(res);
    }
  } catch (error) {
    console.error(error);
    // If headers already sent, we can't send a JSON error
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error downloading file' });
    } else {
      res.end();
    }
  }
};

const renameFile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const file = await File.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { name },
      { new: true }
    );
    
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error renaming file' });
  }
};

const softDeleteFile = async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { isDeleted: true },
      { new: true }
    );
    
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json({ message: 'File moved to trash', file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting file' });
  }
};

const restoreFile = async (req, res) => {
  try {
    const file = await File.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { isDeleted: false },
      { new: true }
    );
    
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json({ message: 'File restored', file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error restoring file' });
  }
};

const permanentDeleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Delete from Telegram
    if (file.chunks && file.chunks.length > 0) {
      for (const chunk of file.chunks) {
        await telegramService.deleteDocument(chunk.messageId).catch(err => console.error("Could not delete chunk", err));
      }
    } else if (file.telegramMessageId) {
      await telegramService.deleteDocument(file.telegramMessageId).catch(err => console.error("Could not delete doc", err));
    }

    // Delete from DB
    await File.findByIdAndDelete(file._id);
    res.json({ message: 'File permanently deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error permanently deleting file' });
  }
};

const mongoose = require('mongoose');

const getStorageStats = async (req, res) => {
  try {
    const result = await File.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(req.user._id), isDeleted: false } }, // Optionally include trash or not
      { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);
    
    const totalSize = result.length > 0 ? result[0].totalSize : 0;
    
    // Hardcoded limit for now, e.g., 15GB
    const limit = 15 * 1024 * 1024 * 1024;
    
    res.json({ used: totalSize, limit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching storage stats' });
  }
};
// Extension maps per category
const CATEGORY_EXTENSIONS = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'],
  video: ['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv'],
  audio: ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'],
  document: ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx', 'csv'],
  archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'],
};

const getFilesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { search } = req.query;

    const extensions = CATEGORY_EXTENSIONS[category];
    if (!extensions) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Build extension regex: matches name ending with any of the extensions
    const extPattern = extensions.map(e => `\.${e}`).join('|');
    const nameExtRegex = new RegExp(`(${extPattern})$`, 'i');

    let baseQuery = {
      owner: req.user._id,
      isDeleted: false,
      $or: [
        { category },
        { name: nameExtRegex },
      ],
    };

    if (search) {
      baseQuery.name = { $regex: search, $options: 'i' };
    }

    const files = await File.find(baseQuery).sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching files by category' });
  }
};



const getRecentFiles = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { owner: req.user._id, isDeleted: false };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const files = await File.find(query).sort({ createdAt: -1 }).limit(20);
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recent files' });
  }
};

const getStarredFiles = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { owner: req.user._id, isDeleted: false, starred: true };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const files = await File.find(query).sort({ updatedAt: -1 });
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching starred files' });
  }
};

const toggleStarFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ message: 'File not found' });
    
    file.starred = !file.starred;
    await file.save();
    
    res.json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error toggling star status' });
  }
};

module.exports = {
  getFiles,
  getTrashFiles,
  getFileMetadata,
  uploadFile,
  downloadFile,
  renameFile,
  softDeleteFile,
  restoreFile,
  permanentDeleteFile,
  getStorageStats,
  getFilesByCategory,
  getRecentFiles,
  getStarredFiles,
  toggleStarFile,
};
