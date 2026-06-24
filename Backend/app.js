const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (will be added later)
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/files', require('./src/routes/file.routes'));
app.use('/api/folders', require('./src/routes/folder.routes'));
app.use('/api/share', require('./src/routes/share.routes'));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'TeleDrive API is running' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
