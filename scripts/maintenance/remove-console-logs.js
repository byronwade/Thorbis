#!/usr/bin/env node

/**
 * Remove console.log statements from Server Action files
 * Complies with CLAUDE.md line 294: "No `console`"
 */

const fs = require("node:fs");
const path = require("node:path");
const CONSOLE_STATEMENT_REGEX = /^\s*console\.(log|warn|error|debug)\(/;

const files = ["src/actions/team.ts", "src/actions/company.ts", "src/actions/settings.ts", "src/actions/customers.ts"];

for (const filePath of files) {
	const fullPath = path.join(process.cwd(), filePath);

	if (!fs.existsSync(fullPath)) {
		console.log(`Skipping ${filePath} - file not found`);
		continue;
	}

	const content = fs.readFileSync(fullPath, "utf8");
	const lines = content.split("\n");
	const newLines = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Skip lines that are only console.log statements
		if (CONSOLE_STATEMENT_REGEX.test(line)) {
			// Check if statement continues on next line
			if (!line.includes(");")) {
				// Multi-line console statement - skip until we find the closing
				while (i < lines.length - 1 && !lines[i].includes(");")) {
					i++;
				}
			}
			continue;
		}

		newLines.push(line);
	}

	const newContent = newLines.join("\n");

	if (newContent !== content) {
		fs.writeFileSync(fullPath, newContent);
		console.log(`✓ Removed console statements from ${filePath}`);
	} else {
		console.log(`- No changes needed for ${filePath}`);
	}
}

console.log("\nDone! All console statements removed.");
