/**
 * AI-Powered Format Detection Engine
 *
 * Uses Claude 3.5 Sonnet to intelligently detect:
 * - Source platform (ServiceTitan, Housecall Pro, Jobber, Generic)
 * - Entity type (customers, jobs, invoices, etc.)
 * - Data quality issues
 * - Suggested field mappings
 *
 * Target Accuracy: 95%+
 */

import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";
import type {
	DataQualityIssue,
	EntityType,
	FieldMapping,
	FormatDetectionResult,
	SupportedPlatform,
} from "@/types/import";

// Zod schema for format detection response
const FormatDetectionSchema = z.object({
	platform: z.enum(["servicetitan", "housecall", "jobber", "csv", "generic"]),
	confidence: z.number().min(0).max(1),
	entityType: z.enum([
		"customers",
		"jobs",
		"invoices",
		"estimates",
		"equipment",
		"properties",
		"team",
		"communications",
		"payments",
		"contracts",
	]),
	reasoning: z.string(),
	suggestedMappings: z.array(
		z.object({
			sourceField: z.string(),
			targetField: z.string(),
			transformation: z.enum([
				"direct",
				"split",
				"join",
				"convert",
				"lookup",
				"custom",
			]),
			confidence: z.number(),
			required: z.boolean(),
			transformationParams: z.record(z.unknown()).optional(),
		}),
	),
	qualityIssues: z.array(
		z.object({
			type: z.enum([
				"missing_required",
				"invalid_format",
				"duplicate",
				"outlier",
				"inconsistent",
			]),
			field: z.string(),
			count: z.number(),
			severity: z.enum(["low", "medium", "high", "critical"]),
			suggestion: z.string(),
		}),
	),
});

export interface DetectFormatOptions {
	headers: string[];
	sampleData: Record<string, unknown>[];
	fileName?: string;
	fileSize?: number;
	rowCount?: number;
}

/**
 * Detect file format and platform using AI
 */
export async function detectFormat(
	options: DetectFormatOptions,
): Promise<FormatDetectionResult> {
	const { headers, sampleData, fileName, fileSize, rowCount } = options;

	try {
		const prompt = buildFormatDetectionPrompt(
			headers,
			sampleData,
			fileName,
			fileSize,
			rowCount,
		);

		const { object } = await generateObject({
			model: anthropic("claude-3-5-sonnet-20241022"),
			schema: FormatDetectionSchema,
			prompt,
			temperature: 0.1, // Low temperature for consistent results
		});

		return {
			platform: object.platform as SupportedPlatform,
			confidence: object.confidence,
			entityType: object.entityType as EntityType,
			reasoning: object.reasoning,
			suggestedMappings: object.suggestedMappings.map((m) => ({
				sourceField: m.sourceField,
				targetField: m.targetField,
				transformation: m.transformation as any,
				transformationParams: m.transformationParams,
				confidence: m.confidence,
				required: m.required,
				validationRules: [],
				defaultValue: undefined,
			})),
			qualityIssues: object.qualityIssues.map((i) => ({
				type: i.type as any,
				field: i.field,
				count: i.count,
				severity: i.severity as any,
				suggestion: i.suggestion,
			})),
		};
	} catch (error) {
		console.error("AI format detection failed:", error);

		// Fallback to heuristic detection
		return fallbackDetection(options);
	}
}

/**
 * Build comprehensive prompt for Claude
 */
function buildFormatDetectionPrompt(
	headers: string[],
	sampleData: Record<string, unknown>[],
	fileName?: string,
	fileSize?: number,
	rowCount?: number,
): string {
	const sampleDataStr = JSON.stringify(sampleData.slice(0, 10), null, 2);

	return `You are an expert at analyzing field service management data exports. Analyze this CSV/data file and determine:

1. **Source Platform** - Which platform exported this data?
   - ServiceTitan: Look for fields like "jobNumber", "tenantId", "modifiedOn", nested address objects
   - Housecall Pro: Look for tab-separated format, "Customer Name", "Tags" (comma-separated)
   - Jobber: Look for "Client Name", "Property Notes", "Province" (Canadian)
   - Generic/CSV: Data doesn't match known platforms

2. **Entity Type** - What type of records does this file contain?
   - customers: Name, email, phone, address fields
   - jobs: Job number, status, technician, completion date
   - invoices: Invoice number, total, balance, due date
   - equipment: Equipment type, serial number, location
   - etc.

3. **Data Quality** - Identify issues:
   - Missing required fields (email, phone for customers)
   - Invalid formats (malformed emails, phone numbers)
   - Potential duplicates (similar names/emails)
   - Outliers (unusual values)
   - Inconsistencies (state/ZIP mismatches)

4. **Field Mappings** - Suggest mappings to Stratos schema:
   - Stratos Customer Schema:
     * first_name, last_name, display_name (REQUIRED)
     * email (REQUIRED)
     * phone (REQUIRED)
     * address, city, state, zip
     * type: 'residential' | 'commercial' | 'industrial'
     * tags: string[]
     * notes: string

   - Common transformations:
     * "Customer Name" → split to first_name + last_name
     * "Phone" → normalize to E.164 format
     * "Tags" (comma-separated string) → array of strings
     * "Address 1", "Address 2" → join to address field

## File Metadata
${fileName ? `File Name: ${fileName}` : ""}
${fileSize ? `File Size: ${fileSize} bytes` : ""}
${rowCount ? `Row Count: ${rowCount}` : ""}

## Headers
${headers.join(", ")}

## Sample Data (first 10 records)
${sampleDataStr}

## Instructions
Provide high-confidence analysis. If uncertain about platform, mark as 'generic'.
For field mappings, suggest transformations where needed (e.g., splitting full names).
Identify ALL data quality issues with severity and actionable suggestions.

Focus on:
1. Platform identification (95%+ confidence required for specific platform)
2. Practical field mappings that preserve data integrity
3. Critical quality issues that could cause import failures
4. Suggestions for fixing or handling problematic data

Your analysis will be used to:
- Auto-configure import settings
- Pre-validate data before import
- Suggest fixes to users
- Ensure high import success rates`;
}

