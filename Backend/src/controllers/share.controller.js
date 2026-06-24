const { v4: uuidv4 } = require('uuid');
const ShareLink = require('../models/ShareLink.model');
const File = require('../models/File.model');
const telegramService = require('../services/telegram.service');

const createShareLink = async (req, res) => {
  try {
    const { fileId, expiresAt, maxDownloads } = req.body;

    const file = await File.findOne({ _id: fileId, owner: req.user._id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const shareLink = await ShareLink.create({
      token: uuidv4(),
      fileId,
      createdBy: req.user._id,
      expiresAt: expiresAt || null,
      maxDownloads: maxDownloads || null,
    });

    res.status(201).json(shareLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating share link' });
  }
};

const getSharedFileInfo = async (req, res) => {
  try {
    const { token } = req.params;
    const shareLink = await ShareLink.findOne({ token }).populate('fileId').populate('createdBy', 'firstName');

    if (!shareLink) return res.status(404).json({ message: 'Invalid share link' });

    // Check expiration
    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      return res.status(403).json({ message: 'Share link expired' });
    }

    if (shareLink.maxDownloads !== null && shareLink.downloadCount >= shareLink.maxDownloads) {
      return res.status(403).json({ message: 'Download limit reached' });
    }

    const file = shareLink.fileId;

    res.json({
      name: file.name,
      size: file.size,
      mimeType: file.mimeType,
      uploadedBy: shareLink.createdBy.firstName,
      expiresAt: shareLink.expiresAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching share info' });
  }
};

const downloadSharedFile = async (req, res) => {
  try {
    const { token } = req.params;
    const shareLink = await ShareLink.findOne({ token }).populate('fileId');

    if (!shareLink) return res.status(404).json({ message: 'Invalid share link' });

    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      return res.status(403).json({ message: 'Share link expired' });
    }

    if (shareLink.maxDownloads !== null && shareLink.downloadCount >= shareLink.maxDownloads) {
      return res.status(403).json({ message: 'Download limit reached' });
    }

    const file = shareLink.fileId;

    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimeType);

    if (file.chunks && file.chunks.length > 0) {
      for (const chunk of file.chunks.sort((a, b) => a.index - b.index)) {
        const stream = await telegramService.getFileStream(chunk.fileId);
        await new Promise((resolve, reject) => {
          stream.pipe(res, { end: false });
          stream.on('end', resolve);
          stream.on('error', reject);
        });
      }
      res.end();
    } else {
      const stream = await telegramService.getFileStream(file.telegramFileId);
      stream.pipe(res);
    }

    // Increment download count
    shareLink.downloadCount += 1;
    await shareLink.save();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error downloading shared file' });
    } else {
      res.end();
    }
  }
};

const revokeShareLink = async (req, res) => {
  try {
    const { token } = req.params;
    const shareLink = await ShareLink.findOneAndDelete({ token, createdBy: req.user._id });

    if (!shareLink) return res.status(404).json({ message: 'Share link not found' });

    res.json({ message: 'Share link revoked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error revoking share link' });
  }
};

module.exports = {
  createShareLink,
  getSharedFileInfo,
  downloadSharedFile,
  revokeShareLink,
};
