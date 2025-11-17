/**
 * Authentication Token Utilities
 *
 * Features:
 * - Secure token generation for email verification
 * - Token storage and validation
 * - Expiration handling
 * - One-time use tokens
 *
 * Note: Uses Supabase directly instead of Drizzle ORM
 */

"use server";

import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

/**
 * Generate a secure random token
 */
function generateSecureToken(): string {
	// Generate 32 bytes of random data and convert to hex string (64 characters)
	return randomBytes(32).toString("hex");
}

/**
 * Create an email verification token
 *
 * @param email - User's email address
 * @param userId - Optional user ID if already created
 * @param expiresInHours - Token expiration in hours (default: 24)
 */
export async function createEmailVerificationToken(
	email: string,
	userId?: string,
	expiresInHours = 24
): Promise<{ token: string; expiresAt: Date }> {
	const token = generateSecureToken();
	const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

	const supabase = await createClient();
	if (!supabase) {
		throw new Error("Supabase client not configured");
	}

	const { error } = await supabase.from("verification_tokens").insert({
		token,
		email,
		type: "email_verification",
		user_id: userId,
		expires_at: expiresAt.toISOString(),
		used: false,
	});

	if (error) {
		throw new Error(`Failed to create verification token: ${error.message}`);
	}

	return { token, expiresAt };
}

/**
 * Create a password reset token
 *
 * @param email - User's email address
 * @param expiresInHours - Token expiration in hours (default: 1)
 */
export async function createPasswordResetToken(
	email: string,
	expiresInHours = 1
): Promise<{ token: string; expiresAt: Date }> {
	const token = generateSecureToken();
	const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

	const supabase = await createClient();
	if (!supabase) {
		throw new Error("Supabase client not configured");
	}

	const { error } = await supabase.from("verification_tokens").insert({
		token,
		email,
		type: "password_reset",
		expires_at: expiresAt.toISOString(),
		used: false,
	});

	if (error) {
		throw new Error(`Failed to create password reset token: ${error.message}`);
	}

	return { token, expiresAt };
}

/**
 * Create a magic link token
 *
 * @param email - User's email address
 * @param expiresInMinutes - Token expiration in minutes (default: 15)
 */
export async function createMagicLinkToken(
	email: string,
	expiresInMinutes = 15
): Promise<{ token: string; expiresAt: Date }> {
	const token = generateSecureToken();
	const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

	const supabase = await createClient();
	if (!supabase) {
		throw new Error("Supabase client not configured");
	}

	const { error } = await supabase.from("verification_tokens").insert({
		token,
		email,
		type: "magic_link",
		expires_at: expiresAt.toISOString(),
		used: false,
	});

	if (error) {
		throw new Error(`Failed to create magic link token: ${error.message}`);
	}

	return { token, expiresAt };
}

/**
 * Verify and consume a token
 *
 * @param token - The token to verify
 * @param type - Token type to verify
 * @returns Token data if valid, null if invalid/expired/used
 */
export async function verifyAndConsumeToken(
	token: string,
	type: "email_verification" | "password_reset" | "magic_link"
) {
	const supabase = await createClient();
	if (!supabase) {
		throw new Error("Supabase client not configured");
	}
	const now = new Date().toISOString();

	// Find unused, non-expired token
	const { data: tokenRecord, error: selectError } = await supabase
		.from("verification_tokens")
		.select("*")
		.eq("token", token)
		.eq("type", type)
		.eq("used", false)
		.gt("expires_at", now)
		.limit(1)
		.single();

	if (selectError || !tokenRecord) {
		return null;
	}

	// Mark token as used
	const { error: updateError } = await supabase
		.from("verification_tokens")
		.update({
			used: true,
			used_at: now,
		})
		.eq("id", tokenRecord.id);

	if (updateError) {
		throw new Error(`Failed to consume token: ${updateError.message}`);
	}

	return tokenRecord;
}

/**
 * Delete expired tokens (cleanup)
 */
export async function cleanupExpiredTokens() {
	const supabase = await createClient();
	if (!supabase) {
		throw new Error("Supabase client not configured");
	}
	const now = new Date().toISOString();

	const { error } = await supabase.from("verification_tokens").delete().lt("expires_at", now);

	if (error) {
		throw new Error(`Failed to cleanup expired tokens: ${error.message}`);
	}
}

/**
 * Delete all tokens for an email
 *
 * @param email - User's email address
 * @param type - Optional: specific token type to delete
 */
export async function deleteTokensForEmail(
	email: string,
	type?: "email_verification" | "password_reset" | "magic_link"
) {
	const supabase = await createClient();
	if (!supabase) {
		throw new Error("Supabase client not configured");
	}

	let query = supabase.from("verification_tokens").delete().eq("email", email);

	if (type) {
		query = query.eq("type", type);
	}

	const { error } = await query;

	if (error) {
		throw new Error(`Failed to delete tokens: ${error.message}`);
	}
}
