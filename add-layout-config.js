#!/usr/bin/env node

/**
 * Script to add usePageLayout configuration to all dashboard pages
 * that don't already have it configured.
 */

const fs = require("node:fs");
const path = require("node:path");

// Pages to skip (already configured)
const SKIP_PAGES = [
  "src/app/(dashboard)/dashboard/page.tsx",
  "src/app/(dashboard)/dashboard/communication/page.tsx",
  "src/app/(dashboard)/dashboard/ai/page.tsx",
  "src/app/(dashboard)/dashboard/test-full-width/page.tsx",
  "src/app/(dashboard)/dashboard/test-layout/page.tsx",
];

// Default configuration to add
const USE_PAGE_LAYOUT_CONFIG = `  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
    showSidebar: true,
  });
`;

const USE_PAGE_LAYOUT_IMPORT =
  'import { usePageLayout } from "@/hooks/use-page-layout";';

/**
 * Check if file should be skipped
 */
function shouldSkip(filePath) {
  return SKIP_PAGES.some((skip) => filePath.includes(skip));
}

/**
 * Check if file already has usePageLayout
 */
function hasUsePageLayout(content) {
  return content.includes("usePageLayout");
}

/**
 * Check if file has "use client" directive
 */
function hasUseClient(content) {
  return content.includes('"use client"') || content.includes("'use client'");
}

/**
 * Add usePageLayout to a file
 */
function addLayoutConfig(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Check if already has usePageLayout
  if (hasUsePageLayout(content)) {
    return false;
  }

  // Step 1: Add "use client" if not present
  if (!hasUseClient(content)) {
    content = `"use client";\n\n${content}`;
  }

  // Step 2: Add import if not present
  if (!content.includes(USE_PAGE_LAYOUT_IMPORT)) {
    // Find the last import statement
    const lines = content.split("\n");
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("import ")) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex >= 0) {
      // Add after last import
      lines.splice(lastImportIndex + 1, 0, USE_PAGE_LAYOUT_IMPORT);
      content = lines.join("\n");
    } else {
      // No imports found, add after "use client"
      const useClientIndex = lines.findIndex((line) =>
        line.includes("use client")
      );
      if (useClientIndex >= 0) {
        lines.splice(useClientIndex + 1, 0, "", USE_PAGE_LAYOUT_IMPORT);
        content = lines.join("\n");
      }
    }
  }

  // Step 3: Add usePageLayout call inside the component function
  // Find "export default function" line
  const exportDefaultRegex = /export default function\s+\w+\([^)]*\)\s*\{/;
  const match = content.match(exportDefaultRegex);

  if (!match) {
    return false;
  }

  // Insert usePageLayout after the opening brace
  const insertPosition = match.index + match[0].length;
  content =
    content.slice(0, insertPosition) +
    "\n" +
    USE_PAGE_LAYOUT_CONFIG +
    "\n" +
    content.slice(insertPosition);

  // Write back to file
  fs.writeFileSync(filePath, content, "utf8");
  return true;
}

/**
 * Recursively find all page.tsx files
 */
function findPageFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat?.isDirectory()) {
      results = results.concat(findPageFiles(filePath));
    } else if (file === "page.tsx") {
      results.push(filePath);
    }
  });

  return results;
}

const dashboardDir = "src/app/(dashboard)/dashboard";
if (!fs.existsSync(dashboardDir)) {
  process.exit(1);
}

const pageFiles = findPageFiles(dashboardDir);
let _processed = 0;
let _skipped = 0;
let _modified = 0;

pageFiles.forEach((file) => {
  if (shouldSkip(file)) {
    _skipped++;
    return;
  }

  try {
    const wasModified = addLayoutConfig(file);
    _processed++;
    if (wasModified) {
      _modified++;
    }
  } catch (_error) {}
});
