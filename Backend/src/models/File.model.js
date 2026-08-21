const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['document', 'image', 'video', 'audio', 'archive', 'other'],
    default: 'other',
  },
  size: {
    type: Number,
    required: true,
  },
  telegramFileId: {
    type: String,
  },
  telegramMessageId: {
    type: Number,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  starred: {
    type: Boolean,
    default: false,
  },
  chunks: [{
    fileId: String,
    messageId: Number,
    index: Number
  }],
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
