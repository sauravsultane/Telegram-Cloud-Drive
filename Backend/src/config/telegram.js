const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;

let bot;
if (token && token !== 'your_bot_token_from_botfather') {
  bot = new TelegramBot(token, { polling: false }); // No polling needed, we just send/receive requests
} else {
  console.warn("TELEGRAM_BOT_TOKEN is not properly configured. Telegram features will fail.");
  // A dummy bot object for graceful failure if needed during testing without token
  bot = {
    sendDocument: async () => { throw new Error('Bot not configured'); },
    getFileLink: async () => { throw new Error('Bot not configured'); },
    deleteMessage: async () => { throw new Error('Bot not configured'); }
  };
}

module.exports = bot;
