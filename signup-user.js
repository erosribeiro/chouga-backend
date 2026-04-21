const https = require('https');

const data = JSON.stringify({
  email: 'erosribeiroo@gmail.com',
  password: 'admin123',
  options: {
    data: {
      full_name: 'Eros Ribeiro',
      role: 'admin'
    }
  }
});

const options = {
  hostname: 'ppftrkturqvkqbsxalno.supabase.co',
  port: 443,
  path: '/auth/v1/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZnRya3R1cnF2a3Fic3hhbG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTI2MDksImV4cCI6MjA5MjM2ODYwOX0.1887MfrBLgvV4UsNGAdsUthjKZtl6EP3f2eQD149e9c',
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