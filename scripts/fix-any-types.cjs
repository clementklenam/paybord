
const fs = require('fs');
const path = require('path');

function fixAnyTypesInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace explicit 'any' with 'unknown' for better type safety
    const anyRegex = /: any\b/g;
    if (anyRegex.test(content)) {
      content = content.replace(anyRegex, ': unknown');
      modified = true;
    }
    
    // Fix common patterns
    const patterns = [
      // Fix response.data as any
      { 
        regex: /response\.data as any/g, 
        replacement: 'response.data as unknown' 
      },
      // Fix function parameters
      { 
        regex: /\(([^)]+): any\)/g, 
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
      console.log(`✅ Fixed types in ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
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
