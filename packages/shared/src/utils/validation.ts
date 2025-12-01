/**
 * Validation Utilities
 *
 * Common validation helpers used across the application
 */

import { REGEX_PATTERNS } from "../constants";

// ============================================================================
// Email Validation
// ============================================================================

/**
 * Validate email address
 */
export function isValidEmail(email: string | null | undefined): boolean {
	if (!email) {
		return false;
	}
	return REGEX_PATTERNS.email.test(email);
}

// ============================================================================
// Phone Validation
// ============================================================================

/**
 * Validate phone number (E.164 format)
 */
export function isValidPhone(phone: string | null | undefined): boolean {
	if (!phone) {
		return false;
	}
	return REGEX_PATTERNS.phoneE164.test(phone);
}

// ============================================================================
// URL Validation
// ============================================================================

/**
 * Validate URL
 */
export function isValidUrl(url: string | null | undefined): boolean {
	if (!url) {
		return false;
	}
	try {
		new URL(url);
		return true;
	} catch {
		return REGEX_PATTERNS.url.test(url);
	}
}

// ============================================================================
// UUID Validation
// ============================================================================

/**
 * Validate UUID
 */
export function isValidUuid(uuid: string | null | undefined): boolean {
	if (!uuid) {
		return false;
	}
	return REGEX_PATTERNS.uuid.test(uuid);
}

// ============================================================================
// ZIP Code Validation
// ============================================================================

/**
 * Validate US ZIP code
 */
export function isValidZipCode(zip: string | null | undefined): boolean {
	if (!zip) {
		return false;
	}
	return REGEX_PATTERNS.zipCode.test(zip);
}

// ============================================================================
// String Validation
// ============================================================================

/**
 * Check if string is not empty (after trimming)
 */
export function isNotEmpty(value: string | null | undefined): boolean {
	return typeof value === "string" && value.trim().length > 0;
}

/**
 * Check if string length is within range
 */
export function isLengthInRange(
	value: string | null | undefined,
	min: number,
	max: number,
): boolean {
	if (!value) {
		return false;
	}
	const length = value.length;
	return length >= min && length <= max;
}




