#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running ESLint autofix to remove unused imports and variables...');

try {
  // Run ESLint autofix
  execSync('npx eslint src --fix --quiet', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..', 'client')
  });
  
  console.log('ESLint autofix completed successfully!');
  
  // Run ESLint again to see remaining errors
  console.log('\nChecking remaining errors...');
  execSync('npx eslint src', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..', 'client')
  });
  
} catch (error) {
  console.log('ESLint completed with some errors (this is expected)');
  console.log('The autofix has been applied to files that could be fixed automatically');
} 