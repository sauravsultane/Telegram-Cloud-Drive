require('dotenv').config();
const mongoose = require('mongoose'); 
require('./src/config/db')(); 
const User = require('./src/models/User.model'); 
const { generateToken } = require('./src/utils/jwt');
const http = require('http');

setTimeout(async () => { 
  const user = await User.findOne({});
  const token = generateToken(user._id);
  
  const req = http.get('http://localhost:5000/api/files/storage', {
    headers: { 'Authorization': `Bearer ${token}` }
  }, (res) => {
    let data = '';
    res.on('data', (d) => data += d);
    res.on('end', () => {
      console.log('Response:', data);
      process.exit(0);
    });
  });
  
  req.on('error', (e) => {
    console.error(e);
    process.exit(1);
  });
}, 2000);
