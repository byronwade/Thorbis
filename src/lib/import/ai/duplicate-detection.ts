/**
 * Fuzzy Duplicate Detection Engine
 *
 * Uses multiple algorithms to detect potential duplicates:
 * - Email exact match (high confidence)
 * - Phone number similarity (normalized)
 * - Name similarity (Levenshtein distance)
 * - Address similarity (geocoding + fuzzy match)
 *
 * Target Accuracy: 95%+ true positive rate
 */

import type { DuplicateGroup } from "@/types/import";

export interface DuplicateDetectionOptions {
	emailWeight?: number; // Default: 30
	phoneWeight?: number; // Default: 20
	nameWeight?: number; // Default: 25
	addressWeight?: number; // Default: 15
	cityZipWeight?: number; // Default: 10
	similarityThreshold?: number; // Default: 0.85 (85%)
}

export interface Customer {
	id?: string;
	first_name?: string;
	last_name?: string;
	display_name?: string;
	email?: string;
	phone?: string;
	address?: string;
	city?: string;
	state?: string;
	zip?: string;
	company_name?: string;
}

const DEFAULT_OPTIONS: Required<DuplicateDetectionOptions> = {
	emailWeight: 30,
	phoneWeight: 20,
	nameWeight: 25,
	addressWeight: 15,
	cityZipWeight: 10,
	similarityThreshold: 0.85,
};

/**
 * Detect duplicate records using fuzzy matching
 */
export function detectDuplicates(
	records: Customer[],
	options: DuplicateDetectionOptions = {},
): DuplicateGroup[] {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	const duplicateGroups: DuplicateGroup[] = [];
	const processedPairs = new Set<string>();

	for (let i = 0; i < records.length; i++) {
		for (let j = i + 1; j < records.length; j++) {
			const pairKey = `${i}-${j}`;
			if (processedPairs.has(pairKey)) continue;

			const similarity = calculateSimilarity(records[i], records[j], opts);

			if (similarity >= opts.similarityThreshold) {
				const matchingFields = getMatchingFields(records[i], records[j]);

				// Check if either record is already in a group
				let group = duplicateGroups.find(
					(g) => g.recordIndices.includes(i) || g.recordIndices.includes(j),
				);

				if (group) {
					// Add to existing group
					if (!group.recordIndices.includes(i)) group.recordIndices.push(i);
					if (!group.recordIndices.includes(j)) group.recordIndices.push(j);

					// Update similarity (average)
					group.similarity = (group.similarity + similarity) / 2;

					// Merge matching fields
					matchingFields.forEach((field) => {
						if (!group.matchingFields.includes(field)) {
							group.matchingFields.push(field);
						}
					});
				} else {
					// Create new group
					group = {
						key: `duplicate-${duplicateGroups.length + 1}`,
						recordIndices: [i, j],
						similarity,
						matchingFields,
						recommendation: determineRecommendation(similarity, matchingFields),
					};
					duplicateGroups.push(group);
				}

				processedPairs.add(pairKey);
			}
		}
	}

	// Sort by similarity (highest first)
	return duplicateGroups.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Calculate similarity score between two records
 */
function calculateSimilarity(
	a: Customer,
	b: Customer,
	options: Required<DuplicateDetectionOptions>,
): number {
	let score = 0;
	let maxScore = 0;

	// Email exact match (highest weight)
	if (a.email && b.email) {
		maxScore += options.emailWeight;
		if (normalizeEmail(a.email) === normalizeEmail(b.email)) {
			score += options.emailWeight;
		}
	}

	// Phone similarity
	if (a.phone && b.phone) {
		maxScore += options.phoneWeight;
		const phoneA = normalizePhone(a.phone);
		const phoneB = normalizePhone(b.phone);
		if (phoneA === phoneB) {
			score += options.phoneWeight;
		} else if (phoneA.slice(-10) === phoneB.slice(-10)) {
			// Last 10 digits match (ignoring country code)
			score += options.phoneWeight * 0.9;
		}
	}

	// Name similarity
	if (a.first_name && a.last_name && b.first_name && b.last_name) {
		maxScore += options.nameWeight;
		const fullNameA = `${a.first_name} ${a.last_name}`.toLowerCase();
		const fullNameB = `${b.first_name} ${b.last_name}`.toLowerCase();
		const nameSimilarity = stringSimilarity(fullNameA, fullNameB);
		score += nameSimilarity * options.nameWeight;
	} else if (a.display_name && b.display_name) {
		maxScore += options.nameWeight;
		const nameSimilarity = stringSimilarity(
			a.display_name.toLowerCase(),
			b.display_name.toLowerCase(),
		);
		score += nameSimilarity * options.nameWeight;
	} else if (a.company_name && b.company_name) {
		maxScore += options.nameWeight;
		const nameSimilarity = stringSimilarity(
			a.company_name.toLowerCase(),
			b.company_name.toLowerCase(),
		);
		score += nameSimilarity * options.nameWeight;
	}

	// Address similarity
	if (a.address && b.address) {
		maxScore += options.addressWeight;
		const addrA = normalizeAddress(a.address);
		const addrB = normalizeAddress(b.address);
		const addrSimilarity = stringSimilarity(addrA, addrB);
		score += addrSimilarity * options.addressWeight;
	}

	// City + ZIP exact match
	if (a.city && b.city && a.zip && b.zip) {
		maxScore += options.cityZipWeight;
		if (
			a.city.toLowerCase() === b.city.toLowerCase() &&
			normalizeZip(a.zip) === normalizeZip(b.zip)
		) {
			score += options.cityZipWeight;
		}
	}

	return maxScore > 0 ? score / maxScore : 0;
}

/**
 * Get list of fields that match between two records
 */
function getMatchingFields(a: Customer, b: Customer): string[] {
	const matching: string[] = [];

	if (
		a.email &&
		b.email &&
		normalizeEmail(a.email) === normalizeEmail(b.email)
	) {
		matching.push("email");
	}

	if (a.phone && b.phone) {
		const phoneA = normalizePhone(a.phone);
		const phoneB = normalizePhone(b.phone);
		if (phoneA === phoneB || phoneA.slice(-10) === phoneB.slice(-10)) {
			matching.push("phone");
		}
	}

	if (a.first_name && a.last_name && b.first_name && b.last_name) {
		const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
		const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
		if (stringSimilarity(nameA, nameB) > 0.9) {
			matching.push("name");
		}
	}

	if (a.address && b.address) {
		const addrSimilarity = stringSimilarity(
			normalizeAddress(a.address),
			normalizeAddress(b.address),
		);
		if (addrSimilarity > 0.8) {
			matching.push("address");
		}
	}

	if (a.city && b.city && a.zip && b.zip) {
		if (
			a.city.toLowerCase() === b.city.toLowerCase() &&
			normalizeZip(a.zip) === normalizeZip(b.zip)
		) {
			matching.push("city_zip");
		}
	}

	return matching;
}

/**
 * Determine recommendation for handling duplicate
 */
function determineRecommendation(
	similarity: number,
	matchingFields: string[],
): DuplicateGroup["recommendation"] {
	// High confidence duplicates with email match → keep first
	if (similarity > 0.95 && matchingFields.includes("email")) {
		return "keep_first";
	}

	// High confidence with multiple matches → merge
	if (similarity > 0.9 && matchingFields.length >= 3) {
		return "merge";
	}

	// Medium confidence → manual review
	if (similarity > 0.85 && similarity <= 0.9) {
		return "review";
	}

	// Default to keeping first record
	return "keep_first";
}

/**
 * Normalize email for comparison
 */
function normalizeEmail(email: string): string {
	return email.toLowerCase().trim();
}

/**
 * Normalize phone number for comparison
 */
function normalizePhone(phone: string): string {
	// Remove all non-digit characters
	const digits = phone.replace(/\D/g, "");

	// Remove country code if present
	if (digits.length === 11 && digits.startsWith("1")) {
		return digits.slice(1);
	}

	return digits;
}

/**
 * Normalize address for comparison
 */
function normalizeAddress(address: string): string {
	return address
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "")
		.replace(/street/g, "st")
		.replace(/avenue/g, "ave")
		.replace(/road/g, "rd")
		.replace(/drive/g, "dr")
		.replace(/boulevard/g, "blvd")
		.replace(/apartment/g, "apt")
		.replace(/suite/g, "ste");
}

