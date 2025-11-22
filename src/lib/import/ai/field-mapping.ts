/**
 * AI-Powered Field Mapping Engine
 *
 * Uses Claude to intelligently map source fields to target schema
 * Handles:
 * - Semantic field matching ("Client" → "Customer")
 * - Complex transformations (split, join, convert)
 * - Data type conversion
 * - Validation rules
 *
 * Target Accuracy: 95%+
 */

import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";
import type {
	FieldMapping,
	SchemaField,
	TransformationType,
	ValidationRule,
} from "@/types/import";

const FieldMappingSchema = z.object({
	mappings: z.array(
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
			confidence: z.number().min(0).max(1),
			required: z.boolean(),
			transformationParams: z.record(z.unknown()).optional(),
			reasoning: z.string().optional(),
		}),
	),
});

export interface SuggestMappingsOptions {
	sourceFields: { name: string; sampleValues: unknown[] }[];
	targetSchema: SchemaField[];
	entityType: string;
	platform?: string;
}

/**
 * Generate AI-powered field mapping suggestions
 */
export async function suggestFieldMappings(
	options: SuggestMappingsOptions,
): Promise<FieldMapping[]> {
	const { sourceFields, targetSchema, entityType, platform } = options;

	try {
		const prompt = buildFieldMappingPrompt(
			sourceFields,
			targetSchema,
			entityType,
			platform,
		);

		const { object } = await generateObject({
			model: anthropic("claude-3-5-sonnet-20241022"),
			schema: FieldMappingSchema,
			prompt,
			temperature: 0.1,
		});

		return object.mappings.map((m) => ({
			sourceField: m.sourceField,
			targetField: m.targetField,
			transformation: m.transformation as TransformationType,
			transformationParams: m.transformationParams,
			confidence: m.confidence,
			required: m.required,
			validationRules: generateValidationRules(m.targetField, targetSchema),
		}));
	} catch (error) {
		console.error("AI field mapping failed:", error);
		return fallbackFieldMapping(sourceFields, targetSchema);
	}
}

function buildFieldMappingPrompt(
	sourceFields: { name: string; sampleValues: unknown[] }[],
	targetSchema: SchemaField[],
	entityType: string,
	platform?: string,
): string {
	const sourceFieldsStr = sourceFields
		.map((f) => `- ${f.name}: ${f.sampleValues.slice(0, 3).join(", ")}`)
		.join("\n");

	const targetSchemaStr = targetSchema
		.map(
			(f) =>
				`- ${f.name} (${f.type}) ${f.required ? "[REQUIRED]" : "[OPTIONAL]"}: ${f.description || ""}`,
		)
		.join("\n");

	return `You are mapping ${entityType} fields from ${platform || "an unknown platform"} to the Stratos schema.

## Source Fields
${sourceFieldsStr}

## Target Schema (Stratos)
${targetSchemaStr}

## Mapping Rules
1. **Exact Matches**: Map fields with identical or very similar names
2. **Semantic Matches**: Map fields with same meaning but different names
   - "Client" → "customer"
   - "Contact" → "customer"
   - "Full Name" → "display_name"
   - "Phone Number" → "phone"

3. **Transformations**:
   - **direct**: 1:1 mapping, no transformation
   - **split**: Split one field into multiple (e.g., "Full Name" → first_name + last_name)
   - **join**: Combine multiple fields into one (e.g., "Address 1" + "Address 2" → address)
   - **convert**: Type conversion (e.g., string → number, date format changes)
   - **lookup**: Map value through lookup table (e.g., "Active" → type: "active")

4. **Requirements**:
   - ALL required target fields MUST be mapped
   - Prefer higher confidence mappings
   - Provide reasoning for non-obvious mappings
   - Include transformation parameters when needed

## Transformation Parameters Examples
- split: {"delimiter": " ", "parts": ["first_name", "last_name"]}
- join: {"fields": ["address_1", "address_2"], "delimiter": " "}
- convert: {"from": "string", "to": "number"}
- lookup: {"map": {"Active": "active", "Inactive": "inactive"}}

Provide high-confidence mappings that preserve data integrity.`;
}

/**
 * Fallback heuristic mapping
 */
function fallbackFieldMapping(
	sourceFields: { name: string; sampleValues: unknown[] }[],
	targetSchema: SchemaField[],
): FieldMapping[] {
	const mappings: FieldMapping[] = [];

	for (const source of sourceFields) {
		const sourceLower = source.name.toLowerCase().replace(/[^a-z0-9]/g, "");

		// Find exact or partial match
		const target = targetSchema.find((t) => {
			const targetLower = t.name.toLowerCase().replace(/[^a-z0-9]/g, "");
			return (
				targetLower === sourceLower ||
				targetLower.includes(sourceLower) ||
				sourceLower.includes(targetLower)
			);
		});

		if (target) {
			mappings.push({
				sourceField: source.name,
				targetField: target.name,
				transformation: "direct",
				confidence: 0.7,
				required: target.required,
			});
		}
	}

	return mappings;
}

