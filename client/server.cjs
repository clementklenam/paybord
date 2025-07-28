const { spawn } = require('child_process');
const path = require('path');

console.log('Starting server from client directory...');
console.log('Current directory:', __dirname);

// Change to parent directory and start the root server
const rootServerPath = path.join(__dirname, '..', 'dist', 'index.js');
console.log('Root server path:', rootServerPath);

const server = spawn('node', [rootServerPath], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
}); 