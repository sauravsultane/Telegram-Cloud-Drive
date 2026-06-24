const multer = require('multer');

// Use memory storage so files never touch the disk
const storage = multer.memoryStorage();

// Accept any file up to a certain size limit (e.g. 2GB, though realistically limited by RAM and network)
// For this app, let's limit to 1GB to prevent RAM exhaustion, or just leave it relatively large.
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB limit for RAM safety
  },
});

module.exports = upload;
