const express = require('express');
const {
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
} = require('../controllers/file.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.use(protect);

// --- Static / named routes MUST come before /:id param routes ---
router.get('/storage', getStorageStats);
router.get('/trash', getTrashFiles);
router.get('/recent', getRecentFiles);
router.get('/starred', getStarredFiles);
router.get('/category/:category', getFilesByCategory);
router.post('/upload', upload.single('file'), uploadFile);

// --- Root listing ---
router.get('/', getFiles);

// --- Param routes (/:id must be last to avoid swallowing named routes) ---
router.get('/:id/download', downloadFile);
router.get('/:id', getFileMetadata);
router.patch('/:id/star', toggleStarFile);
router.patch('/:id', renameFile);
router.delete('/:id/permanent', permanentDeleteFile);
router.delete('/:id', softDeleteFile);
router.post('/:id/restore', restoreFile);

module.exports = router;