/**
 * Generate validation rules based on target field
 */
function generateValidationRules(
	targetField: string,
	targetSchema: SchemaField[],
): ValidationRule[] {
	const field = targetSchema.find((f) => f.name === targetField);
	if (!field) return [];

	const rules: ValidationRule[] = [];

	// Email validation
	if (field.name.includes("email")) {
		rules.push({
			type: "regex",
			value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
			message: "Invalid email format",
		});
	}

	// Phone validation
	if (field.name.includes("phone")) {
		rules.push({
			type: "regex",
			value: /^\+?[1-9]\d{1,14}$/,
			message: "Invalid phone number (use E.164 format)",
		});
	}

	// ZIP code validation
	if (field.name.includes("zip") || field.name.includes("postal")) {
		rules.push({
			type: "regex",
			value: /^\d{5}(-\d{4})?$/,
			message: "Invalid ZIP code",
		});
	}

	// Required field
	if (field.required) {
		rules.push({
			type: "custom",
			value: (v: unknown) => v != null && v !== "",
			message: `${field.name} is required`,
		});
	}

	return rules;
}

/**
 * Validate a field mapping
 */
function validateMapping(
	mapping: FieldMapping,
	sourceData: Record<string, unknown>,
): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	// Check if source field exists
	if (!(mapping.sourceField in sourceData)) {
		errors.push(`Source field "${mapping.sourceField}" not found in data`);
	}

	// Run validation rules
	if (mapping.validationRules) {
		const value = sourceData[mapping.sourceField];

		for (const rule of mapping.validationRules) {
			switch (rule.type) {
				case "regex":
					if (
						typeof value === "string" &&
						!(rule.value as RegExp).test(value)
					) {
						errors.push(rule.message);
					}
					break;

				case "custom":
					if (typeof rule.value === "function" && !rule.value(value)) {
						errors.push(rule.message);
					}
					break;
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Apply transformation to a field value
 */
export function applyTransformation(
	value: unknown,
	transformation: TransformationType,
	params?: Record<string, unknown>,
): unknown {
	switch (transformation) {
		case "direct":
			return value;

		case "split":
			if (typeof value === "string" && params) {
				const delimiter = (params.delimiter as string) || " ";
				const parts = value.split(delimiter);
				const targetParts = params.parts as string[];

				const result: Record<string, string> = {};
				targetParts.forEach((part, index) => {
					result[part] = parts[index] || "";
				});
				return result;
			}
			return value;

		case "join":
			if (params && params.fields && Array.isArray(params.fields)) {
				const delimiter = (params.delimiter as string) || " ";
				const values = (params.fields as string[])
					.map((f) =>
						value && typeof value === "object" ? (value as any)[f] : "",
					)
					.filter(Boolean);
				return values.join(delimiter);
			}
			return value;

		case "convert":
			if (params) {
				const toType = params.to as string;

				if (toType === "number") {
					return typeof value === "string" ? parseFloat(value) : value;
				}
				if (toType === "string") {
					return String(value);
				}
				if (toType === "boolean") {
					return value === "true" || value === true || value === 1;
				}
				if (toType === "date") {
					return new Date(value as string);
				}
			}
			return value;

		case "lookup":
			if (params && params.map) {
				const lookupMap = params.map as Record<string, unknown>;
				return lookupMap[String(value)] || value;
			}
			return value;

		default:
			return value;
	}
}

/**
 * Calculate mapping similarity score
 */
function calculateMappingSimilarity(
	sourceField: string,
	targetField: string,
): number {
	const source = sourceField.toLowerCase().replace(/[^a-z0-9]/g, "");
	const target = targetField.toLowerCase().replace(/[^a-z0-9]/g, "");

	// Exact match
	if (source === target) return 1.0;

	// Contains match
	if (source.includes(target) || target.includes(source)) return 0.8;

	// Levenshtein distance
	const distance = levenshteinDistance(source, target);
	const maxLen = Math.max(source.length, target.length);
	return 1 - distance / maxLen;
}

function levenshteinDistance(a: string, b: string): number {
	const matrix: number[][] = [];

	for (let i = 0; i <= b.length; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= a.length; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1,
					matrix[i][j - 1] + 1,
					matrix[i - 1][j] + 1,
				);
			}
		}
	}

	return matrix[b.length][a.length];
}
