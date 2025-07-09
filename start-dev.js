import { spawn } from 'child_process';
import path from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  }
};

// Start the backend server
console.log(`${colors.fg.green}Starting backend server...${colors.reset}`);
const backendServer = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true
});

// Start the frontend client
console.log(`${colors.fg.blue}Starting frontend client...${colors.reset}`);
const frontendClient = spawn('npm', ['run', 'client'], {
  stdio: 'pipe',
  shell: true
});

// Helper function to prefix logs
function prefixLogs(data, prefix, color) {
  const lines = data.toString().split('\n');
  return lines.map(line => {
    if (line.trim() === '') return '';
    return `${color}[${prefix}]${colors.reset} ${line}`;
  }).join('\n');
}

// Handle backend server output
backendServer.stdout.on('data', (data) => {
  process.stdout.write(prefixLogs(data, 'Backend', colors.fg.green));
});

backendServer.stderr.on('data', (data) => {
  process.stderr.write(prefixLogs(data, 'Backend', colors.fg.red));
});

// Handle frontend client output
frontendClient.stdout.on('data', (data) => {
  process.stdout.write(prefixLogs(data, 'Frontend', colors.fg.blue));
});

frontendClient.stderr.on('data', (data) => {
  process.stderr.write(prefixLogs(data, 'Frontend', colors.fg.magenta));
});

// Gracefully handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down dev servers...');
  backendServer.kill('SIGINT');
  frontendClient.kill('SIGINT');
  process.exit(0);
});

// Log when servers exit
backendServer.on('close', (code) => {
  console.log(`${colors.fg.red}Backend server exited with code ${code}${colors.reset}`);
});

frontendClient.on('close', (code) => {
  console.log(`${colors.fg.red}Frontend client exited with code ${code}${colors.reset}`);
});

console.log(`${colors.fg.green}${colors.bright}Both servers are running! Access your app at:${colors.reset}`);
console.log(`${colors.fg.cyan}➜ Frontend: http://localhost:5002${colors.reset}`);
console.log(`${colors.fg.yellow}➜ Backend API: http://localhost:5000/api${colors.reset}`);
console.log(`${colors.bright}Use payment links at: http://localhost:5002/pl_YOUR_LINK_ID${colors.reset}`); 