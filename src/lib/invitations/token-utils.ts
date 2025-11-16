/**
 * Team Invitation Token Utilities
 *
 * Handles generation and verification of invitation tokens
 */

import { createHmac, randomBytes } from "node:crypto";

const INVITATION_SECRET = process.env.INVITATION_SECRET || "fallback-secret-change-in-production";
const INVITATION_EXPIRY_DAYS = 7;

/**
 * Generate a secure token for invitation
 */
export function generateInvitationToken(payload: { email: string; companyId: string; role: string }): string {
	const data = {
		...payload,
		exp: Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
		nonce: randomBytes(16).toString("hex"),
	};

	const encoded = Buffer.from(JSON.stringify(data)).toString("base64url");
	const signature = createHmac("sha256", INVITATION_SECRET).update(encoded).digest("base64url");

	return `${encoded}.${signature}`;
}

/**
 * Verify an invitation token
 */
export function verifyInvitationToken(token: string): {
	valid: boolean;
	payload?: { email: string; companyId: string; role: string; exp: number };
	error?: string;
} {
	try {
		const [encoded, signature] = token.split(".");
		if (!(encoded && signature)) {
			return { valid: false, error: "Invalid token format" };
		}

		// Verify signature
		const expectedSignature = createHmac("sha256", INVITATION_SECRET).update(encoded).digest("base64url");

		if (signature !== expectedSignature) {
			return { valid: false, error: "Invalid token signature" };
		}

		// Decode payload
		const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());

		// Check expiration
		if (Date.now() > payload.exp) {
			return { valid: false, error: "Token expired" };
		}

		return { valid: true, payload };
	} catch (_error) {
    console.error("Error:", _error);
		return { valid: false, error: "Token verification failed" };
	}
}
