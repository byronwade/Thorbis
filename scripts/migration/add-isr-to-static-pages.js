/**
 * Script to add ISR (Incremental Static Regeneration) to static dashboard pages
 *
 * This script:
 * 1. Finds all page.tsx files without "use client"
 * 2. Adds "export const revalidate = N" if missing
 * 3. Updates JSDoc comments to reflect Server Component status
 */

const fs = require("node:fs");
const path = require("node:path");
const glob = require("glob");

// Configure revalidation times by route pattern
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const FIVE_MINUTES = 5;
const FIFTEEN_MINUTES = 15;
const FIVE_MINUTES_SECONDS = FIVE_MINUTES * SECONDS_PER_MINUTE;
const FIFTEEN_MINUTES_SECONDS = FIFTEEN_MINUTES * SECONDS_PER_MINUTE;
const ONE_HOUR_SECONDS = SECONDS_PER_HOUR;

const CLIENT_COMPONENT_DOC_REGEX =
	/\/\*\*\s*\n\s*\*\s+.*? - Client Component\s*\n\s*\*\s*\n\s*\*\s+Client-side features:[\s\S]*?\*\//m;

const REVALIDATION_CONFIG = {
	// Real-time data - 5 minutes
	"/dashboard/jobs": FIVE_MINUTES_SECONDS,
	"/dashboard/schedule": FIVE_MINUTES_SECONDS,
	"/dashboard/customers": FIVE_MINUTES_SECONDS,
	"/dashboard/invoices": FIVE_MINUTES_SECONDS,
	"/dashboard/work": FIVE_MINUTES_SECONDS,
	"/dashboard/technicians": FIVE_MINUTES_SECONDS,
	"/dashboard/communication": FIVE_MINUTES_SECONDS,

	// Analytics and reports - 15 minutes
	"/dashboard/analytics": FIFTEEN_MINUTES_SECONDS,
	"/dashboard/reports": FIFTEEN_MINUTES_SECONDS,
	"/dashboard/finance": FIFTEEN_MINUTES_SECONDS,
	"/dashboard/marketing": FIFTEEN_MINUTES_SECONDS,

	// Settings - 1 hour (rarely changes)
	"/dashboard/settings": ONE_HOUR_SECONDS,
	"/dashboard/pricebook": ONE_HOUR_SECONDS,
	"/dashboard/training": ONE_HOUR_SECONDS,
	"/dashboard/inventory": ONE_HOUR_SECONDS,

	// Default - 5 minutes
	default: FIVE_MINUTES_SECONDS,
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
				CLIENT_COMPONENT_DOC_REGEX,
				`/**
 * ${path.basename(path.dirname(filePath))} Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 * - ISR revalidation every ${formatRevalidationDescription(revalidateTime)}
 */`,
			);
		}

		// Find the last import statement
		const importMatches = [...content.matchAll(/^import\s+.+?;$/gm)];
		if (importMatches.length === 0) {
			return { skipped: true, reason: "no imports found" };
		}

		const lastImport = importMatches.at(-1);
		if (!lastImport || lastImport.index === undefined) {
			return { skipped: true, reason: "unable to find import position" };
		}
		const insertPosition = lastImport.index + lastImport[0].length;

		// Insert revalidate export after imports
		const revalidateComment = buildRevalidateComment(revalidateTime);

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

	for (const file of files) {
		const result = processFile(path.join(process.cwd(), file));

		if (result.success) {
			results.processed.push(result);
		} else if (result.skipped) {
			results.skipped.push({ file, reason: result.reason });
		} else if (result.error) {
			results.errors.push(result);
		}
	}

	console.log("✅ Results:\n");
	console.log(`  Processed: ${results.processed.length} files`);
	console.log(`  Skipped: ${results.skipped.length} files`);
	console.log(`  Errors: ${results.errors.length} files`);

	if (results.processed.length > 0) {
		console.log("\n📝 Processed files:");
		for (const { file, revalidateTime } of results.processed) {
			console.log(`  ${file} (revalidate: ${revalidateTime}s)`);
		}
	}

	if (results.errors.length > 0) {
		console.log("\n❌ Errors:");
		for (const { file, message } of results.errors) {
			console.log(`  ${file}: ${message}`);
		}
	}
}

function formatRevalidationDescription(seconds) {
	if (seconds >= ONE_HOUR_SECONDS) {
		const hours = seconds / SECONDS_PER_HOUR;
		const suffix = hours > 1 ? "s" : "";
		return `${hours} hour${suffix}`;
	}

	const minutes = seconds / SECONDS_PER_MINUTE;
	return `${minutes} minutes`;
}

function buildRevalidateComment(seconds) {
	const description = formatRevalidationDescription(seconds);
	return `// Revalidate every ${description}`;
}

main();
