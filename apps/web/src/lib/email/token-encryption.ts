/**
 * Token Encryption Service
 *
 * Encrypts and decrypts OAuth refresh tokens before storing in database.
 * Uses AES-256-GCM for authenticated encryption.
 *
 * Security Features:
 * - AES-256-GCM authenticated encryption
 * - Unique IV (initialization vector) per token
 * - Authentication tag prevents tampering
 * - Key derivation from environment variable
 *
 * Environment Variables Required:
 * - TOKEN_ENCRYPTION_KEY: 32-byte hex string (64 characters)
 *
 * Generate key with: openssl rand -hex 32
 *
 * CRITICAL: Never commit encryption key to version control!
 */

import crypto from "crypto";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Encryption algorithm (AES-256-GCM) */
const ALGORITHM = "aes-256-gcm";

/** IV length in bytes (12 bytes = 96 bits, recommended for GCM) */
const IV_LENGTH = 12;

/** Auth tag length in bytes (16 bytes = 128 bits) */
const AUTH_TAG_LENGTH = 16;

/** Encoding for encrypted output */
const ENCODING = "base64";

// =============================================================================
// KEY MANAGEMENT
// =============================================================================

/**
 * Get encryption key from environment
 * Throws error if key is missing or invalid
 */
function getEncryptionKey(): Buffer {
	const keyHex = process.env.TOKEN_ENCRYPTION_KEY;

	if (!keyHex) {
		throw new Error(
			"TOKEN_ENCRYPTION_KEY environment variable not set. Generate with: openssl rand -hex 32",
		);
	}

	// Verify key is 32 bytes (64 hex characters)
	if (keyHex.length !== 64) {
		throw new Error(
			"TOKEN_ENCRYPTION_KEY must be 32 bytes (64 hex characters). Generate with: openssl rand -hex 32",
		);
	}

	// Convert hex string to buffer
	const key = Buffer.from(keyHex, "hex");

	if (key.length !== 32) {
		throw new Error("Invalid TOKEN_ENCRYPTION_KEY format");
	}

	return key;
}

// =============================================================================
// ENCRYPTION/DECRYPTION
// =============================================================================

/**
 * Encrypt a token (refresh token or access token)
 *
 * @param plaintext - Token to encrypt
 * @returns Encrypted token string (format: iv:authTag:ciphertext, all base64)
 *
 * @example
 * const encrypted = encryptToken("ya29.a0AfH6SMB...");
 * // Returns: "rL8Kx2f...==:gH3pQ9...==:aB4cD5..."
 */
export function encryptToken(plaintext: string): string {
	try {
		const key = getEncryptionKey();

		// Generate random IV (never reuse IVs!)
		const iv = crypto.randomBytes(IV_LENGTH);

		// Create cipher
		const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

		// Encrypt
		let ciphertext = cipher.update(plaintext, "utf8", ENCODING);
		ciphertext += cipher.final(ENCODING);

		// Get authentication tag
		const authTag = cipher.getAuthTag();

		// Return format: iv:authTag:ciphertext (all base64)
		return [iv.toString(ENCODING), authTag.toString(ENCODING), ciphertext].join(
			":",
		);
	} catch (error) {
		console.error("[Token Encryption] Encryption failed:", error);
		throw new Error("Failed to encrypt token");
	}
}

/**
 * Decrypt a token (refresh token or access token)
 *
 * @param encrypted - Encrypted token string (format: iv:authTag:ciphertext)
 * @returns Decrypted plaintext token
 *
 * @example
 * const plaintext = decryptToken("rL8Kx2f...==:gH3pQ9...==:aB4cD5...");
 * // Returns: "ya29.a0AfH6SMB..."
 */
export function decryptToken(encrypted: string): string {
	try {
		const key = getEncryptionKey();

		// Parse encrypted format: iv:authTag:ciphertext
		const parts = encrypted.split(":");
		if (parts.length !== 3) {
			throw new Error("Invalid encrypted token format");
		}

		const [ivBase64, authTagBase64, ciphertext] = parts;

		// Convert from base64
		const iv = Buffer.from(ivBase64, ENCODING);
		const authTag = Buffer.from(authTagBase64, ENCODING);

		// Verify lengths
		if (iv.length !== IV_LENGTH) {
			throw new Error("Invalid IV length");
		}

		if (authTag.length !== AUTH_TAG_LENGTH) {
			throw new Error("Invalid auth tag length");
		}

		// Create decipher
		const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
		decipher.setAuthTag(authTag);

		// Decrypt
		let plaintext = decipher.update(ciphertext, ENCODING, "utf8");
		plaintext += decipher.final("utf8");

		return plaintext;
	} catch (error) {
		console.error("[Token Encryption] Decryption failed:", error);
		throw new Error("Failed to decrypt token");
	}
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Check if encryption key is configured
 * @returns True if key is set and valid
 */
export function isEncryptionConfigured(): boolean {
	try {
		getEncryptionKey();
		return true;
	} catch {
		return false;
	}
}

/**
 * Test encryption/decryption round-trip
 * Useful for validating configuration
 *
 * @returns True if encryption works correctly
 */
export function testEncryption(): boolean {
	try {
		const testToken = "test_token_" + crypto.randomBytes(32).toString("hex");
		const encrypted = encryptToken(testToken);
		const decrypted = decryptToken(encrypted);

		return decrypted === testToken;
	} catch {
		return false;
	}
}

/**
 * Migrate existing plaintext tokens to encrypted format
 *
 * IMPORTANT: Run this as a one-time migration script
 * DO NOT run in production without backup!
 *
 * @example
 * // In a migration script:
 * await migrateTokensToEncrypted();
 */
export async function migrateTokensToEncrypted() {
	// This would be implemented as a standalone migration script
	// NOT included here to prevent accidental execution
	console.warn("[Token Encryption] Migration must be run as standalone script");
	throw new Error("Use standalone migration script");
}

// =============================================================================
// WRAPPER FUNCTIONS FOR BACKWARD COMPATIBILITY
// =============================================================================

/**
 * Encrypt token with fallback for dev/test environments
 *
 * If encryption key not configured, returns plaintext (dev only!)
 * Production should always have encryption key configured
 */
export function encryptTokenSafe(plaintext: string): string {
	if (!isEncryptionConfigured()) {
		console.warn(
			"[Token Encryption] Encryption key not configured - storing plaintext (DEV ONLY)",
		);
		return plaintext;
	}

	return encryptToken(plaintext);
}

/**
 * Decrypt token with fallback for migration period
 *
 * If decryption fails (likely plaintext), returns as-is
 * Allows gradual migration from plaintext to encrypted
 */
export function decryptTokenSafe(encrypted: string): string {
	if (!isEncryptionConfigured()) {
		console.warn(
			"[Token Encryption] Encryption key not configured - returning plaintext (DEV ONLY)",
		);
		return encrypted;
	}

	// Check if token is already encrypted (contains colons)
	if (!encrypted.includes(":")) {
		console.warn(
			"[Token Encryption] Token appears to be plaintext - returning as-is (MIGRATION MODE)",
		);
		return encrypted;
	}

	try {
		return decryptToken(encrypted);
	} catch (error) {
		console.error(
			"[Token Encryption] Decryption failed, returning plaintext:",
			error,
		);
		return encrypted;
	}
}
