#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript files
function findTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findTsFiles(fullPath, files);
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to remove unused imports
function removeUnusedImports(content) {
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      newLines.push(lines[i]);
      continue;
    }
    
    // Check if this is an import statement
    if (line.startsWith('import ')) {
      // Extract import names
      const importMatch = line.match(/import\s*{([^}]+)}\s*from/);
      if (importMatch) {
        const imports = importMatch[1].split(',').map(imp => imp.trim());
        const usedImports = [];
        
        for (const imp of imports) {
          const importName = imp.split(' as ')[0].trim();
          // Check if this import is used in the file (excluding the import line itself)
          const fileContent = content.replace(line, '');
          if (fileContent.includes(importName)) {
            usedImports.push(imp);
          }
        }
        
        if (usedImports.length > 0) {
          // Keep the import with only used items
          const newImport = line.replace(importMatch[1], usedImports.join(', '));
          newLines.push(newImport);
        }
        // If no imports are used, skip adding this import
      } else {
        // For default imports, check if they're used
        const defaultMatch = line.match(/import\s+(\w+)\s+from/);
        if (defaultMatch) {
          const importName = defaultMatch[1];
          const fileContent = content.replace(line, '');
          if (fileContent.includes(importName)) {
            newLines.push(lines[i]);
          }
        } else {
          newLines.push(lines[i]);
        }
      }
    } else {
      newLines.push(lines[i]);
    }
  }
  
  return newLines.join('\n');
}

// Function to replace explicit any types with unknown
function replaceExplicitAny(content) {
  // Replace explicit any types with unknown
  content = content.replace(/: any/g, ': unknown');
  content = content.replace(/as any/g, 'as unknown');
  content = content.replace(/<any>/g, '<unknown>');
  
  return content;
}

// Function to fix empty object types
function fixEmptyObjectTypes(content) {
  // Remove empty interface declarations
  content = content.replace(/interface\s+\w+\s*{\s*}\s*/g, '');
  
  return content;
}

// Function to fix case declarations
function fixCaseDeclarations(content) {
  // Add braces around case declarations
  content = content.replace(/case\s+([^:]+):\s*const\s+/g, 'case $1: { const ');
  content = content.replace(/case\s+([^:]+):\s*let\s+/g, 'case $1: { let ');
  content = content.replace(/case\s+([^:]+):\s*var\s+/g, 'case $1: { var ');
  
  // Add closing braces (this is a simplified approach)
  const lines = content.split('\n');
  const newLines = [];
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('case ') && line.includes('{')) {
      braceCount++;
    }
    
    if (line.includes('break;') && braceCount > 0) {
      newLines.push(line);
      newLines.push('}');
      braceCount--;
    } else {
      newLines.push(line);
    }
  }
  
  return newLines.join('\n');
}

// Main execution
const clientDir = path.join(__dirname, '..', 'client', 'src');
const tsFiles = findTsFiles(clientDir);

console.log(`Found ${tsFiles.length} TypeScript files`);

let totalFixed = 0;

for (const file of tsFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    let newContent = removeUnusedImports(content);
    newContent = replaceExplicitAny(newContent);
    newContent = fixEmptyObjectTypes(newContent);
    newContent = fixCaseDeclarations(newContent);
    
    if (newContent !== originalContent) {
      fs.writeFileSync(file, newContent);
      console.log(`Fixed: ${path.relative(process.cwd(), file)}`);
      totalFixed++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

console.log(`\nFixed ${totalFixed} files`); 