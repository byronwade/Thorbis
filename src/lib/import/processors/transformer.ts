/**
 * Data Transformer
 *
 * Applies field mappings and transformations to import data:
 * - Field mapping (source → target)
 * - Transformations (split, join, convert, lookup)
 * - Data normalization
 * - Relationship ID mapping
 */

import type {
	FieldMapping,
	RelationshipMap,
	TransformationType,
} from "@/types/import";
import { applyTransformation } from "../ai/field-mapping";

export class DataTransformer {
	private relationshipMap: RelationshipMap;

	constructor(relationshipMap?: RelationshipMap) {
		this.relationshipMap = relationshipMap || {
			customers: new Map(),
			properties: new Map(),
			jobs: new Map(),
			invoices: new Map(),
			equipment: new Map(),
			team: new Map(),
		};
	}

	/**
	 * Transform a batch of records using field mappings
	 */
	async transformBatch(
		records: Record<string, unknown>[],
		mappings: FieldMapping[],
	): Promise<Record<string, unknown>[]> {
		return records.map((record) => this.transformRecord(record, mappings));
	}

	/**
	 * Transform a single record
	 */
	transformRecord(
		sourceRecord: Record<string, unknown>,
		mappings: FieldMapping[],
	): Record<string, unknown> {
		const targetRecord: Record<string, unknown> = {};

		// Apply each field mapping
		for (const mapping of mappings) {
			const sourceValue = sourceRecord[mapping.sourceField];

			// Skip if source value is null/undefined and not required
			if (sourceValue == null && !mapping.required) {
				if (mapping.defaultValue !== undefined) {
					targetRecord[mapping.targetField] = mapping.defaultValue;
				}
				continue;
			}

			// Apply transformation
			const transformedValue = this.applyFieldTransformation(
				sourceValue,
				mapping.transformation,
				mapping.transformationParams,
			);

			// Special handling for split transformation (returns object)
			if (
				mapping.transformation === "split" &&
				typeof transformedValue === "object"
			) {
				Object.assign(targetRecord, transformedValue);
			} else {
				targetRecord[mapping.targetField] = transformedValue;
			}
		}

		// Normalize data
		return this.normalizeRecord(targetRecord);
	}

	/**
	 * Apply field transformation
	 */
	private applyFieldTransformation(
		value: unknown,
		transformation: TransformationType,
		params?: Record<string, unknown>,
	): unknown {
		return applyTransformation(value, transformation, params);
	}

	/**
	 * Normalize record data (emails, phones, etc.)
	 */
	private normalizeRecord(
		record: Record<string, unknown>,
	): Record<string, unknown> {
		const normalized = { ...record };

		// Normalize email
		if (normalized.email && typeof normalized.email === "string") {
			normalized.email = this.normalizeEmail(normalized.email);
		}

		// Normalize phone
		if (normalized.phone && typeof normalized.phone === "string") {
			normalized.phone = this.normalizePhone(normalized.phone);
		}

		// Normalize state
		if (normalized.state && typeof normalized.state === "string") {
			normalized.state = normalized.state.toUpperCase();
		}

		// Normalize ZIP
		if (normalized.zip && typeof normalized.zip === "string") {
			normalized.zip = this.normalizeZip(normalized.zip);
		}

		// Ensure arrays are arrays
		if (normalized.tags && typeof normalized.tags === "string") {
			normalized.tags = normalized.tags.split(",").map((t) => t.trim());
		}

		return normalized;
	}

