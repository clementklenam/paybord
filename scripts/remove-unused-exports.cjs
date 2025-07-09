const fs = require('fs');
const path = require('path');

const REPORT_FILE = 'ts-prune-report.txt';

function removeExportFromFile(filePath, exportName) {
  const absPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absPath)) {
    console.warn(`File not found: ${absPath}`);
    return;
  }
  let content = fs.readFileSync(absPath, 'utf8');
  // Remove named export (function, const, class, type, interface, etc.)
  // Handles: export const X, export function X, export class X, export type X, export interface X
  const exportRegex = new RegExp(
    `export\\s+(const|function|class|type|interface)\\s+${exportName}\\b[^{;]*[^{;]*[;{]`,
    'g'
  );
  // Remove export { X } or export { X as Y }
  const namedExportRegex = new RegExp(
    `export\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}\\s*;?`,
    'g'
  );
  // Remove default export
  const defaultExportRegex = new RegExp(
    `export\\s+default\\s+${exportName}\\b`,
    'g'
  );
  let newContent = content
    .replace(exportRegex, '')
    .replace(namedExportRegex, '')
    .replace(defaultExportRegex, '');
  if (newContent !== content) {
    fs.writeFileSync(absPath, newContent, 'utf8');
    console.log(`Removed export '${exportName}' from ${filePath}`);
  }
}

function main() {
  const lines = fs.readFileSync(REPORT_FILE, 'utf8').split('\n');
  for (const line of lines) {
    if (!line.trim() || line.includes('(used in module)')) continue;
    // Example: client/src/services/product.service.ts:200 - generateDemoProducts
    const match = line.match(/^(.*?):\d+ - (\w+)/);
    if (!match) continue;
    const [, filePath, exportName] = match;
    removeExportFromFile(filePath, exportName);
  }
  console.log('Unused exports removal complete.');
}

main(); 