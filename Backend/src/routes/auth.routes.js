const express = require('express');
const { telegramLogin, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/telegram', telegramLogin);
router.get('/me', protect, getMe);

module.exports = router;
