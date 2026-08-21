const http = require('http');

http.get('http://localhost:5000/api/files/storage', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  res.on('data', (d) => process.stdout.write(d));
}).on('error', (e) => {
  console.error(e);
});
