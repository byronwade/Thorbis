#!/usr/bin/env node

/**
 * Safe script to add usePageLayout configuration to dashboard pages
 * Includes validation, error handling, and rollback capabilities
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
  const lines = content.split("\n");
  // Check first 5 lines for "use client"
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (
      lines[i].includes('"use client"') ||
      lines[i].includes("'use client'")
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Add usePageLayout to a file safely
 */
function addLayoutConfigSafe(filePath) {
  // Read original content
  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;

  // Check if already has usePageLayout
  if (hasUsePageLayout(content)) {
    return { success: true, modified: false };
  }

  try {
    const lines = content.split("\n");
    let _modified = false;

    // Step 1: Add "use client" if not present
    if (!hasUseClient(content)) {
      lines.unshift('"use client";', "");
      _modified = true;
    }

    // Step 2: Add import if not present
    const hasImport = content.includes("usePageLayout");
    if (!hasImport) {
      // Find last import line
      let lastImportIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (
          trimmed.startsWith("import ") &&
          !trimmed.startsWith("import type")
        ) {
          lastImportIndex = i;
        }
      }

      if (lastImportIndex >= 0) {
        // Add after last import
        lines.splice(
          lastImportIndex + 1,
          0,
          'import { usePageLayout } from "@/hooks/use-page-layout";'
        );
      } else {
        // Find "use client" and add after it
        const useClientIndex = lines.findIndex((line) =>
          line.includes("use client")
        );
        if (useClientIndex >= 0) {
          lines.splice(
            useClientIndex + 2,
            0,
            'import { usePageLayout } from "@/hooks/use-page-layout";',
            ""
          );
        } else {
          // Add at top after any comments
          let insertIndex = 0;
          while (
            insertIndex < lines.length &&
            (lines[insertIndex].trim().startsWith("//") ||
              lines[insertIndex].trim().startsWith("/*") ||
              lines[insertIndex].trim() === "")
          ) {
            insertIndex++;
          }
          lines.splice(
            insertIndex,
            0,
            'import { usePageLayout } from "@/hooks/use-page-layout";',
            ""
          );
        }
      }
      _modified = true;
    }

    // Find export default function
    let functionStartIndex = -1;
    let functionOpenBraceIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("export default function")) {
        functionStartIndex = i;

        // Find opening brace - could be on same line or next line
        for (let j = i; j < Math.min(i + 3, lines.length); j++) {
          if (lines[j].includes("{")) {
            functionOpenBraceIndex = j;
            break;
          }
        }
        break;
      }
    }

    if (functionStartIndex === -1) {
      throw new Error('Could not find "export default function"');
    }

    if (functionOpenBraceIndex === -1) {
      throw new Error("Could not find opening brace of function");
    }

    // Insert usePageLayout after the opening brace
    const configLines = [
      "  usePageLayout({",
      '    maxWidth: "7xl",',
      '    padding: "md",',
      '    gap: "md",',
      "    showToolbar: true,",
      "    showSidebar: true,",
      "  });",
      "",
    ];

    lines.splice(functionOpenBraceIndex + 1, 0, ...configLines);
    _modified = true;

    // Reconstruct content
    content = lines.join("\n");

    // Validate the modified content
    if (!content.includes("usePageLayout")) {
      throw new Error(
        "Validation failed: usePageLayout not found in modified content"
      );
    }

    if (!content.includes("export default function")) {
      throw new Error(
        "Validation failed: export default function not found in modified content"
      );
    }

    // Write back to file
    fs.writeFileSync(filePath, content, "utf8");

    return { success: true, modified: true };
  } catch (error) {
    // Rollback - restore original content
    fs.writeFileSync(filePath, originalContent, "utf8");

    return { success: false, modified: false, error: error.message };
  }
}

/**
 * Recursively find all page.tsx files
 */
function findPageFiles(dir) {
  let results = [];

  try {
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
  } catch (_error) {}

  return results;
}

const dashboardDir = "src/app/(dashboard)/dashboard";
if (!fs.existsSync(dashboardDir)) {
  process.exit(1);
}

const pageFiles = findPageFiles(dashboardDir);
const results = {
  total: pageFiles.length,
  skipped: 0,
  alreadyConfigured: 0,
  modified: 0,
  errors: 0,
  errorFiles: [],
};

pageFiles.forEach((file) => {
  if (shouldSkip(file)) {
    results.skipped++;
    return;
  }

  const result = addLayoutConfigSafe(file);

  if (!result.success) {
    results.errors++;
    results.errorFiles.push({ file, error: result.error });
  } else if (result.modified) {
    results.modified++;
  } else {
    results.alreadyConfigured++;
  }
});

if (results.errors > 0) {
  results.errorFiles.forEach(({ file, error }) => {});
}

if (results.modified > 0) {
}

// Exit with error code if there were errors
process.exit(results.errors > 0 ? 1 : 0);
