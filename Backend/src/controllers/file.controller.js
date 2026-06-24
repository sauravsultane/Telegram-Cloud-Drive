const File = require('../models/File.model');
const telegramService = require('../services/telegram.service');
const chunkService = require('../services/chunk.service');

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
    const files = await File.find({ owner: req.user._id, isDeleted: true }).sort({ updatedAt: -1 });
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

    const newFile = await File.create({
      name: originalname,
      originalName: originalname,
      mimeType: mimetype,
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

    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
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
};
