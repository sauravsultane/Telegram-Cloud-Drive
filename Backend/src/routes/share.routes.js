const express = require('express');
const {
  createShareLink,
  getSharedFileInfo,
  downloadSharedFile,
  revokeShareLink,
} = require('../controllers/share.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/:token', getSharedFileInfo);
router.get('/:token/download', downloadSharedFile);

// Protected routes
router.use(protect);
router.post('/', createShareLink);
router.delete('/:token', revokeShareLink);

module.exports = router;
