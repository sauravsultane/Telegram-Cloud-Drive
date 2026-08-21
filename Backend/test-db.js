require('dotenv').config();
const mongoose = require('mongoose'); 
require('./src/config/db')(); 
const File = require('./src/models/File.model'); 
const User = require('./src/models/User.model');
setTimeout(async () => { 
  const user = await User.findOne({});
  const r = await File.aggregate([
    { $match: { owner: user._id, isDeleted: false } },
    { $group: { _id: null, totalSize: { $sum: '$size' } } }
  ]); 
  console.log('Agg with match:', r); 
  process.exit(0); 
}, 2000);
