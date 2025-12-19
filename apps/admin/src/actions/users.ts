"use server";

/**
 * Users Management Actions
 *
 * Server actions for managing user data.
 * Uses Supabase Auth Admin API for authentication operations.
 */

import { createClient } from "@supabase/supabase-js";
import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";
import { logAdminAction } from "@/lib/admin/audit";

// Create admin Supabase client with service role key for auth operations
function getSupabaseAdmin() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !serviceRoleKey) {
		return null;
	}

	return createClient(supabaseUrl, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}

export interface UserWithDetails {
	id: string;
	email: string;
	full_name?: string;
	avatar_url?: string;
	phone?: string;
	created_at: string;
	updated_at?: string;
	last_sign_in_at?: string;
	companies: Array<{
		company_id: string;
		company_name: string;
		role?: string;
		status: string;
	}>;
}

/**
 * Get all users with details
 */
export async function getUsersWithDetails(limit: number = 100) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	// Get users
	const { data: users, error: usersError } = await webDb
		.from("users")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(limit);

	if (usersError || !users) {
		return { error: "Failed to fetch users" };
	}

	// Get company memberships for each user
	const usersWithDetails: UserWithDetails[] = await Promise.all(
		users.map(async (user) => {
			const { data: memberships } = await webDb
				.from("company_memberships")
				.select(
					`
					company_id,
					status,
					companies!inner(
						id,
						name
					)
				`,
				)
				.eq("user_id", user.id);

			return {
				id: user.id,
				email: user.email,
				full_name: user.full_name,
				avatar_url: user.avatar_url,
				phone: user.phone,
				created_at: user.created_at,
				updated_at: user.updated_at,
				last_sign_in_at: user.last_sign_in_at,
				companies:
					memberships?.map((m: any) => ({
						company_id: m.company_id,
						company_name: m.companies?.name || "Unknown",
						status: m.status,
					})) || [],
			};
		}),
	);

	return { data: usersWithDetails };
}

/**
 * Get user by ID with full details
 */
export async function getUserById(userId: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	// Get user
	const { data: user, error: userError } = await webDb
		.from("users")
		.select("*")
		.eq("id", userId)
		.single();

	if (userError || !user) {
		return { error: "User not found" };
	}

	// Get company memberships
	const { data: memberships } = await webDb
		.from("company_memberships")
		.select(
			`
			company_id,
			status,
			role_id,
			companies!inner(
				id,
				name
			),
			custom_roles(
				id,
				name
			)
		`,
		)
		.eq("user_id", user.id);

	return {
		data: {
			...user,
			memberships: memberships || [],
		},
	};
}

/**
 * Update user
 */
export async function updateUser(
	userId: string,
	updates: {
		full_name?: string;
		email?: string;
		phone?: string;
	},
) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	// Get current user data for audit log
	const { data: beforeData } = await webDb
		.from("users")
		.select("*")
		.eq("id", userId)
		.single();

	const { data, error } = await webDb
		.from("users")
		.update({
			...updates,
			updated_at: new Date().toISOString(),
		})
		.eq("id", userId)
		.select()
		.single();

	if (error) {
		return { error: "Failed to update user" };
	}

	// Log to audit log
	await logAdminAction({
		adminUserId: session.userId,
		adminEmail: session.email || "",
		action: "user_updated",
		resourceType: "user",
		resourceId: userId,
		details: {
			before: beforeData,
			after: data,
			changes: updates,
		},
	});

	return { data };
}

/**
 * Suspend or activate user
 */
export async function setUserStatus(userId: string, status: "active" | "suspended") {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	// Get user details for logging
	const { data: user } = await webDb
		.from("users")
		.select("email, full_name")
		.eq("id", userId)
		.single();

	// Update all company memberships for this user
	const { error } = await webDb
		.from("company_memberships")
		.update({
			status,
			updated_at: new Date().toISOString(),
		})
		.eq("user_id", userId);

	if (error) {
		return { error: "Failed to update user status" };
	}

	// Log to audit log
	await logAdminAction({
		adminUserId: session.userId,
		adminEmail: session.email || "",
		action: status === "suspended" ? "user_suspended" : "user_activated",
		resourceType: "user",
		resourceId: userId,
		details: {
			user_email: user?.email,
			user_name: user?.full_name,
			new_status: status,
		},
	});

	return { success: true };
}

/**
 * Reset user password
 *
 * Triggers a password reset email via Supabase Auth Admin API.
 */
