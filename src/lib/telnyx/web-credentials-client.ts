"use client";

import { getWebRTCCredentials } from "@/actions/telnyx";

type WebRTCCredentialsResult = Awaited<ReturnType<typeof getWebRTCCredentials>>;
type Credential = NonNullable<WebRTCCredentialsResult["credential"]>;

const STORAGE_KEY = "telnyx-webrtc-credential";
const EXPIRY_BUFFER_MS = 60 * 1000; // refresh 1 minute before expiration

let credentialsPromise: Promise<WebRTCCredentialsResult> | null = null;

function getExpiresAtMs(expiresAt: Credential["expires_at"]): number | null {
	if (typeof expiresAt === "number") {
		return expiresAt;
	}
	if (typeof expiresAt === "string") {
		const parsed = Date.parse(expiresAt);
		return Number.isNaN(parsed) ? null : parsed;
	}
	return null;
}

function loadFromStorage(): Credential | null {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return null;
		}

		const parsed = JSON.parse(raw) as { credential?: Credential } | null;
		if (!parsed?.credential) {
			return null;
		}

		const expiresAtMs = getExpiresAtMs(parsed.credential.expires_at);
		if (!expiresAtMs || expiresAtMs - EXPIRY_BUFFER_MS <= Date.now()) {
			return null;
		}

		return parsed.credential;
	} catch {
		return null;
	}
}

function persistCredential(credential: Credential) {
	if (typeof window === "undefined") {
		return;
	}

	try {
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				credential,
			}),
		);
	} catch {
		// Ignore storage errors (e.g., Safari private mode)
	}
}

function createPromise() {
	const cached = loadFromStorage();
	if (cached) {
		console.log("🔑 Using cached WebRTC credentials:", {
			username: cached.username,
			expiresAt: new Date(cached.expires_at).toISOString(),
			isExpired: cached.expires_at <= Date.now(),
		});
		const cachedResult: WebRTCCredentialsResult = {
			success: true,
			credential: cached,
		};
		const promise = Promise.resolve(cachedResult);
		credentialsPromise = promise;
		return promise;
	}

	console.log("🔑 Fetching WebRTC credentials from server...");
	const promise = getWebRTCCredentials()
		.then((result) => {
			console.log("🔑 WebRTC credentials response:", result);
			if (result?.success && result.credential) {
				console.log("🔑 Persisting new credentials to localStorage");
				persistCredential(result.credential);
			} else {
				console.warn("🔑 Failed to get credentials, clearing cache");
				credentialsPromise = null;
			}
			return result;
		})
		.catch((error) => {
			console.error("🔑 WebRTC credentials fetch error:", error);
			credentialsPromise = null;
			throw error;
		});

	credentialsPromise = promise;
	return promise;
}

export function fetchWebRTCCredentialsOnce() {
	return credentialsPromise ?? createPromise();
}

export function resetWebRTCCredentialsCache() {
	credentialsPromise = null;
	if (typeof window !== "undefined") {
		try {
			window.localStorage.removeItem(STORAGE_KEY);
		} catch {
			// Ignore storage removal errors
		}
	}
}
