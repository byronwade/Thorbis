#!/usr/bin/env node

/**
 * Script to remove unused exports based on knip output
 * 
 * Usage: node scripts/remove-unused-exports.js
 * 
 * This script reads knip output and removes export keywords from unused functions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get knip output
console.log('Running knip to get unused exports...');
let knipOutput;
try {
  knipOutput = execSync('pnpm knip 2>&1', { encoding: 'utf-8', cwd: __dirname + '/..' });
} catch (error) {
  // Knip returns non-zero exit code when issues are found, but we still want the output
  knipOutput = error.stdout || error.toString();
}

// Parse unused exports
const unusedExports = [];
const lines = knipOutput.split('\n');
let inUnusedExports = false;

for (const line of lines) {
  if (line.includes('Unused exports')) {
    inUnusedExports = true;
    continue;
  }
  
  if (inUnusedExports && line.trim() === '') {
    break;
  }
  
  if (inUnusedExports && line.trim() && line.includes(':')) {
    // Match various formats:
    // "exportName function apps/path/file.ts:123:45"
    // "exportName apps/path/file.ts:123:45"
    // "exportName type apps/path/file.ts:123:45"
    // "exportName const apps/path/file.ts:123:45"
    const match = line.match(/^(\S+)(?:\s+(?:function|type|const|interface|class|enum))?\s+([^\s]+):(\d+):(\d+)/);
    if (match) {
      const [, name, file, lineNum] = match;
      unusedExports.push({
        name: name.trim(),
        file: file.trim(),
        line: parseInt(lineNum),
      });
    }
  }
}

console.log(`Found ${unusedExports.length} unused exports`);

// Group by file
const byFile = {};
for (const exp of unusedExports) {
  if (!byFile[exp.file]) {
    byFile[exp.file] = [];
  }
  byFile[exp.file].push(exp);
}

// Process each file
let processed = 0;
for (const [filePath, exports] of Object.entries(byFile)) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} (not found)`);
    continue;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');
    let modified = false;
    
    // Sort exports by line number (descending) to avoid line number shifts
    const sortedExports = [...exports].sort((a, b) => b.line - a.line);
    
    for (const exp of sortedExports) {
      const lineIndex = exp.line - 1;
      if (lineIndex >= 0 && lineIndex < lines.length) {
        const line = lines[lineIndex];
        // Remove export keyword (handle various formats)
        let newLine = line.replace(/^export\s+/, '');
        // Also handle "export type", "export interface", "export enum", "export const"
        newLine = newLine.replace(/^export\s+(type|interface|enum|const|function|class)\s+/, '$1 ');
        // Handle "export { name }" format
        if (line.includes(`export { ${exp.name} }`) || line.includes(`export {${exp.name}}`)) {
          // Remove the entire export statement if it's a single named export
          newLine = '';
        }
        if (newLine !== line) {
          lines[lineIndex] = newLine;
          modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(fullPath, lines.join('\n'), 'utf-8');
      processed++;
      console.log(`Processed ${filePath} (${exports.length} exports)`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

console.log(`\nProcessed ${processed} files`);

