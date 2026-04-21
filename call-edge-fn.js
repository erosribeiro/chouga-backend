const https = require('https');

const data = JSON.stringify({
  email: 'erosribeiroo@gmail.com',
  password: 'admin123',
  full_name: 'Eros Ribeiro',
  role: 'admin'
});

const options = {
  hostname: 'ppftrkturqvkqbsxalno.supabase.co',
  port: 443,
  path: '/functions/v1/create-admin-user',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();