import { getDB } from "./core/db";
import { logger } from "./utils/logger";
import type { EventData, UserProfile } from "./types";

/**
 * Updates or creates a user profile with new event data
 */
export async function updateUserProfile(userId: string, event: EventData): Promise<UserProfile | null> {
	try {
		const db = await getDB();
		if (!db) return null;

		const profile: UserProfile = (await db.get("profiles", userId)) || {
			userId,
			lastSeen: Date.now(),
			preferences: {},
			behaviors: {},
		};

		profile.lastSeen = Date.now();
		profile.behaviors[event.type] = (profile.behaviors[event.type] || 0) + 1;

		await db.put("profiles", profile);
		logger.info("Updated user profile", { userId, event: event.type });

		return profile;
	} catch (error) {
		logger.error("Failed to update user profile", error);
		return null;
	}
}

/**
 * Retrieves a user profile by ID
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
	try {
		const db = await getDB();
		if (!db) return null;
		return db.get("profiles", userId) || null;
	} catch (error) {
		logger.error("Failed to get user profile", error);
		return null;
	}
}

/**
 * Retrieves all user profiles
 */
export async function getAllProfiles(): Promise<UserProfile[]> {
	try {
		const db = await getDB();
		if (!db) return [];
		return db.getAll("profiles");
	} catch (error) {
		logger.error("Failed to get all profiles", error);
		return [];
	}
}