/**
 * Fallback heuristic detection (if AI fails)
 */
function fallbackDetection(
	options: DetectFormatOptions,
): FormatDetectionResult {
	const { headers, sampleData } = options;

	// Simple heuristic based on headers
	let platform: SupportedPlatform = "generic";
	let entityType: EntityType = "customers";
	let confidence = 0.5;

	// Check for ServiceTitan patterns
	if (
		headers.some((h) => ["jobNumber", "tenantId", "modifiedOn"].includes(h))
	) {
		platform = "servicetitan";
		confidence = 0.8;
	}
	// Check for Housecall Pro patterns
	else if (headers.some((h) => ["Customer Name", "Created Date"].includes(h))) {
		platform = "housecall";
		confidence = 0.7;
	}
	// Check for Jobber patterns
	else if (headers.some((h) => ["Client Name", "Province"].includes(h))) {
		platform = "jobber";
		confidence = 0.7;
	}

	// Detect entity type
	if (headers.some((h) => ["jobNumber", "job_number", "status"].includes(h))) {
		entityType = "jobs";
	} else if (headers.some((h) => ["invoice", "total", "balance"].includes(h))) {
		entityType = "invoices";
	}

	// Basic field mappings
	const suggestedMappings: FieldMapping[] = headers.map((sourceField) => ({
		sourceField,
		targetField: sourceField.toLowerCase().replace(/\s+/g, "_"),
		transformation: "direct",
		confidence: 0.5,
		required: false,
	}));

	return {
		platform,
		confidence,
		entityType,
		reasoning: "Fallback heuristic detection (AI unavailable)",
		suggestedMappings,
		qualityIssues: [],
	};
}

/**
 * Validate detection result
 */
export function validateDetectionResult(result: FormatDetectionResult): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (result.confidence < 0.5) {
		errors.push("Confidence too low (< 50%)");
	}

	if (result.suggestedMappings.length === 0) {
		errors.push("No field mappings suggested");
	}

	// Check for required fields
	const requiredFields = ["email", "phone", "display_name", "name"];
	const mappedFields = result.suggestedMappings.map((m) =>
		m.targetField.toLowerCase(),
	);
	const hasRequiredField = requiredFields.some((rf) =>
		mappedFields.some((mf) => mf.includes(rf)),
	);

	if (!hasRequiredField) {
		errors.push("No required fields detected (email, phone, or name)");
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Get platform-specific templates to improve detection
 */
export function getPlatformTemplate(platform: SupportedPlatform): {
	name: string;
	commonHeaders: string[];
	identifyingFields: string[];
} {
	const templates = {
		servicetitan: {
			name: "ServiceTitan",
			commonHeaders: [
				"id",
				"name",
				"email",
				"phoneNumbers",
				"address",
				"modifiedOn",
				"createdOn",
			],
			identifyingFields: ["jobNumber", "tenantId", "businessUnitId"],
		},
		housecall: {
			name: "Housecall Pro",
			commonHeaders: [
				"Customer Name",
				"Email",
				"Phone",
				"Address",
				"City",
				"State",
				"ZIP",
				"Tags",
			],
			identifyingFields: ["Customer Name", "Created Date", "Tags"],
		},
		jobber: {
			name: "Jobber",
			commonHeaders: [
				"Client Name",
				"Email",
				"Phone",
				"Street",
				"City",
				"Province",
				"Postal Code",
			],
			identifyingFields: ["Client Name", "Province", "Property Notes"],
		},
		csv: {
			name: "Generic CSV",
			commonHeaders: [],
			identifyingFields: [],
		},
		generic: {
			name: "Generic Import",
			commonHeaders: [],
			identifyingFields: [],
		},
	};

	return templates[platform];
}
