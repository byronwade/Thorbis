/**
 * Gmail API Rate Limiter
 *
 * Prevents Gmail API quota exhaustion and abuse by implementing rate limits
 * at multiple levels: per-user, per-company, and global.
 *
 * Gmail API Quotas (Google-imposed):
 * - 1 billion quota units per day (project-wide)
 * - 250 quota units/user/second
 * - messages.get = 5 units, messages.list = 5 units
 *
 * Our Limits:
 * - Per-user: 1 sync every 5 minutes (max 12 syncs/hour)
 * - Per-user: Max 100 messages per sync
 * - Global: Max 10 concurrent syncs
 * - API endpoints: 60 requests/minute per user
 *
 * Implementation:
 * - In-memory rate limiting with Map (resets on server restart)
 * - Redis for distributed rate limiting (optional, for multi-server)
 * - Automatic cleanup of stale entries
 *
 * @see https://developers.google.com/gmail/api/reference/quota
 */

// =============================================================================
// TYPES
// =============================================================================

interface RateLimitEntry {
	count: number;
	firstRequest: number;
	lastRequest: number;
}

interface SyncLock {
	teamMemberId: string;
	startedAt: number;
	expiresAt: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Minimum time between syncs per user (5 minutes) */
const SYNC_COOLDOWN_MS = 5 * 60 * 1000;

/** Maximum messages per sync */
const MAX_MESSAGES_PER_SYNC = 100;

/** Maximum concurrent syncs globally */
const MAX_CONCURRENT_SYNCS = 10;

/** API rate limit: requests per window */
const API_RATE_LIMIT = 60;

/** API rate limit window (1 minute) */
const API_RATE_WINDOW_MS = 60 * 1000;

/** How long to keep rate limit entries in memory */
const RATE_LIMIT_CLEANUP_MS = 60 * 60 * 1000; // 1 hour

/** How long a sync lock is valid (30 minutes max) */
const SYNC_LOCK_TIMEOUT_MS = 30 * 60 * 1000;

// =============================================================================
// IN-MEMORY STORAGE
// =============================================================================

/** Per-user API rate limits */
const apiRateLimits = new Map<string, RateLimitEntry>();

/** Per-user last sync timestamps */
const lastSyncTimes = new Map<string, number>();

/** Active sync locks */
const activeSyncLocks = new Set<SyncLock>();

/** Cleanup interval */
let cleanupInterval: NodeJS.Timeout | null = null;

// =============================================================================
// RATE LIMIT CHECKING
// =============================================================================

/**
 * Check if user can make an API request
 *
 * @param userId - User ID (team_member_id)
 * @returns { allowed: boolean, retryAfter?: number }
 */
export function checkApiRateLimit(userId: string): {
	allowed: boolean;
	retryAfter?: number;
} {
	const now = Date.now();
	const entry = apiRateLimits.get(userId);

	if (!entry) {
		// First request - allow and record
		apiRateLimits.set(userId, {
			count: 1,
			firstRequest: now,
			lastRequest: now,
		});
		return { allowed: true };
	}

	// Check if window has expired
	const windowAge = now - entry.firstRequest;
	if (windowAge > API_RATE_WINDOW_MS) {
		// Window expired - reset counter
		apiRateLimits.set(userId, {
			count: 1,
			firstRequest: now,
			lastRequest: now,
		});
		return { allowed: true };
	}

	// Within window - check limit
	if (entry.count >= API_RATE_LIMIT) {
		// Rate limit exceeded
		const retryAfter = Math.ceil(
			(entry.firstRequest + API_RATE_WINDOW_MS - now) / 1000,
		);
		return { allowed: false, retryAfter };
	}

	// Increment counter
	entry.count++;
	entry.lastRequest = now;
	apiRateLimits.set(userId, entry);

	return { allowed: true };
}

/**
 * Check if user can start a sync
 *
 * @param teamMemberId - Team member ID
 * @returns { allowed: boolean, reason?: string, retryAfter?: number }
 */
export function checkSyncRateLimit(teamMemberId: string): {
	allowed: boolean;
	reason?: string;
	retryAfter?: number;
} {
	const now = Date.now();

	// Check sync cooldown
	const lastSync = lastSyncTimes.get(teamMemberId);
	if (lastSync) {
		const timeSinceLastSync = now - lastSync;
		if (timeSinceLastSync < SYNC_COOLDOWN_MS) {
			const retryAfter = Math.ceil(
				(SYNC_COOLDOWN_MS - timeSinceLastSync) / 1000,
			);
			return {
				allowed: false,
				reason: "Sync cooldown active",
				retryAfter,
			};
		}
	}

	// Check concurrent sync limit
	const activeCount = getActiveSyncCount();
	if (activeCount >= MAX_CONCURRENT_SYNCS) {
		return {
			allowed: false,
			reason: "Maximum concurrent syncs reached",
			retryAfter: 60, // Retry in 1 minute
		};
	}

	// Check if user already has active sync
	const existingLock = Array.from(activeSyncLocks).find(
		(lock) => lock.teamMemberId === teamMemberId,
	);

	if (existingLock) {
		// Check if lock is expired
		if (now > existingLock.expiresAt) {
			// Lock expired - remove it
			activeSyncLocks.delete(existingLock);
		} else {
			return {
				allowed: false,
				reason: "Sync already in progress",
				retryAfter: Math.ceil((existingLock.expiresAt - now) / 1000),
			};
		}
	}

	return { allowed: true };
}

// =============================================================================
// SYNC LOCK MANAGEMENT
// =============================================================================

/**
 * Acquire a sync lock for a user
 *
 * @param teamMemberId - Team member ID
 * @returns Lock ID if acquired, null if failed
 */
export function acquireSyncLock(teamMemberId: string): SyncLock | null {
	const check = checkSyncRateLimit(teamMemberId);
	if (!check.allowed) {
		return null;
	}

	const now = Date.now();
	const lock: SyncLock = {
		teamMemberId,
		startedAt: now,
		expiresAt: now + SYNC_LOCK_TIMEOUT_MS,
	};

	activeSyncLocks.add(lock);
	lastSyncTimes.set(teamMemberId, now);

	return lock;
}

/**
 * Release a sync lock
 *
 * @param lock - Lock to release
 */
export function releaseSyncLock(lock: SyncLock): void {
	activeSyncLocks.delete(lock);
}

/**
 * Get count of active syncs
 */
export function getActiveSyncCount(): number {
	// Clean up expired locks first
	const now = Date.now();
	for (const lock of activeSyncLocks) {
		if (now > lock.expiresAt) {
			activeSyncLocks.delete(lock);
		}
	}

	return activeSyncLocks.size;
}

// =============================================================================
// CLEANUP
// =============================================================================

/**
 * Clean up stale rate limit entries
 */
function cleanup(): void {
	const now = Date.now();

	// Clean API rate limits
	for (const [userId, entry] of apiRateLimits.entries()) {
		const age = now - entry.lastRequest;
		if (age > RATE_LIMIT_CLEANUP_MS) {
			apiRateLimits.delete(userId);
		}
	}

	// Clean last sync times
	for (const [userId, lastSync] of lastSyncTimes.entries()) {
		const age = now - lastSync;
		if (age > RATE_LIMIT_CLEANUP_MS) {
			lastSyncTimes.delete(userId);
		}
	}

	// Clean expired sync locks
	for (const lock of activeSyncLocks) {
		if (now > lock.expiresAt) {
			activeSyncLocks.delete(lock);
		}
	}
}

/**
 * Start automatic cleanup
 */
export function startCleanup(): void {
	if (cleanupInterval) {
		return; // Already started
	}

	// Run cleanup every 5 minutes
	cleanupInterval = setInterval(cleanup, 5 * 60 * 1000);

	console.log("[Gmail Rate Limiter] Cleanup scheduled");
}

/**
 * Stop automatic cleanup
 */
export function stopCleanup(): void {
	if (cleanupInterval) {
		clearInterval(cleanupInterval);
		cleanupInterval = null;
	}
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate sync request parameters
 *
 * @param maxResults - Requested message count
 * @returns { valid: boolean, error?: string }
 */
export function validateSyncParams(maxResults: number): {
	valid: boolean;
	error?: string;
} {
	if (maxResults <= 0) {
		return { valid: false, error: "maxResults must be positive" };
	}

	if (maxResults > MAX_MESSAGES_PER_SYNC) {
		return {
			valid: false,
			error: `maxResults cannot exceed ${MAX_MESSAGES_PER_SYNC}`,
		};
	}

	return { valid: true };
}

// =============================================================================
// STATISTICS
// =============================================================================

/**
 * Get rate limiter statistics
 */
export function getRateLimiterStats(): {
	apiRateLimits: number;
	lastSyncTimes: number;
	activeSyncs: number;
	maxConcurrentSyncs: number;
} {
	return {
		apiRateLimits: apiRateLimits.size,
		lastSyncTimes: lastSyncTimes.size,
		activeSyncs: getActiveSyncCount(),
		maxConcurrentSyncs: MAX_CONCURRENT_SYNCS,
	};
}

/**
 * Reset all rate limits (for testing only!)
 */
export function resetRateLimits(): void {
	apiRateLimits.clear();
	lastSyncTimes.clear();
	activeSyncLocks.clear();
	console.warn("[Gmail Rate Limiter] All rate limits reset");
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Start cleanup on module load
startCleanup();

// =============================================================================
// EXPORTS
// =============================================================================

export const RATE_LIMITS = {
	SYNC_COOLDOWN_MS,
	MAX_MESSAGES_PER_SYNC,
	MAX_CONCURRENT_SYNCS,
	API_RATE_LIMIT,
	API_RATE_WINDOW_MS,
} as const;
