const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
  },
  firstName: {
    type: String,
  },
  avatar: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
