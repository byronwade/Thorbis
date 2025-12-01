"use server";

/**
 * Users Management Actions
 *
 * Server actions for managing user data.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";

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

	// TODO: Log to audit log

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

	// TODO: Log to audit log

	return { success: true };
}

/**
 * Reset user password
 * 
 * Note: This should trigger a password reset email, not set a password directly.
 */
export async function resetUserPassword(userId: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	// TODO: Implement password reset via Supabase Auth Admin API
	// This requires SUPABASE_SERVICE_ROLE_KEY and admin.auth.resetPasswordForEmail()

	return { error: "Password reset not yet implemented" };
}