/**
 * Normalize ZIP code for comparison
 */
function normalizeZip(zip: string): string {
	// Extract first 5 digits
	const match = zip.match(/\d{5}/);
	return match ? match[0] : zip;
}

/**
 * Calculate string similarity using Levenshtein distance
 */
function stringSimilarity(a: string, b: string): number {
	const distance = levenshteinDistance(a, b);
	const maxLen = Math.max(a.length, b.length);
	return maxLen > 0 ? 1 - distance / maxLen : 0;
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
					matrix[i - 1][j - 1] + 1, // substitution
					matrix[i][j - 1] + 1, // insertion
					matrix[i - 1][j] + 1, // deletion
				);
			}
		}
	}

	return matrix[b.length][a.length];
}

/**
 * Find duplicates of a single record against a dataset
 */
function findDuplicatesOfRecord(
	record: Customer,
	dataset: Customer[],
	options: DuplicateDetectionOptions = {},
): Array<{ index: number; similarity: number; matchingFields: string[] }> {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	const duplicates: Array<{
		index: number;
		similarity: number;
		matchingFields: string[];
	}> = [];

	dataset.forEach((candidate, index) => {
		const similarity = calculateSimilarity(record, candidate, opts);

		if (similarity >= opts.similarityThreshold) {
			duplicates.push({
				index,
				similarity,
				matchingFields: getMatchingFields(record, candidate),
			});
		}
	});

	return duplicates.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Merge duplicate records (keeps first, adds missing data from others)
 */
function mergeDuplicateRecords(records: Customer[]): Customer {
	if (records.length === 0) {
		throw new Error("No records to merge");
	}

	const merged: Customer = { ...records[0] };

	// Fill in missing fields from other records
	for (let i = 1; i < records.length; i++) {
		const record = records[i];

		Object.keys(record).forEach((key) => {
			const k = key as keyof Customer;
			if (!merged[k] && record[k]) {
				(merged as any)[k] = record[k];
			}
		});
	}

	return merged;
}
