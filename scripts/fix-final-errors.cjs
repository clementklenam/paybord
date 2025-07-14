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

// Function to remove unused variables and imports
function removeUnusedVariables(content) {
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip lines that are likely to be used
    if (line.includes('export ') || line.includes('import ') || line.includes('interface ') || line.includes('type ')) {
      newLines.push(line);
      continue;
    }
    
    // Remove unused variable declarations
    if (line.includes('const ') && line.includes('=') && !line.includes('//')) {
      const varMatch = line.match(/const\s+(\w+)\s*=/);
      if (varMatch) {
        const varName = varMatch[1];
        // Check if this variable is used elsewhere in the file
        const fileContent = content.replace(line, '');
        if (!fileContent.includes(varName)) {
          // Skip this line (remove unused variable)
          continue;
        }
      }
    }
    
    // Remove unused destructured variables
    if (line.includes('const {') && line.includes('}') && line.includes('=')) {
      const destructureMatch = line.match(/const\s*{([^}]+)}\s*=/);
      if (destructureMatch) {
        const vars = destructureMatch[1].split(',').map(v => v.trim());
        const usedVars = [];
        
        for (const v of vars) {
          const varName = v.split(':')[0].trim();
          const fileContent = content.replace(line, '');
          if (fileContent.includes(varName)) {
            usedVars.push(v);
          }
        }
        
        if (usedVars.length === 0) {
          // Skip this line (remove entire destructuring)
          continue;
        } else if (usedVars.length < vars.length) {
          // Keep only used variables
          const newLine = line.replace(destructureMatch[1], usedVars.join(', '));
          newLines.push(newLine);
          continue;
        }
      }
    }
    
    newLines.push(line);
  }
  
  return newLines.join('\n');
}

// Function to replace remaining any types
function replaceRemainingAny(content) {
  // Replace any remaining explicit any types
  content = content.replace(/: any/g, ': unknown');
  content = content.replace(/as any/g, 'as unknown');
  content = content.replace(/<any>/g, '<unknown>');
  
  return content;
}

// Function to fix empty interfaces
function fixEmptyInterfaces(content) {
  // Remove empty interface declarations
  content = content.replace(/interface\s+\w+\s*{\s*}\s*/g, '');
  
  return content;
}

// Function to fix ts-ignore comments
function fixTsIgnoreComments(content) {
  // Replace @ts-ignore with @ts-expect-error
  content = content.replace(/@ts-ignore/g, '@ts-expect-error');
  
  return content;
}

// Function to remove unused imports more aggressively
function removeUnusedImportsAggressive(content) {
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      newLines.push(lines[i]);
      continue;
    }
    
    if (line.startsWith('import ')) {
      // Check if this import is used
      const importMatch = line.match(/import\s*{([^}]+)}\s*from/);
      if (importMatch) {
        const imports = importMatch[1].split(',').map(imp => imp.trim());
        const usedImports = [];
        
        for (const imp of imports) {
          const importName = imp.split(' as ')[0].trim();
          const fileContent = content.replace(line, '');
          if (fileContent.includes(importName)) {
            usedImports.push(imp);
          }
        }
        
        if (usedImports.length > 0) {
          const newImport = line.replace(importMatch[1], usedImports.join(', '));
          newLines.push(newImport);
        }
        // Skip if no imports are used
      } else {
        // For default imports
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

// Main execution
const clientDir = path.join(__dirname, '..', 'client', 'src');
const tsFiles = findTsFiles(clientDir);

console.log(`Found ${tsFiles.length} TypeScript files`);

let totalFixed = 0;

for (const file of tsFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    let newContent = removeUnusedImportsAggressive(content);
    newContent = removeUnusedVariables(newContent);
    newContent = replaceRemainingAny(newContent);
    newContent = fixEmptyInterfaces(newContent);
    newContent = fixTsIgnoreComments(newContent);
    
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