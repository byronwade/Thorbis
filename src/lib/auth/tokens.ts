/**
 * Authentication Token Utilities
 *
 * Features:
 * - Secure token generation for email verification
 * - Token storage and validation
 * - Expiration handling
 * - One-time use tokens
 */

"use server";

import { randomBytes } from "crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { verificationTokens } from "@/lib/db/schema";

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

  await (db as any).insert(verificationTokens).values({
    token,
    email,
    type: "email_verification",
    userId,
    expiresAt,
    used: false,
  });

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

  await (db as any).insert(verificationTokens).values({
    token,
    email,
    type: "password_reset",
    expiresAt,
    used: false,
  });

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

  await (db as any).insert(verificationTokens).values({
    token,
    email,
    type: "magic_link",
    expiresAt,
    used: false,
  });

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
  const now = new Date();

  // Find unused, non-expired token
  const [tokenRecord] = await (db as any)
    .select()
    .from(verificationTokens)
    .where(
      and(
        eq(verificationTokens.token, token),
        eq(verificationTokens.type, type),
        eq(verificationTokens.used, false),
        gt(verificationTokens.expiresAt, now)
      )
    )
    .limit(1);

  if (!tokenRecord) {
    return null;
  }

  // Mark token as used
  await (db as any)
    .update(verificationTokens)
    .set({
      used: true,
      usedAt: now,
    })
    .where(eq(verificationTokens.id, tokenRecord.id));

  return tokenRecord;
}

/**
 * Delete expired tokens (cleanup)
 */
export async function cleanupExpiredTokens() {
  const now = new Date();

  await (db as any)
    .delete(verificationTokens)
    .where(lt(verificationTokens.expiresAt, now));
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
  if (type) {
    await (db as any)
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.email, email),
          eq(verificationTokens.type, type)
        )
      );
  } else {
    await (db as any)
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email));
  }
}
