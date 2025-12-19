/**
 * Porting Utility Functions
 *
 * Client-safe utility functions for phone number porting.
 * These functions don't require Twilio SDK and can be imported in client components.
 */

/**
 * Get estimated FOC (Firm Order Commitment) date
 *
 * FOC dates are typically 7-10 business days for local numbers,
 * and 4-6 weeks for toll-free numbers.
 */
export function getEstimatedFocDate(phoneNumbers: string[]): Date {
	const now = new Date();

	// Check if any numbers are toll-free (start with 800, 888, 877, 866, 855, 844, 833)
	const hasTollFree = phoneNumbers.some((num) => {
		const cleaned = num.replace(/\D/g, "");
		return /^1?(800|888|877|866|855|844|833)/.test(cleaned);
	});

	// Toll-free: ~30 days, Local: ~10 business days
	const daysToAdd = hasTollFree ? 30 : 14;

	// Add business days
	let businessDays = 0;
	const focDate = new Date(now);

	while (businessDays < daysToAdd) {
		focDate.setDate(focDate.getDate() + 1);
		const dayOfWeek = focDate.getDay();
		if (dayOfWeek !== 0 && dayOfWeek !== 6) {
			businessDays++;
		}
	}

	return focDate;
}

/**
 * Get required documents for porting
 */
export function getRequiredPortingDocuments(): {
	required: string[];
	optional: string[];
} {
	return {
		required: [
			"Letter of Authorization (LOA) - signed by authorized account holder",
			"Current phone bill or carrier invoice (within last 30 days)",
			"Business registration document (for business accounts)",
		],
		optional: [
			"PIN or password from current carrier",
			"Account number from current carrier",
			"Proof of business address",
		],
	};
}
