import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin Session Management
 *
 * Uses JWT tokens stored in HTTP-only cookies for authentication.
 * Sessions are also tracked in the database for revocation support.
 */

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_DAYS = 7;

interface SessionPayload {
	userId: string;
	email: string;
	role: string;
	sessionId: string;
	iat: number;
	exp: number;
}

/**
 * Get the JWT secret from environment
 */
function getJwtSecret(): Uint8Array {
	const secret = process.env.ADMIN_JWT_SECRET;
	if (!secret) {
		throw new Error("Missing ADMIN_JWT_SECRET environment variable");
	}
	return new TextEncoder().encode(secret);
}

/**
 * Create a new session for an admin user
 */
export async function createSession(
	userId: string,
	email: string,
	role: string,
	ipAddress?: string,
	userAgent?: string
): Promise<string> {
	const supabase = await createClient();

	// Calculate expiration
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

	// Generate session ID
	const sessionId = crypto.randomUUID();

	// Create JWT token
	const token = await new SignJWT({
		userId,
		email,
		role,
		sessionId,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(expiresAt)
		.sign(getJwtSecret());

	// Hash the token for storage
	const tokenHash = await hashToken(token);

	// Store session in database
	const { error } = await supabase.from("admin_sessions").insert({
		id: sessionId,
		admin_user_id: userId,
		token_hash: tokenHash,
		ip_address: ipAddress,
		user_agent: userAgent,
		expires_at: expiresAt.toISOString(),
	});

	if (error) {
		throw new Error(`Failed to create session: ${error.message}`);
	}

	// Set cookie
	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		expires: expiresAt,
	});

	return token;
}

/**
 * Verify a session token and return the payload
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
	try {
		const { payload } = await jwtVerify(token, getJwtSecret());

		// Check if session exists and is not revoked
		const supabase = await createClient();
		const { data: session, error } = await supabase
			.from("admin_sessions")
			.select("*")
			.eq("id", payload.sessionId)
			.is("revoked_at", null)
			.single();

		if (error || !session) {
			return null;
		}

		// Check expiration
		if (new Date(session.expires_at) < new Date()) {
			return null;
		}

		return payload as unknown as SessionPayload;
	} catch {
		return null;
	}
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (!token) {
		return null;
	}

	return verifySessionToken(token);
}

/**
 * Alias for getSession for backwards compatibility
 */
export const getAdminSession = getSession;

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
	const session = await getSession();

	if (session) {
		// Revoke session in database
		const supabase = await createClient();
		await supabase
			.from("admin_sessions")
			.update({ revoked_at: new Date().toISOString() })
			.eq("id", session.sessionId);
	}

	// Clear cookie
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Revoke all sessions for a user (e.g., on password change)
 */
async function revokeAllUserSessions(userId: string): Promise<void> {
	const supabase = await createClient();

	await supabase
		.from("admin_sessions")
		.update({ revoked_at: new Date().toISOString() })
		.eq("admin_user_id", userId)
		.is("revoked_at", null);
}

/**
 * Hash a token for storage
 */
async function hashToken(token: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(token);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Clean up expired sessions (run periodically)
 */
async function cleanupExpiredSessions(): Promise<number> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("admin_sessions")
		.delete()
		.lt("expires_at", new Date().toISOString())
		.select("id");

	if (error) {
		throw new Error(`Failed to cleanup sessions: ${error.message}`);
	}

	return data?.length || 0;
}