export async function resetUserPassword(userId: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const supabaseAdmin = getSupabaseAdmin();
	if (!supabaseAdmin) {
		return { error: "Admin client not configured. SUPABASE_SERVICE_ROLE_KEY is required." };
	}

	const webDb = createWebClient();

	// Get user's email
	const { data: user, error: userError } = await webDb
		.from("users")
		.select("email, full_name")
		.eq("id", userId)
		.single();

	if (userError || !user?.email) {
		return { error: "User not found or has no email" };
	}

	try {
		// Use Supabase Auth Admin API to generate a password reset link
		const { data, error } = await supabaseAdmin.auth.admin.generateLink({
			type: "recovery",
			email: user.email,
			options: {
				redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
			},
		});

		if (error) {
			console.error("[Users] Password reset error:", error);
			return { error: `Failed to generate reset link: ${error.message}` };
		}

		// The link is generated but we also need to send the email
		// Supabase handles this automatically, but we can also use a custom email
		const { error: emailError } = await supabaseAdmin.auth.resetPasswordForEmail(
			user.email,
			{
				redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
			}
		);

		if (emailError) {
			console.error("[Users] Password reset email error:", emailError);
			return { error: `Failed to send reset email: ${emailError.message}` };
		}

		// Log to audit log
		await logAdminAction({
			adminUserId: session.userId,
			adminEmail: session.email || "",
			action: "password_reset_initiated",
			resourceType: "user",
			resourceId: userId,
			details: {
				user_email: user.email,
				user_name: user.full_name,
			},
		});

		return {
			success: true,
			message: `Password reset email sent to ${user.email}`,
		};
	} catch (error: any) {
		console.error("[Users] Password reset exception:", error);
		return { error: error.message || "Failed to reset password" };
	}
}

/**
 * Force update user email (admin only)
 */
export async function updateUserEmail(userId: string, newEmail: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const supabaseAdmin = getSupabaseAdmin();
	if (!supabaseAdmin) {
		return { error: "Admin client not configured" };
	}

	const webDb = createWebClient();

	// Get current user data
	const { data: user } = await webDb
		.from("users")
		.select("email")
		.eq("id", userId)
		.single();

	const oldEmail = user?.email;

	try {
		// Update email in Supabase Auth
		const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
			userId,
			{ email: newEmail, email_confirm: true }
		);

		if (authError) {
			return { error: `Failed to update auth email: ${authError.message}` };
		}

		// Update email in users table
		const { error: dbError } = await webDb
			.from("users")
			.update({
				email: newEmail,
				updated_at: new Date().toISOString(),
			})
			.eq("id", userId);

		if (dbError) {
			return { error: `Failed to update user email in database: ${dbError.message}` };
		}

		// Log to audit log
		await logAdminAction({
			adminUserId: session.userId,
			adminEmail: session.email || "",
			action: "user_email_updated",
			resourceType: "user",
			resourceId: userId,
			details: {
				old_email: oldEmail,
				new_email: newEmail,
			},
		});

		return { success: true };
	} catch (error: any) {
		return { error: error.message || "Failed to update email" };
	}
}

/**
 * Delete user (soft delete - deactivates auth and marks as deleted)
 */
export async function deleteUser(userId: string, reason?: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const supabaseAdmin = getSupabaseAdmin();
	if (!supabaseAdmin) {
		return { error: "Admin client not configured" };
	}

	const webDb = createWebClient();

	// Get user data for logging
	const { data: user } = await webDb
		.from("users")
		.select("email, full_name")
		.eq("id", userId)
		.single();

	try {
		// Soft delete: Ban the user in Supabase Auth
		const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
			userId,
			{ ban_duration: "876000h" } // ~100 years
		);

		if (authError) {
			return { error: `Failed to disable user auth: ${authError.message}` };
		}

		// Update all company memberships to deleted
		await webDb
			.from("company_memberships")
			.update({
				status: "deleted",
				updated_at: new Date().toISOString(),
			})
			.eq("user_id", userId);

		// Mark user as deleted in users table
		await webDb
			.from("users")
			.update({
				deleted_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.eq("id", userId);

		// Log to audit log
		await logAdminAction({
			adminUserId: session.userId,
			adminEmail: session.email || "",
			action: "user_deleted",
			resourceType: "user",
			resourceId: userId,
			details: {
				user_email: user?.email,
				user_name: user?.full_name,
				reason,
			},
		});

		return { success: true };
	} catch (error: any) {
		return { error: error.message || "Failed to delete user" };
	}
}



