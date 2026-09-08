const mongoose = require('mongoose');
const dns = require('dns'); // 1. Require the dns module

// In local Windows environments, ISP DNS servers often fail on SRV queries.
// On cloud providers like Render, forcing 8.8.8.8 can fail due to container firewall/VPC DNS restrictions.
if (process.env.NODE_ENV !== 'production' && !process.env.RENDER) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    console.warn('Could not set custom DNS servers:', err.message);
  }
}

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('CRITICAL: MONGO_URI environment variable is not defined!');
    console.error('Please set MONGO_URI in your Render service Environment tab.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('whitelist') || error.message.includes('ETIMEDOUT')) {
      console.error('Hint: Make sure MongoDB Atlas IP Whitelist (Network Access) is set to 0.0.0.0/0 to allow Render connections.');
    }
  }
};

module.exports = connectDB;
