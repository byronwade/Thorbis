/**
 * Customer Display Utilities
 *
 * Unified logic for displaying customer information consistently across the application.
 * This prevents inconsistent customer name display and provides fallback logic.
 */

export interface CustomerDisplayData {
	id?: string;
	display_name?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	company_name?: string | null;
	email?: string | null;
	phone?: string | null;
}

/**
 * Get a customer's display name using consistent precedence logic:
 * 1. display_name (if set)
 * 2. first_name + last_name (combined)
 * 3. first_name OR last_name (whichever exists)
 * 4. company_name (for business customers)
 * 5. email (as last resort)
 * 6. "Unknown Customer" (ultimate fallback)
 *
 * @param customer - Customer object with potential name fields
 * @param fallbackEmail - Optional email to use if customer has no name
 * @returns Display-ready customer name
 *
 * @example
 * ```ts
 * getCustomerDisplayName({ first_name: "John", last_name: "Doe" })
 * // Returns: "John Doe"
 *
 * getCustomerDisplayName({ display_name: "John's Plumbing" })
 * // Returns: "John's Plumbing"
 *
 * getCustomerDisplayName({ email: "john@example.com" })
 * // Returns: "john@example.com"
 * ```
 */
export function getCustomerDisplayName(
	customer: CustomerDisplayData | null | undefined,
	fallbackEmail?: string | null
): string {
	if (!customer) {
		return fallbackEmail || "Unknown Customer";
	}

	// Priority 1: Explicit display name
	if (customer.display_name) {
		return customer.display_name;
	}

	// Priority 2: Full name (first + last)
	const firstName = customer.first_name?.trim();
	const lastName = customer.last_name?.trim();

	if (firstName && lastName) {
		return `${firstName} ${lastName}`;
	}

	// Priority 3: Either first or last name
	if (firstName) return firstName;
	if (lastName) return lastName;

	// Priority 4: Company name (for business customers)
	if (customer.company_name) {
		return customer.company_name;
	}

	// Priority 5: Email from customer record
	if (customer.email) {
		return customer.email;
	}

	// Priority 6: Fallback email provided
	if (fallbackEmail) {
		return fallbackEmail;
	}

	// Ultimate fallback
	return "Unknown Customer";
}

/**
 * Get customer initials for avatar displays
 * Takes first letter of each word (max 2 letters)
 *
 * @param customer - Customer object with potential name fields
 * @returns 1-2 character initials (uppercase)
 *
 * @example
 * ```ts
 * getCustomerInitials({ first_name: "John", last_name: "Doe" })
 * // Returns: "JD"
 *
 * getCustomerInitials({ display_name: "ACME Corp" })
 * // Returns: "AC"
 *
 * getCustomerInitials({ email: "john@example.com" })
 * // Returns: "J"
 * ```
 */
export function getCustomerInitials(
	customer: CustomerDisplayData | null | undefined
): string {
	if (!customer) return "?";

	const displayName = getCustomerDisplayName(customer);

	// Split by spaces and take first letter of each word
	const words = displayName.split(/\s+/).filter(Boolean);

	if (words.length >= 2) {
		return (words[0][0] + words[1][0]).toUpperCase();
	}

	if (words.length === 1 && words[0].length >= 2) {
		return words[0].slice(0, 2).toUpperCase();
	}

	if (words.length === 1) {
		return words[0][0].toUpperCase();
	}

	return "?";
}

/**
 * Get customer's full contact display (name + email/phone)
 * Useful for tooltips, hover cards, and detail views
 *
 * @param customer - Customer object
 * @returns Multi-line contact string
 *
 * @example
 * ```ts
 * getCustomerContactDisplay({
 *   first_name: "John",
 *   last_name: "Doe",
 *   email: "john@example.com",
 *   phone: "555-1234"
 * })
 * // Returns: "John Doe\njohn@example.com\n555-1234"
 * ```
 */
export function getCustomerContactDisplay(
	customer: CustomerDisplayData | null | undefined
): string {
	if (!customer) return "Unknown Customer";

	const lines: string[] = [getCustomerDisplayName(customer)];

	if (customer.email) {
		lines.push(customer.email);
	}

	if (customer.phone) {
		lines.push(customer.phone);
	}

	return lines.join("\n");
}

/**
 * Check if customer has any name information (not just email)
 * Useful for validation and "not linked" indicators
 *
 * @param customer - Customer object
 * @returns true if customer has a real name, false if only email/unknown
 */
export function hasCustomerName(
	customer: CustomerDisplayData | null | undefined
): boolean {
	if (!customer) return false;

	return !!(
		customer.display_name ||
		customer.first_name ||
		customer.last_name ||
		customer.company_name
	);
}

/**
 * Format customer name for sorting/comparison
 * Always uses "Last, First" format for consistent alphabetization
 *
 * @param customer - Customer object
 * @returns Sortable name string
 *
 * @example
 * ```ts
 * getCustomerSortName({ first_name: "John", last_name: "Doe" })
 * // Returns: "Doe, John"
 *
 * getCustomerSortName({ company_name: "ACME Corp" })
 * // Returns: "ACME Corp"
 * ```
 */
export function getCustomerSortName(
	customer: CustomerDisplayData | null | undefined
): string {
	if (!customer) return "zzz_unknown"; // Sort unknowns to end

	// If only last name, use it
	if (customer.last_name && !customer.first_name) {
		return customer.last_name;
	}

	// If only first name, use it
	if (customer.first_name && !customer.last_name) {
		return customer.first_name;
	}

	// If both names, use "Last, First" format
	if (customer.first_name && customer.last_name) {
		return `${customer.last_name}, ${customer.first_name}`;
	}

	// Otherwise use display name logic
	return getCustomerDisplayName(customer);
}
