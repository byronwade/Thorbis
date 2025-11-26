/**
 * Domain Validation Utilities for Multi-Tenant Email System
 *
 * Features:
 * - Subdomain enforcement for reputation isolation
 * - Domain ownership validation
 * - Blocked domain detection (public email providers)
 * - Tier-based domain allocation
 */

// Blocked domains - public email providers that shouldn't be registered
const BLOCKED_DOMAINS = new Set([
	// Major providers
	"gmail.com",
	"yahoo.com",
	"hotmail.com",
	"outlook.com",
	"live.com",
	"msn.com",
	"aol.com",
	"icloud.com",
	"me.com",
	"mac.com",
	// Other common providers
	"protonmail.com",
	"proton.me",
	"zoho.com",
	"mail.com",
	"gmx.com",
	"yandex.com",
	"fastmail.com",
	// Temporary email services
	"tempmail.com",
	"guerrillamail.com",
	"mailinator.com",
	"10minutemail.com",
	"throwaway.email",
	// Big tech
	"google.com",
	"microsoft.com",
	"apple.com",
	"amazon.com",
	"facebook.com",
	"meta.com",
]);

// Reserved subdomains that companies cannot use
const RESERVED_SUBDOMAINS = new Set([
	"mail",
	"email",
	"smtp",
	"pop",
	"imap",
	"webmail",
	"mx",
	"ns",
	"dns",
	"www",
	"api",
	"app",
	"admin",
	"support",
	"help",
	"billing",
	"status",
]);

export interface DomainValidationResult {
	valid: boolean;
	error?: string;
	normalizedDomain?: string;
	isSubdomain?: boolean;
	rootDomain?: string;
	subdomain?: string;
}

export interface DomainConfig {
	allowCustomDomain: boolean;
	requireSubdomain: boolean;
	maxDomainsAllowed: number;
}

/**
 * Get domain configuration - all companies have the same config (no tiers)
 */
export function getDomainConfig(): DomainConfig {
	return {
		allowCustomDomain: true,
		requireSubdomain: false, // Can use root domain or subdomain
		maxDomainsAllowed: 10, // Reasonable limit for organization
	};
}

/**
 * Parse a domain into its components
 */
export function parseDomain(domain: string): {
	subdomain: string | null;
	rootDomain: string;
	tld: string;
} {
	const normalized = domain.toLowerCase().trim();
	const parts = normalized.split(".");

	if (parts.length < 2) {
		return { subdomain: null, rootDomain: normalized, tld: "" };
	}

	// Handle common multi-part TLDs (co.uk, com.au, etc.)
	const multiPartTlds = ["co.uk", "com.au", "co.nz", "com.br", "co.jp"];
	const lastTwo = parts.slice(-2).join(".");

	if (multiPartTlds.includes(lastTwo) && parts.length > 2) {
		const tld = lastTwo;
		const rootDomain = parts.slice(-3).join(".");
		const subdomain = parts.length > 3 ? parts.slice(0, -3).join(".") : null;
		return { subdomain, rootDomain, tld };
	}

	const tld = parts[parts.length - 1];
	const rootDomain = parts.slice(-2).join(".");
	const subdomain = parts.length > 2 ? parts.slice(0, -2).join(".") : null;

	return { subdomain, rootDomain, tld };
}

/**
 * Validate a domain for registration
 */
export function validateDomain(domain: string): DomainValidationResult {
	if (!domain || typeof domain !== "string") {
		return { valid: false, error: "Domain is required" };
	}

	const normalized = domain.toLowerCase().trim();

	// Basic format validation
	const domainRegex =
		/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
	if (!domainRegex.test(normalized)) {
		return { valid: false, error: "Invalid domain format" };
	}

	// Check for blocked domains
	const { rootDomain, subdomain } = parseDomain(normalized);
	if (BLOCKED_DOMAINS.has(rootDomain)) {
		return {
			valid: false,
			error: `Cannot register public email provider domain: ${rootDomain}`,
		};
	}

	// Check for reserved subdomains
	if (subdomain && RESERVED_SUBDOMAINS.has(subdomain.split(".")[0])) {
		return {
			valid: false,
			error: `Subdomain "${subdomain}" is reserved. Please use a different subdomain.`,
		};
	}

	return {
		valid: true,
		normalizedDomain: normalized,
		isSubdomain: !!subdomain,
		rootDomain,
		subdomain: subdomain || undefined,
	};
}

/**
 * Generate platform subdomain for companies without custom domains
 * Format: {company-slug}.mail.stratos.app
 */
export function generatePlatformSubdomain(companySlug: string): string {
	const sanitized = companySlug
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");

	const platformDomain =
		process.env.PLATFORM_EMAIL_DOMAIN || "mail.stratos.app";
	return `${sanitized}.${platformDomain}`;
}

/**
 * Generate default sending address for a company
 */
export function generateSendingAddress(
	companySlug: string,
	domain: string,
	type: "notifications" | "support" | "billing" | "noreply" = "notifications",
): string {
	return `${type}@${domain}`;
}

/**
 * Check if company can register more domains
 */
export function canRegisterMoreDomains(currentDomainCount: number): {
	allowed: boolean;
	reason?: string;
} {
	const config = getDomainConfig();

	if (currentDomainCount >= config.maxDomainsAllowed) {
		return {
			allowed: false,
			reason: `Maximum ${config.maxDomainsAllowed} domain(s) allowed. Contact support if you need more.`,
		};
	}

	return { allowed: true };
}

/**
 * Suggest subdomain options for a domain
 */
export function suggestSubdomains(rootDomain: string): string[] {
	return [
		`mail.${rootDomain}`,
		`notifications.${rootDomain}`,
		`updates.${rootDomain}`,
		`alerts.${rootDomain}`,
		`messages.${rootDomain}`,
	];
}

/**
 * Validate email address format
 */
export function validateEmailAddress(email: string): {
	valid: boolean;
	error?: string;
	local?: string;
	domain?: string;
} {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(email)) {
		return { valid: false, error: "Invalid email format" };
	}

	const [local, domain] = email.split("@");

	if (local.length > 64) {
		return { valid: false, error: "Local part of email is too long" };
	}

	if (domain.length > 255) {
		return { valid: false, error: "Domain part of email is too long" };
	}

	return { valid: true, local, domain };
}
