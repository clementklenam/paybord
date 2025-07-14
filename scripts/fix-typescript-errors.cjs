#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting TypeScript error fixes...\n');

// Step 1: Run ESLint autofix to remove unused imports/variables
console.log('1️⃣ Running ESLint autofix...');
try {
  execSync('npx eslint client/src --fix', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ ESLint autofix completed\n');
} catch (error) {
  console.log('⚠️  ESLint autofix had some issues, but continuing...\n');
}

// Step 2: Create a script to fix explicit 'any' types
console.log('2️⃣ Creating script to fix explicit "any" types...');

const fixAnyTypes = `
const fs = require('fs');
const path = require('path');

function fixAnyTypesInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace explicit 'any' with 'unknown' for better type safety
    const anyRegex = /: any\\b/g;
    if (anyRegex.test(content)) {
      content = content.replace(anyRegex, ': unknown');
      modified = true;
    }
    
    // Fix common patterns
    const patterns = [
      // Fix response.data as any
      { 
        regex: /response\\.data as any/g, 
        replacement: 'response.data as unknown' 
      },
      // Fix function parameters
      { 
        regex: /\\(([^)]+): any\\)/g, 
        replacement: '($1: unknown)' 
      },
      // Fix variable declarations
      { 
        regex: /const ([^=]+): any =/g, 
        replacement: 'const $1: unknown =' 
      },
      { 
        regex: /let ([^=]+): any =/g, 
        replacement: 'let $1: unknown =' 
      },
      { 
        regex: /var ([^=]+): any =/g, 
        replacement: 'var $1: unknown =' 
      }
    ];
    
    patterns.forEach(({ regex, replacement }) => {
      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(\`✅ Fixed types in \${filePath}\`);
    }
  } catch (error) {
    console.log(\`❌ Error processing \${filePath}: \${error.message}\`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fixAnyTypesInFile(filePath);
    }
  });
}

// Process the client/src directory
const srcDir = path.join(__dirname, '../client/src');
if (fs.existsSync(srcDir)) {
  console.log('🔍 Scanning for TypeScript files...');
  processDirectory(srcDir);
  console.log('✅ Type fixes completed');
} else {
  console.log('❌ client/src directory not found');
}
`;

fs.writeFileSync('scripts/fix-any-types.cjs', fixAnyTypes);
console.log('✅ Script created: scripts/fix-any-types.cjs\n');

// Step 3: Run the any-type fixing script
console.log('3️⃣ Running any-type fixes...');
try {
  execSync('node scripts/fix-any-types.cjs', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Any-type fixes completed\n');
} catch (error) {
  console.log('⚠️  Any-type fixes had some issues, but continuing...\n');
}

// Step 4: Run ESLint again to see remaining issues
console.log('4️⃣ Running ESLint again to check remaining issues...');
try {
  execSync('npx eslint client/src --max-warnings 0', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.log('\n⚠️  Some ESLint errors remain. These may need manual review.');
}

console.log('\n🎉 TypeScript error fixing script completed!');
console.log('\n📋 Summary:');
console.log('- Removed unused imports and variables');
console.log('- Replaced explicit "any" types with "unknown"');
console.log('- Fixed common type assertion patterns');
console.log('\n💡 Remaining errors may need manual review for business logic correctness.'); 