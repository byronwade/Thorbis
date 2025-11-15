#!/usr/bin/env node

/**
 * Add ISR to remaining Server Components
 * Updates JSDoc and adds appropriate revalidation times
 */

const fs = require("node:fs");
const { execSync } = require("node:child_process");

// Get all page.tsx files without "use client" or "revalidate"
const findCommand = `find ${process.cwd()}/src/app -name "page.tsx" -type f -exec grep -L "use client\\|revalidate" {} \\;`;

let files;
try {
  files = execSync(findCommand, { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);
} catch (_error) {
  console.log("No files found to update");
  process.exit(0);
}

console.log(`Found ${files.length} Server Components without ISR\n`);

// Configure revalidation times by route pattern
const FIVE_MINUTES_SECONDS = 300;
const FIFTEEN_MINUTES_SECONDS = 900;
const ONE_HOUR_SECONDS = 3600;

const REVALIDATION_CONFIG = {
  // Real-time data - 5 minutes
  "/schedule": FIVE_MINUTES_SECONDS,
  "/customers": FIVE_MINUTES_SECONDS,
  "/jobs": FIVE_MINUTES_SECONDS,
  "/invoices": FIVE_MINUTES_SECONDS,
  "/work": FIVE_MINUTES_SECONDS,

  // Analytics and reports - 15 minutes
  "/analytics": FIFTEEN_MINUTES_SECONDS,
  "/reports": FIFTEEN_MINUTES_SECONDS,
  "/technicians": FIFTEEN_MINUTES_SECONDS,

  // Settings - 1 hour (rarely changes)
  "/settings": ONE_HOUR_SECONDS,
  "/pricebook": ONE_HOUR_SECONDS,

  // Training and marketing - 1 hour
  "/training": ONE_HOUR_SECONDS,
  "/marketing": ONE_HOUR_SECONDS,
  "/inventory": ONE_HOUR_SECONDS,

  // Default - 15 minutes
  default: FIFTEEN_MINUTES_SECONDS,
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
  if (seconds === FIVE_MINUTES_SECONDS) {
    return "// Revalidate every 5 minutes";
  }
  if (seconds === FIFTEEN_MINUTES_SECONDS) {
    return "// Revalidate every 15 minutes";
  }
  if (seconds === ONE_HOUR_SECONDS) {
    return "// Revalidate every 1 hour";
  }
  return `// Revalidate every ${seconds} seconds`;
}

let updatedCount = 0;

for (const filePath of files) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Check if it's really a Server Component (no "use client")
    if (content.includes('"use client"') || content.includes("'use client'")) {
      continue;
    }

    // Check if already has revalidate
    if (content.includes("export const revalidate")) {
      continue;
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
}

console.log(`\n✓ Updated ${updatedCount} files`);
console.log("✓ All Server Components now have ISR configured");
