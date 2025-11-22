/**
 * User Data Utilities - Secure, Cached User Data Retrieval
 *
 * Performance optimizations:
 * - React cache() for request-level memoization
 * - Supabase RLS enforces security at database level
 * - Type-safe with full TypeScript support
 * - Automatic avatar generation if none provided
 */

import { cache } from "react";
import { isOnboardingComplete } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { getCurrentUser } from "./session";

export type UserStatus = "online" | "available" | "busy";

export type UserProfile = {
	id: string;
	full_name: string;
	email: string;
	avatar_url: string;
	bio?: string;
	phone?: string;
	status?: UserStatus;
	emailVerified: boolean;
	createdAt: Date;
};

/**
 * Get User Profile - Cached and Secure
 *
 * Fetches user data from both Supabase Auth and public.users table
 * Cached per request for optimal performance
 * RLS ensures users can only access their own data
 */
export const getUserProfile = cache(async (): Promise<UserProfile | null> => {
	try {
		// Get authenticated user from Supabase Auth
		const user = await getCurrentUser();
		if (!user) {
			return null;
		}

		const supabase = await createClient();
		if (!supabase) {
			// Return mock user for development
			return {
				id: "dev-user-1",
				name: "Development User",
				email: "dev@example.com",
				avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
				emailVerified: true,
				createdAt: new Date(),
			};
		}

		// Fetch user profile from public.users table (with RLS)
		const { data: profile, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		if (error) {
			return getUserProfileFromAuth(user);
		}

		// Merge auth data with profile data
		return {
			id: user.id,
			full_name:
				profile?.full_name ||
				user.user_metadata?.name ||
				user.email?.split("@")[0] ||
				"User",
			email: user.email || profile?.email || "",
			avatar_url:
				profile?.avatar_url ||
				user.user_metadata?.avatar_url ||
				generateAvatar(user.email || profile?.email),
			bio: profile?.bio || undefined,
			phone: profile?.phone || undefined,
			status: (profile?.status as UserStatus) || "online",
			emailVerified: !!user.email_confirmed_at,
			createdAt: new Date(profile?.created_at || user.created_at),
		};
	} catch (_error) {
		return {
			id: "dev-user-1",
			full_name: "Development User",
			email: "dev@example.com",
			avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
			emailVerified: true,
			createdAt: new Date(),
		};
	}
});

/**
 * Get User Profile from Auth Only
 *
 * Fallback when public.users table doesn't have the profile yet
 */
function getUserProfileFromAuth(user: any): UserProfile {
	return {
		id: user.id,
		full_name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
		email: user.email || "",
		avatar_url: user.user_metadata?.avatar_url || generateAvatar(user.email),
		emailVerified: !!user.email_confirmed_at,
		createdAt: new Date(user.created_at),
	};
}

/**
 * Generate Avatar URL
 *
 * Creates a unique avatar based on user email using DiceBear API
 * Falls back to initials if no email provided
 */
function generateAvatar(email?: string | null): string {
	if (!email) {
		return "https://api.dicebear.com/7.x/initials/svg?seed=User";
	}

	// Use email as seed for consistent avatar
	return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}&backgroundColor=0ea5e9&textColor=ffffff`;
}

/**
 * Get User Initials
 *
 * Extracts initials from user name for avatar fallback
 */
function getUserInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

/**
 * Format User Display Name
 *
 * Returns first name only for compact display
 */
function getUserDisplayName(name: string): string {
	return name.split(" ")[0] || name;
}

/**
 * Check if User Email is Verified
 *
 * Security check for features that require verified email
 */
const isUserEmailVerified = cache(async (): Promise<boolean> => {
	const user = await getCurrentUser();
	if (!user) {
		return false;
	}

	return !!user.email_confirmed_at;
});

/**
 * Get User Companies
 *
 * Fetches companies the user belongs to
 *
 * SECURITY: Uses service role because:
 * - Query filters to user's own memberships (user_id = authenticated user)
 * - JOIN to companies table causes RLS recursion with anon key
 * - User only sees their own team_members records
 * - Companies table has its own RLS protection
 */
export const getUserCompanies = cache(
	async (): Promise<
		Array<{
			id: string;
			name: string;
			logo?: string | null;
			plan: string;
			onboardingComplete?: boolean;
			hasPayment?: boolean;
		}>
	> => {
		try {
			const user = await getCurrentUser();
			if (!user) {
				return [];
			}

			// Use service role to bypass RLS recursion on JOIN
			// Query is safe: explicitly filtered to user's own records
			const supabase = await createServiceSupabaseClient();

			// Fetch user's companies via team_members join
			// Exclude archived companies (deleted_at IS NULL)
			const { data: memberships, error } = await supabase
				.from("company_memberships")
				.select(
					`
        company_id,
        companies!inner (
          id,
          name,
          logo,
          stripe_subscription_status,
          onboarding_progress,
          onboarding_completed_at,
          deleted_at
        )
      `,
				)
				.eq("user_id", user.id)
				.eq("status", "active")
				.is("companies.deleted_at", null); // Exclude archived companies

			if (error) {
				return [];
			}

			// Map to simplified structure with onboarding status
			// Deduplicate by company ID in case of multiple team_member records
			const companyMap = new Map<
				string,
				{
					id: string;
					name: string;
					logo?: string | null;
					plan: string;
					onboardingComplete: boolean;
					hasPayment: boolean;
				}
			>();

			memberships?.forEach((m: any) => {
				const companyId = m.companies.id;
				if (!companyMap.has(companyId)) {
					const subscriptionStatus = m.companies.stripe_subscription_status;
					const onboardingProgress =
						(m.companies.onboarding_progress as Record<string, unknown>) ||
						null;
					const onboardingComplete = isOnboardingComplete({
						progress: onboardingProgress,
						completedAt: m.companies.onboarding_completed_at ?? null,
					});
					const hasPayment =
						subscriptionStatus === "active" ||
						subscriptionStatus === "trialing";

					let planLabel = "Active";
					if (!(hasPayment && onboardingComplete)) {
						planLabel =
							subscriptionStatus === "incomplete"
								? "Incomplete Onboarding"
								: "Setup Required";
					}

					companyMap.set(companyId, {
						id: companyId,
						name: m.companies.name,
						logo: m.companies.logo,
						plan: planLabel,
						onboardingComplete,
						hasPayment,
					});
				}
			});

			return Array.from(companyMap.values());
		} catch (_error) {
			return [];
		}
	},
);

/**
 * Get User Company ID
 *
 * Gets the primary company ID for the current user
 * Returns null if user is not part of any company
 * Cached per request for optimal performance
 */
export const getUserCompanyId = cache(async (): Promise<string | null> => {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return null;
		}

		const supabase = await createClient();
		if (!supabase) {
			return null;
		}

		// Get first active company membership
		const { data: membership, error } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("status", "active")
			.limit(1)
			.single();

		if (error) {
			return null;
		}

		return membership?.company_id || null;
	} catch (_error) {
		return null;
	}
});

/**
 * Update User Profile
 *
 * Securely updates user profile data
 * RLS ensures users can only update their own profile
 */
async function updateUserProfile(
	updates: Partial<{
		full_name: string;
		bio: string;
		phone: string;
		avatar_url: string;
	}>,
): Promise<{ success: boolean; error?: string }> {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service not available" };
		}

		// Update profiles table (RLS enforced)
		const { error } = await supabase
			.from("profiles")
			.update({
				...updates,
				updated_at: new Date().toISOString(),
			})
			.eq("id", user.id);

		if (error) {
			return { success: false, error: error.message };
		}

		// If updating full_name or avatar_url, also update auth metadata
		if (updates.full_name || updates.avatar_url) {
			const { error: authError } = await supabase.auth.updateUser({
				data: {
					name: updates.full_name,
					avatar_url: updates.avatar_url,
				},
			});

			if (authError) {
				// Don't fail the whole operation if auth update fails
			}
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Update failed",
		};
	}
}
