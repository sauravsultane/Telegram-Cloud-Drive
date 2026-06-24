const bot = require('../config/telegram');
const axios = require('axios');

const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

const uploadDocument = async (buffer, filename, mimeType) => {
  try {
    const fileOptions = {
      filename,
      contentType: mimeType,
    };
    
    // sendDocument accepts a buffer
    const message = await bot.sendDocument(CHANNEL_ID, buffer, {}, fileOptions);
    return {
      messageId: message.message_id,
      fileId: message.document.file_id,
    };
  } catch (error) {
    console.error('Error uploading document to Telegram:', error);
    throw new Error('Failed to upload file to Telegram');
  }
};

const getFileStream = async (fileId) => {
  try {
    const fileLink = await bot.getFileLink(fileId);
    
    // We use axios to get a read stream from the Telegram CDN
    const response = await axios({
      method: 'get',
      url: fileLink,
      responseType: 'stream',
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting file stream from Telegram:', error);
    throw new Error('Failed to download file from Telegram');
  }
};

const deleteDocument = async (messageId) => {
  try {
    await bot.deleteMessage(CHANNEL_ID, messageId);
  } catch (error) {
    console.error('Error deleting document from Telegram:', error);
    throw new Error('Failed to delete file from Telegram');
  }
};

module.exports = {
  uploadDocument,
  getFileStream,
  deleteDocument,
};
