#!/usr/bin/env node

/**
 * Add ISR to remaining Server Components
 * Updates JSDoc and adds appropriate revalidation times
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Get all page.tsx files without "use client" or "revalidate"
const findCommand = `find ${process.cwd()}/src/app -name "page.tsx" -type f -exec grep -L "use client\\|revalidate" {} \\;`;

let files;
try {
  files = execSync(findCommand, { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);
} catch (error) {
  console.log("No files found to update");
  process.exit(0);
}

console.log(`Found ${files.length} Server Components without ISR\n`);

// Configure revalidation times by route pattern
const REVALIDATION_CONFIG = {
  // Real-time data - 5 minutes
  "/schedule": 300,
  "/customers": 300,
  "/jobs": 300,
  "/invoices": 300,
  "/work": 300,

  // Analytics and reports - 15 minutes
  "/analytics": 900,
  "/reports": 900,
  "/technicians": 900,

  // Settings - 1 hour (rarely changes)
  "/settings": 3600,
  "/pricebook": 3600,

  // Training and marketing - 1 hour
  "/training": 3600,
  "/marketing": 3600,
  "/inventory": 3600,

  // Default - 15 minutes
  default: 900,
};

function getRevalidationTime(filePath) {
  for (const [pattern, time] of Object.entries(REVALIDATION_CONFIG)) {
    if (pattern !== "default" && filePath.includes(pattern)) {
      return time;
    }
  }
  return REVALIDATION_CONFIG.default;
}

function getRevalidationComment(seconds) {
  if (seconds === 300) return "// Revalidate every 5 minutes";
  if (seconds === 900) return "// Revalidate every 15 minutes";
  if (seconds === 3600) return "// Revalidate every 1 hour";
  return `// Revalidate every ${seconds} seconds`;
}

let updatedCount = 0;

files.forEach((filePath) => {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Check if it's really a Server Component (no "use client")
    if (content.includes('"use client"') || content.includes("'use client'")) {
      return;
    }

    // Check if already has revalidate
    if (content.includes("export const revalidate")) {
      return;
    }

    const revalidateTime = getRevalidationTime(filePath);
    const revalidateComment = getRevalidationComment(revalidateTime);

    // Update JSDoc if it incorrectly says "Client Component"
    if (content.includes("Client Component")) {
      content = content.replace(
        /\/\*\*\s*\n\s*\*\s*(.+?)\s*-\s*Client Component\s*\n\s*\*\s*\n\s*\*\s*Client-side features:\s*\n\s*\*\s*-\s*.+?\n\s*\*\s*-\s*.+?\n\s*\*\s*-\s*.+?\n\s*\*\//,
        `/**
 * $1 - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */`
      );
    }

    // Find the first import or export statement
    const importMatch = content.match(/^(import .+?;\n)+/m);
    if (importMatch) {
      const insertPosition = importMatch[0].length;
      const beforeImports = content.slice(0, importMatch.index);
      const imports = importMatch[0];
      const afterImports = content.slice(insertPosition);

      // Add ISR export after imports
      content = `${beforeImports}${imports}\nexport const revalidate = ${revalidateTime}; ${revalidateComment}\n${afterImports}`;
    } else {
      // No imports, add before first export
      const exportMatch = content.match(/export (default |const |function )/);
      if (exportMatch) {
        const insertPosition = exportMatch.index;
        content =
          content.slice(0, insertPosition) +
          `export const revalidate = ${revalidateTime}; ${revalidateComment}\n\n` +
          content.slice(insertPosition);
      }
    }

    fs.writeFileSync(filePath, content);

    const relativePath = filePath.replace(process.cwd(), "");
    console.log(`✓ ${relativePath} (revalidate: ${revalidateTime}s)`);
    updatedCount++;
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
  }
});

console.log(`\n✓ Updated ${updatedCount} files`);
console.log("✓ All Server Components now have ISR configured");