	/**
	 * Map external IDs to Stratos UUIDs
	 */
	mapRelationshipIds(
		record: Record<string, unknown>,
		entityType: string,
	): Record<string, unknown> {
		const mapped = { ...record };

		// Store original external ID
		if (record.id) {
			mapped.external_id = String(record.id);
		}

		// Map foreign key relationships
		const relationshipFields: Record<string, keyof RelationshipMap> = {
			customer_id: "customers",
			property_id: "properties",
			job_id: "jobs",
			invoice_id: "invoices",
			equipment_id: "equipment",
			team_member_id: "team",
		};

		for (const [field, mapKey] of Object.entries(relationshipFields)) {
			if (record[field]) {
				const externalId = String(record[field]);
				const stratosId = this.relationshipMap[mapKey].get(externalId);

				if (stratosId) {
					mapped[field] = stratosId;
				} else {
					console.warn(
						`Warning: No mapping found for ${field}=${externalId} in ${entityType}`,
					);
					// Keep original value or set to null
					mapped[field] = null;
				}
			}
		}

		return mapped;
	}

	/**
	 * Update relationship map with new mapping
	 */
	addRelationshipMapping(
		entityType: keyof RelationshipMap,
		externalId: string,
		stratosId: string,
	): void {
		this.relationshipMap[entityType].set(externalId, stratosId);
	}

	/**
	 * Get relationship map
	 */
	getRelationshipMap(): RelationshipMap {
		return this.relationshipMap;
	}

	// ============================================================================
	// Normalization Helpers
	// ============================================================================

	private normalizeEmail(email: string): string {
		return email.toLowerCase().trim();
	}

	private normalizePhone(phone: string): string {
		// Remove all non-digit characters
		const digits = phone.replace(/\D/g, "");

		// Add country code if missing (assume US)
		if (digits.length === 10) {
			return `+1${digits}`;
		} else if (digits.length === 11 && digits.startsWith("1")) {
			return `+${digits}`;
		}

		return `+${digits}`;
	}

	private normalizeZip(zip: string): string {
		// Extract 5-digit ZIP or 5+4 format
		const match = zip.match(/(\d{5})(-?\d{4})?/);
		if (match) {
			return match[2] ? `${match[1]}-${match[2].replace("-", "")}` : match[1];
		}
		return zip;
	}

	/**
	 * Extract and normalize address components
	 */
	parseAddress(fullAddress: string): {
		address: string;
		city?: string;
		state?: string;
		zip?: string;
	} {
		// Simple address parser (can be enhanced with geocoding API)
		const parts = fullAddress.split(",").map((p) => p.trim());

		if (parts.length >= 3) {
			const [address, city, stateZip] = parts;
			const stateZipMatch = stateZip.match(/([A-Z]{2})\s*(\d{5}(-\d{4})?)/);

			if (stateZipMatch) {
				return {
					address,
					city,
					state: stateZipMatch[1],
					zip: stateZipMatch[2],
				};
			}
		}

		return { address: fullAddress };
	}

	/**
	 * Convert date formats
	 */
	convertDateFormat(
		dateString: string,
		targetFormat: "iso8601" | "date" | "datetime" = "iso8601",
	): string {
		const date = new Date(dateString);

		if (isNaN(date.getTime())) {
			throw new Error(`Invalid date: ${dateString}`);
		}

		switch (targetFormat) {
			case "iso8601":
				return date.toISOString();
			case "date":
				return date.toISOString().split("T")[0];
			case "datetime":
				return date.toISOString();
			default:
				return date.toISOString();
		}
	}

	/**
	 * Clean and sanitize text
	 */
	sanitizeText(text: string): string {
		return text
			.replace(/\x00/g, "") // Remove null bytes
			.replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
			.trim();
	}
}

/**
 * Batch transformation with progress tracking
 */
async function transformBatchWithProgress(
	records: Record<string, unknown>[],
	mappings: FieldMapping[],
	onProgress?: (processed: number, total: number) => void,
): Promise<Record<string, unknown>[]> {
	const transformer = new DataTransformer();
	const transformed: Record<string, unknown>[] = [];

	for (let i = 0; i < records.length; i++) {
		transformed.push(transformer.transformRecord(records[i], mappings));

		if (onProgress && i % 100 === 0) {
			onProgress(i + 1, records.length);
		}
	}

	if (onProgress) {
		onProgress(records.length, records.length);
	}

	return transformed;
}
