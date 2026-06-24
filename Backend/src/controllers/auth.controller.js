const crypto = require('crypto');
const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt');

const verifyTelegramWebAppData = (telegramInitData) => {
  // We expect an object with: id, first_name, username, photo_url, auth_date, hash
  const { hash, ...data } = telegramInitData;

  if (!hash) return false;

  const dataCheckString = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256').update(process.env.TELEGRAM_BOT_TOKEN).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return hmac === hash;
};

const telegramLogin = async (req, res) => {
  try {
    const telegramData = req.body;

    // Check if replay attack (e.g. auth_date is too old - 86400 seconds = 1 day)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - telegramData.auth_date > 86400) {
      return res.status(401).json({ message: 'Authentication data is outdated' });
    }

    if (!verifyTelegramWebAppData(telegramData)) {
      return res.status(401).json({ message: 'Invalid Telegram authentication' });
    }

    // Find or create user
    let user = await User.findOne({ telegramId: telegramData.id.toString() });

    if (!user) {
      user = await User.create({
        telegramId: telegramData.id.toString(),
        username: telegramData.username || '',
        firstName: telegramData.first_name || '',
        avatar: telegramData.photo_url || '',
      });
    } else {
      // Update info in case it changed
      user.username = telegramData.username || user.username;
      user.firstName = telegramData.first_name || user.firstName;
      user.avatar = telegramData.photo_url || user.avatar;
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    telegramId: req.user.telegramId,
    username: req.user.username,
    firstName: req.user.firstName,
    avatar: req.user.avatar,
  });
};

module.exports = {
  telegramLogin,
  getMe,
};
