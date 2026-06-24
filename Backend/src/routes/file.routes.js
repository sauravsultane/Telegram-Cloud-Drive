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
} = require('../controllers/file.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getFiles);
router.get('/trash', getTrashFiles);
router.get('/:id', getFileMetadata);
router.post('/upload', upload.single('file'), uploadFile);
router.get('/:id/download', downloadFile);
router.patch('/:id', renameFile);
router.delete('/:id', softDeleteFile);
router.post('/:id/restore', restoreFile);
router.delete('/:id/permanent', permanentDeleteFile);

module.exports = router;
