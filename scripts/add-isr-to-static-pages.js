/**
 * Script to add ISR (Incremental Static Regeneration) to static dashboard pages
 *
 * This script:
 * 1. Finds all page.tsx files without "use client"
 * 2. Adds "export const revalidate = N" if missing
 * 3. Updates JSDoc comments to reflect Server Component status
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Configure revalidation times by route pattern
const REVALIDATION_CONFIG = {
  // Real-time data - 5 minutes
  "/dashboard/jobs": 300,
  "/dashboard/schedule": 300,
  "/dashboard/customers": 300,
  "/dashboard/invoices": 300,
  "/dashboard/work": 300,
  "/dashboard/technicians": 300,
  "/dashboard/communication": 300,

  // Analytics and reports - 15 minutes
  "/dashboard/analytics": 900,
  "/dashboard/reports": 900,
  "/dashboard/finance": 900,
  "/dashboard/marketing": 900,

  // Settings - 1 hour (rarely changes)
  "/dashboard/settings": 3600,
  "/dashboard/pricebook": 3600,
  "/dashboard/training": 3600,
  "/dashboard/inventory": 3600,

  // Default - 5 minutes
  default: 300,
};

function getRevalidateTime(filePath) {
  for (const [pattern, time] of Object.entries(REVALIDATION_CONFIG)) {
    if (pattern !== "default" && filePath.includes(pattern)) {
      return time;
    }
  }
  return REVALIDATION_CONFIG.default;
}

function shouldProcessFile(content, filePath) {
  // Skip if already has "use client"
  if (content.includes('"use client"') || content.includes("'use client'")) {
    return false;
  }

  // Skip if already has revalidate
  if (content.includes("export const revalidate")) {
    return false;
  }

  // Skip test files
  if (filePath.includes("test-")) {
    return false;
  }

  return true;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    if (!shouldProcessFile(content, filePath)) {
      return {
        skipped: true,
        reason: "already configured or client component",
      };
    }

    const revalidateTime = getRevalidateTime(filePath);

    // Replace Client Component JSDoc with Server Component JSDoc
    if (content.includes("* Client Component")) {
      content = content.replace(
        /\/\*\*\s*\n\s*\*\s+.*? - Client Component\s*\n\s*\*\s*\n\s*\*\s+Client-side features:[\s\S]*?\*\//m,
        `/**
 * ${path.basename(path.dirname(filePath))} Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 * - ISR revalidation every ${revalidateTime >= 3600 ? `${revalidateTime / 3600} hour${revalidateTime > 3600 ? "s" : ""}` : `${revalidateTime / 60} minutes`}
 */`
      );
    }

    // Find the last import statement
    const importMatches = [...content.matchAll(/^import\s+.+?;$/gm)];
    if (importMatches.length === 0) {
      return { skipped: true, reason: "no imports found" };
    }

    const lastImport = importMatches[importMatches.length - 1];
    const insertPosition = lastImport.index + lastImport[0].length;

    // Insert revalidate export after imports
    const revalidateComment =
      revalidateTime >= 3600
        ? `// Revalidate every ${revalidateTime / 3600} hour${revalidateTime > 3600 ? "s" : ""}`
        : `// Revalidate every ${revalidateTime / 60} minutes`;

    const newContent =
      content.slice(0, insertPosition) +
      `\n\nexport const revalidate = ${revalidateTime}; ${revalidateComment}` +
      content.slice(insertPosition);

    fs.writeFileSync(filePath, newContent, "utf8");

    return {
      success: true,
      revalidateTime,
      file: filePath.replace(process.cwd(), ""),
    };
  } catch (error) {
    return { error: true, message: error.message, file: filePath };
  }
}

function main() {
  console.log("🔍 Finding static dashboard pages...\n");

  const files = glob.sync("src/app/(dashboard)/dashboard/**/page.tsx", {
    cwd: process.cwd(),
  });

  console.log(`Found ${files.length} page files\n`);

  const results = {
    processed: [],
    skipped: [],
    errors: [],
  };

  files.forEach((file) => {
    const result = processFile(path.join(process.cwd(), file));

    if (result.success) {
      results.processed.push(result);
    } else if (result.skipped) {
      results.skipped.push({ file, reason: result.reason });
    } else if (result.error) {
      results.errors.push(result);
    }
  });

  console.log("✅ Results:\n");
  console.log(`  Processed: ${results.processed.length} files`);
  console.log(`  Skipped: ${results.skipped.length} files`);
  console.log(`  Errors: ${results.errors.length} files`);

  if (results.processed.length > 0) {
    console.log("\n📝 Processed files:");
    results.processed.forEach(({ file, revalidateTime }) => {
      console.log(`  ${file} (revalidate: ${revalidateTime}s)`);
    });
  }

  if (results.errors.length > 0) {
    console.log("\n❌ Errors:");
    results.errors.forEach(({ file, message }) => {
      console.log(`  ${file}: ${message}`);
    });
  }
}

main();
