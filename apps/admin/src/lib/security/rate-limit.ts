/**
 * Admin Rate Limiting
 *
 * Protects against brute force attacks on admin login.
 * More restrictive than contractor app due to higher privileges.
 *
 * Limits:
 * - Auth: 3 attempts per 30 minutes per email
 * - Auth: 10 attempts per 30 minutes per IP
 * - After lockout: exponential backoff
 */

interface RateLimitRecord {
	count: number;
	requests: number[];
	lockedUntil?: number;
}

class AdminRateLimiter {
	private requests: Map<string, RateLimitRecord>;
	private readonly maxRequests: number;
	private readonly windowMs: number;
	private readonly lockoutMultiplier: number;

	constructor(maxRequests: number, windowMs: number, lockoutMultiplier = 2) {
		this.requests = new Map();
		this.maxRequests = maxRequests;
		this.windowMs = windowMs;
		this.lockoutMultiplier = lockoutMultiplier;

		// Cleanup old entries every minute
		if (typeof setInterval !== "undefined") {
			setInterval(() => this.cleanup(), 60_000);
		}
	}

	async limit(identifier: string): Promise<{
		success: boolean;
		limit: number;
		remaining: number;
		reset: number;
		locked: boolean;
		lockoutEnds?: number;
	}> {
		const now = Date.now();
		const key = identifier.toLowerCase(); // Normalize for case-insensitive matching

		let record = this.requests.get(key);

		// Initialize if doesn't exist
		if (!record) {
			record = {
				count: 0,
				requests: [],
			};
			this.requests.set(key, record);
		}

		// Check if currently locked out
		if (record.lockedUntil && now < record.lockedUntil) {
			return {
				success: false,
				limit: this.maxRequests,
				remaining: 0,
				reset: record.lockedUntil,
				locked: true,
				lockoutEnds: record.lockedUntil,
			};
		}

		// Clear lockout if expired
		if (record.lockedUntil && now >= record.lockedUntil) {
			record.lockedUntil = undefined;
		}

		// Remove requests outside the sliding window
		record.requests = record.requests.filter(
			(timestamp) => timestamp > now - this.windowMs,
		);

		// Check if limit exceeded
		if (record.requests.length >= this.maxRequests) {
			// Apply lockout with exponential backoff
			const lockoutDuration =
				this.windowMs *
				Math.pow(
					this.lockoutMultiplier,
					Math.floor(record.requests.length / this.maxRequests),
				);
			record.lockedUntil = now + lockoutDuration;

			return {
				success: false,
				limit: this.maxRequests,
				remaining: 0,
				reset: record.lockedUntil,
				locked: true,
				lockoutEnds: record.lockedUntil,
			};
		}

		// Add new request
		record.requests.push(now);
		record.count = record.requests.length;

		return {
			success: true,
			limit: this.maxRequests,
			remaining: this.maxRequests - record.count,
			reset: now + this.windowMs,
			locked: false,
		};
	}

	private cleanup() {
		const now = Date.now();
		for (const [key, record] of this.requests.entries()) {
			record.requests = record.requests.filter(
				(timestamp) => timestamp > now - this.windowMs,
			);
			// Remove if no recent requests and no active lockout
			if (
				record.requests.length === 0 &&
				(!record.lockedUntil || now >= record.lockedUntil)
			) {
				this.requests.delete(key);
			}
		}
	}

	reset(identifier: string) {
		this.requests.delete(identifier.toLowerCase());
	}

	clear() {
		this.requests.clear();
	}
}

// Admin auth rate limiter - stricter than contractor app
// 3 attempts per 30 minutes, with exponential lockout
const adminAuthByEmailLimiter = new AdminRateLimiter(
	3, // 3 attempts
	30 * 60 * 1000, // per 30 minutes
	2, // double lockout each time
);

// IP-based limiter to prevent distributed attacks
const adminAuthByIPLimiter = new AdminRateLimiter(
	10, // 10 attempts
	30 * 60 * 1000, // per 30 minutes
	2,
);

/**
 * Rate Limit Error
 */
export class RateLimitError extends Error {
	public readonly retryAfter: number;
	public readonly locked: boolean;

	constructor(
		message: string,
		retryAfter: number,
		locked: boolean,
	) {
		super(message);
		this.name = "RateLimitError";
		this.retryAfter = retryAfter;
		this.locked = locked;
	}
}

/**
 * Check Admin Auth Rate Limit
 *
 * Checks both email and IP-based limits.
 * Throws RateLimitError if either limit exceeded.
 *
 * @param email - User's email address
 * @param ip - Client IP address
 */
export async function checkAdminAuthRateLimit(
	email: string,
	ip: string,
): Promise<void> {
	// Check email-based limit
	const emailResult = await adminAuthByEmailLimiter.limit(email);
	if (!emailResult.success) {
		const retryAfterMs = emailResult.reset - Date.now();
		const retryAfterSec = Math.ceil(retryAfterMs / 1000);
		const minutes = Math.ceil(retryAfterSec / 60);

		throw new RateLimitError(
			emailResult.locked
				? `Account temporarily locked. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`
				: `Too many login attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
			retryAfterMs,
			emailResult.locked,
		);
	}

	// Check IP-based limit
	const ipResult = await adminAuthByIPLimiter.limit(ip);
	if (!ipResult.success) {
		const retryAfterMs = ipResult.reset - Date.now();
		const retryAfterSec = Math.ceil(retryAfterMs / 1000);
		const minutes = Math.ceil(retryAfterSec / 60);

		throw new RateLimitError(
			`Too many requests from this location. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
			retryAfterMs,
			ipResult.locked,
		);
	}
}

/**
 * Reset Rate Limit for Email
 *
 * Call this after successful login to reset the counter.
 * This prevents legitimate users from being locked out after a typo.
 */
export function resetRateLimitForEmail(email: string): void {
	adminAuthByEmailLimiter.reset(email);
}

/**
 * Get Client IP Address
 *
 * Extracts IP from request headers for rate limiting.
 */
export function getClientIP(headers: Headers): string {
	// Check common proxy headers in order of preference
	const forwarded = headers.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}

	const realIP = headers.get("x-real-ip");
	if (realIP) {
		return realIP;
	}

	const cfIP = headers.get("cf-connecting-ip"); // Cloudflare
	if (cfIP) {
		return cfIP;
	}

	const vercelIP = headers.get("x-vercel-forwarded-for");
	if (vercelIP) {
		return vercelIP.split(",")[0].trim();
	}

	return "unknown";
}
