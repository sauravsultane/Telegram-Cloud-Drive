const express = require('express');
const {
  createFolder,
  getFolders,
  renameFolder,
  deleteFolder,
} = require('../controllers/folder.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', createFolder);
router.get('/', getFolders);
router.patch('/:id', renameFolder);
router.delete('/:id', deleteFolder);

module.exports = router;
