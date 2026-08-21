/**
 * Migration script v2: backfill the `category` field on all existing File documents
 * using both MIME type AND file extension detection.
 *
 * Run with:  node migrate-categories.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const File = require('./src/models/File.model');

const getFileCategory = (mimetype, filename = '') => {
  if (mimetype && mimetype.startsWith('image/')) return 'image';
  if (mimetype && mimetype.startsWith('video/')) return 'video';
  if (mimetype && mimetype.startsWith('audio/')) return 'audio';

  const documentMimes = [
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/csv',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  if (documentMimes.includes(mimetype)) return 'document';

  const archiveMimes = [
    'application/zip', 'application/x-zip-compressed', 'application/x-zip',
    'application/x-rar-compressed', 'application/vnd.rar',
    'application/x-7z-compressed', 'application/x-tar',
    'application/gzip', 'application/x-bzip2',
  ];
  if (archiveMimes.includes(mimetype)) return 'archive';

  // Fallback to file extension
  const ext = (filename || '').split('.').pop().toLowerCase();
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)) return 'archive';
  if (['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx', 'csv'].includes(ext)) return 'document';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) return 'image';
  if (['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'].includes(ext)) return 'audio';

  return 'other';
};

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const files = await File.find({});
  console.log(`Found ${files.length} total files to check`);

  let updated = 0;
  for (const file of files) {
    const correctCategory = getFileCategory(file.mimeType, file.originalName || file.name);
    if (correctCategory !== file.category) {
      const old = file.category;
      file.category = correctCategory;
      await file.save();
      updated++;
      console.log(`  Updated: ${file.name} | ${old} → ${correctCategory} (${file.mimeType})`);
    }
  }

  console.log(`\nDone! Updated ${updated} / ${files.length} files.`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
