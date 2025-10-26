#!/usr/bin/env node

/**
 * Script to fix broken import statements caused by linter
 */

const fs = require("fs");
const path = require("path");

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Pattern: import { followed by import { on next line
  // This happens when the linter breaks the import statement
  const brokenPattern =
    /import\s*{\s*\nimport\s*\n{\s*\n\s*usePageLayout;\s*\n}\s*\nfrom;\s*\n\("@\/hooks\/use-page-layout"\);/g;

  if (brokenPattern.test(content)) {
    console.log(`Fixing: ${filePath}`);

    // Find all imports in the file
    const lines = content.split("\n");
    const fixed = [];
    let skipUntil = -1;

    for (let i = 0; i < lines.length; i++) {
      if (i < skipUntil) {
        continue; // Skip lines that are part of broken import
      }

      const line = lines[i];

      // Check if this is the start of a broken import
      if (
        line.trim() === "import {" &&
        i + 1 < lines.length &&
        lines[i + 1].trim() === "import"
      ) {
        // Found broken import, reconstruct it
        console.log(`  Found broken import at line ${i + 1}`);

        // Find the usePageLayout import
        let hasUsePageLayout = false;
        let j = i;
        while (j < lines.length && j < i + 10) {
          if (lines[j].includes("usePageLayout")) {
            hasUsePageLayout = true;
            break;
          }
          j++;
        }

        // Find the end of the first import (the Card import)
        let endOfFirstImport = i;
        let braceCount = 1;
        for (let k = i + 1; k < lines.length; k++) {
          const l = lines[k];
          if (l.includes("{")) braceCount++;
          if (l.includes("}")) braceCount--;

          if (braceCount === 0 && l.includes("from")) {
            endOfFirstImport = k;
            break;
          }
        }

        // Skip to after the broken import
        skipUntil = endOfFirstImport + 10;

        // Add the corrected imports
        fixed.push("import {");

        // Find the import items from the first import
        for (let k = i + 1; k <= endOfFirstImport; k++) {
          const l = lines[k].trim();
          if (
            l &&
            !l.startsWith("import") &&
            !l.startsWith("from") &&
            !l.startsWith("(") &&
            !l.includes("usePageLayout") &&
            l !== "{" &&
            l !== "}" &&
            l !== ";" &&
            l !== "from;" &&
            l !== '("@/hooks/use-page-layout");'
          ) {
            fixed.push(`  ${l}`);
          }
        }

        fixed.push('} from "@/components/ui/card";');

        if (hasUsePageLayout) {
          fixed.push(
            'import { usePageLayout } from "@/hooks/use-page-layout";'
          );
        }

        continue;
      }

      // Not a broken import, keep the line
      fixed.push(line);
    }

    content = fixed.join("\n");

    // Write fixed content
    fs.writeFileSync(filePath, content, "utf8");
    console.log("  ✓ Fixed");
    return true;
  }

  return false;
}

function findPageFiles(dir) {
  let results = [];

  try {
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat && stat.isDirectory()) {
        results = results.concat(findPageFiles(filePath));
      } else if (file === "page.tsx") {
        results.push(filePath);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return results;
}

// Main execution
console.log("Finding and fixing broken imports in dashboard pages...\n");

const dashboardDir = "src/app/(dashboard)/dashboard";
const pageFiles = findPageFiles(dashboardDir);

let fixed = 0;

pageFiles.forEach((file) => {
  if (fixImports(file)) {
    fixed++;
  }
});

console.log(`\n✓ Fixed ${fixed} files with broken imports`);
console.log("\nRunning linter to format...");
