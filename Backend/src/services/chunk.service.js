const telegramService = require('./telegram.service');

const CHUNK_SIZE = 45 * 1024 * 1024; // 45MB in bytes

const splitAndUploadBuffer = async (buffer, filename, mimeType) => {
  const chunks = [];
  const totalChunks = Math.ceil(buffer.length / CHUNK_SIZE);
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, buffer.length);
    const chunkBuffer = buffer.slice(start, end);
    
    const chunkFilename = `${filename}.part${i + 1}`;
    
    const result = await telegramService.uploadDocument(chunkBuffer, chunkFilename, mimeType);
    
    chunks.push({
      fileId: result.fileId,
      messageId: result.messageId,
      index: i,
    });
  }
  
  return chunks;
};

module.exports = {
  splitAndUploadBuffer,
  CHUNK_SIZE,
};
