const mongoose = require('mongoose');

const shareLinkSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  maxDownloads: {
    type: Number,
    default: null,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('ShareLink', shareLinkSchema);
