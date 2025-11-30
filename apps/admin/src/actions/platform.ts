"use server";

/**
 * Platform Settings Actions
 *
 * Server actions for managing platform settings, feature flags, and maintenance mode.
 */

import { createAdminClient } from "@/lib/supabase/admin-client";
import { getAdminSession } from "@/lib/auth/session";

export interface PlatformSetting {
	key: string;
	value: unknown;
	description?: string;
	updated_by?: string;
	updated_at: string;
}

export interface FeatureFlag {
	key: string;
	enabled: boolean;
	description?: string;
}

/**
 * Get platform settings
 */
export async function getPlatformSettings() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const adminDb = createAdminClient();

		const { data: settings, error } = await adminDb
			.from("platform_settings")
			.select("*")
			.order("key", { ascending: true });

		if (error) {
			console.error("Failed to fetch platform settings:", error);
			return { data: [] };
		}

		return { data: settings || [] };
	} catch (error) {
		console.error("Failed to get platform settings:", error);
		return { data: [] };
	}
}

/**
 * Update platform setting
 */
export async function updatePlatformSetting(key: string, value: unknown) {
	const session = await getAdminSession();
	if (!session || !session.user) {
		return { error: "Unauthorized" };
	}

	try {
		const adminDb = createAdminClient();

		const { error } = await adminDb
			.from("platform_settings")
			.upsert({
				key,
				value,
				updated_by: session.user.id,
				updated_at: new Date().toISOString(),
			});

		if (error) {
			return { error: "Failed to update platform setting" };
		}

		return { success: true };
	} catch (error) {
		console.error("Failed to update platform setting:", error);
		return { error: error instanceof Error ? error.message : "Failed to update platform setting" };
	}
}

/**
 * Get maintenance mode status
 */
export async function getMaintenanceMode() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const settingsResult = await getPlatformSettings();

		if (settingsResult.error || !settingsResult.data) {
			return { enabled: false, message: "" };
		}

		const maintenanceSetting = settingsResult.data.find((s) => s.key === "maintenance_mode");
		const enabled = (maintenanceSetting?.value as { enabled?: boolean })?.enabled || false;
		const message = (maintenanceSetting?.value as { message?: string })?.message || "";

		return { enabled, message };
	} catch (error) {
		console.error("Failed to get maintenance mode:", error);
		return { enabled: false, message: "" };
	}
}

/**
 * Set maintenance mode
 */
export async function setMaintenanceMode(enabled: boolean, message?: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const result = await updatePlatformSetting("maintenance_mode", {
			enabled,
			message: message || "The platform is currently under maintenance. Please check back soon.",
			updated_at: new Date().toISOString(),
		});

		return result;
	} catch (error) {
		console.error("Failed to set maintenance mode:", error);
		return { error: error instanceof Error ? error.message : "Failed to set maintenance mode" };
	}
}

