"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createSession, destroySession, getSession } from "@/lib/auth/session";
import {
	checkAdminAuthRateLimit,
	resetRateLimitForEmail,
	getClientIP,
	RateLimitError,
} from "@/lib/security/rate-limit";
import {
	logAdminLoginSuccess,
	logAdminLoginFailure,
	logRateLimitExceeded,
} from "@/lib/security/audit-log";

export type AdminLoginResult = {
	success: boolean;
	error?: string;
	rateLimited?: boolean;
	retryAfter?: number;
};

/**
 * Admin Sign In Server Action
 *
 * Authenticates admin users against the admin_users table in the admin database.
 * Uses custom JWT-based sessions instead of Supabase Auth.
 */
export async function adminSignIn(formData: FormData): Promise<AdminLoginResult> {
	const email = (formData.get("email") as string)?.trim().toLowerCase();
	const password = formData.get("password") as string;

	// Get client info for rate limiting and logging
	const headersList = await headers();
	const ip = getClientIP(headersList);
	const userAgent = headersList.get("user-agent") || undefined;

	// Validate inputs
	if (!email || !password) {
		return {
			success: false,
			error: "Email and password are required.",
		};
	}

	// Check rate limits BEFORE any other validation
	try {
		await checkAdminAuthRateLimit(email, ip);
	} catch (error) {
		if (error instanceof RateLimitError) {
			await logRateLimitExceeded(email, ip, Date.now() + error.retryAfter);
			return {
				success: false,
				error: error.message,
				rateLimited: true,
				retryAfter: error.retryAfter,
			};
		}
		throw error;
	}

	// Get admin user from database
	const supabase = await createClient();

	// Check if user exists and is active
	const { data: adminUser, error: userError } = await supabase
		.from("admin_users")
		.select("*")
		.eq("email", email)
		.single();

	if (userError || !adminUser) {
		await logAdminLoginFailure(email, ip, "User not found", userAgent);
		return {
			success: false,
			error: "Invalid email or password.",
		};
	}

	// Check if account is active
	if (!adminUser.is_active) {
		await logAdminLoginFailure(email, ip, "Account disabled", userAgent);
		return {
			success: false,
			error: "Your account has been disabled. Contact a super admin.",
		};
	}

	// Check if account is locked
	if (adminUser.locked_until && new Date(adminUser.locked_until) > new Date()) {
		const lockRemaining = Math.ceil(
			(new Date(adminUser.locked_until).getTime() - Date.now()) / 1000 / 60
		);
		await logAdminLoginFailure(email, ip, "Account locked", userAgent);
		return {
			success: false,
			error: `Account is locked. Try again in ${lockRemaining} minutes.`,
		};
	}

	// Verify password using PostgreSQL crypt function
	const { data: passwordMatch, error: verifyError } = await supabase.rpc("verify_password", {
		password_text: password,
		password_hash: adminUser.password_hash,
	});

	if (verifyError || !passwordMatch) {
		// Increment failed login attempts
		const newAttempts = (adminUser.failed_login_attempts || 0) + 1;
		const lockUntil = newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

		await supabase
			.from("admin_users")
			.update({
				failed_login_attempts: newAttempts,
				locked_until: lockUntil?.toISOString(),
			})
			.eq("id", adminUser.id);

		await logAdminLoginFailure(email, ip, "Invalid password", userAgent);

		if (newAttempts >= 5) {
			return {
				success: false,
				error: "Too many failed attempts. Account locked for 15 minutes.",
			};
		}

		return {
			success: false,
			error: "Invalid email or password.",
		};
	}

	// Successful login - create session
	try {
		await createSession(adminUser.id, adminUser.email, adminUser.role, ip, userAgent);

		// Reset failed attempts and update last login
		await supabase
			.from("admin_users")
			.update({
				failed_login_attempts: 0,
				locked_until: null,
				last_login_at: new Date().toISOString(),
			})
			.eq("id", adminUser.id);

		// Reset rate limit and log success
		resetRateLimitForEmail(email);
		await logAdminLoginSuccess(email, ip, userAgent);

		return { success: true };
	} catch (error) {
		console.error("Session creation error:", error);
		return {
			success: false,
			error: "Failed to create session. Please try again.",
		};
	}
}

/**
 * Admin Sign Out Server Action
 */
export async function adminSignOut(): Promise<{ success: boolean; error?: string }> {
	try {
		await destroySession();
		return { success: true };
	} catch (error) {
		console.error("Sign out error:", error);
		return {
			success: false,
			error: "Failed to sign out. Please try again.",
		};
	}
}

/**
 * Get current admin user
 */
export async function getCurrentAdmin() {
	const session = await getSession();

	if (!session) {
		return null;
	}

	const supabase = await createClient();
	const { data, error } = await supabase
		.from("admin_users")
		.select("id, email, full_name, avatar_url, role, is_active")
		.eq("id", session.userId)
		.single();

	if (error || !data) {
		return null;
	}

	return data;
}

/**
 * Require admin authentication (redirect if not authenticated)
 */
export async function requireAdmin() {
	const admin = await getCurrentAdmin();

	if (!admin) {
		redirect("/login");
	}

	return admin;
}

/**
 * Change admin password
 */
export async function changePassword(
	currentPassword: string,
	newPassword: string
): Promise<{ success: boolean; error?: string }> {
	const session = await getSession();

	if (!session) {
		return { success: false, error: "Not authenticated" };
	}

	const supabase = await createClient();

	// Get current user
	const { data: adminUser, error: userError } = await supabase
		.from("admin_users")
		.select("password_hash")
		.eq("id", session.userId)
		.single();

	if (userError || !adminUser) {
		return { success: false, error: "User not found" };
	}

	// Verify current password
	const { data: passwordMatch } = await supabase.rpc("verify_password", {
		password_text: currentPassword,
		password_hash: adminUser.password_hash,
	});

	if (!passwordMatch) {
		return { success: false, error: "Current password is incorrect" };
	}

	// Hash new password
	const { data: newHash, error: hashError } = await supabase.rpc("crypt_password", {
		password_text: newPassword,
	});

	if (hashError || !newHash) {
		return { success: false, error: "Failed to hash new password" };
	}

	// Update password
	const { error: updateError } = await supabase
		.from("admin_users")
		.update({ password_hash: newHash })
		.eq("id", session.userId);

	if (updateError) {
		return { success: false, error: "Failed to update password" };
	}

	return { success: true };
}
