/**
 * Twilio Voice Credentials Client
 *
 * Client-side utility for fetching and caching Twilio Voice SDK access tokens.
 * Uses singleton pattern to avoid duplicate token requests.
 */

import { getWebRTCCredentials } from "@/actions/twilio";

type VoiceCredential = {
	accessToken: string;
	identity: string;
	expires_at: number;
};

type CredentialsResult = {
	success: boolean;
	credential?: VoiceCredential;
	error?: string;
};

// Singleton cache
let cachedCredentials: VoiceCredential | null = null;
let fetchPromise: Promise<CredentialsResult> | null = null;

/**
 * Fetch Twilio Voice credentials (cached, singleton)
 *
 * Returns cached credentials if still valid (with 5-minute buffer).
 * Only makes one request even if called multiple times in parallel.
 */
export async function fetchVoiceCredentialsOnce(): Promise<CredentialsResult> {
	// Return cached if still valid (with 5-minute buffer)
	if (cachedCredentials && cachedCredentials.expires_at > Date.now() + 5 * 60 * 1000) {
		return { success: true, credential: cachedCredentials };
	}

	// If already fetching, wait for that promise
	if (fetchPromise) {
		return fetchPromise;
	}

	// Start new fetch
	fetchPromise = (async () => {
		try {
			const result = await getWebRTCCredentials();

			if (result.success && result.credential) {
				cachedCredentials = result.credential;
				return {
					success: true,
					credential: result.credential,
				};
			}

			return {
				success: false,
				error: result.error || "Failed to get voice credentials",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to fetch voice credentials",
			};
		} finally {
			// Clear the promise so next call can try again if needed
			fetchPromise = null;
		}
	})();

	return fetchPromise;
}

/**
 * Reset credentials cache
 * Call this when user logs out or when credentials need to be refreshed
 */
export function resetVoiceCredentialsCache(): void {
	cachedCredentials = null;
	fetchPromise = null;
}

/**
 * Check if credentials are cached and valid
 */
export function hasValidCredentials(): boolean {
	return !!(cachedCredentials && cachedCredentials.expires_at > Date.now() + 5 * 60 * 1000);
}

/**
 * Get cached credentials without fetching
 */
export function getCachedCredentials(): VoiceCredential | null {
	if (cachedCredentials && cachedCredentials.expires_at > Date.now() + 5 * 60 * 1000) {
		return cachedCredentials;
	}
	return null;
}
