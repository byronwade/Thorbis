import { storage } from "../services/storage";
import { logger } from "../utils/logger";
import type { BehaviorData, UserSession } from "../types";

export async function mergeSessionData() {
	try {
		const sessionData = Object.entries(localStorage)
			.filter(([key]) => key.startsWith("session-"))
			.map(([, value]) => JSON.parse(value));

		const mergedData = {
			behaviorData: sessionData.map((s) => s.behaviorData).flat(),
			sessions: sessionData.map((s) => s.session),
		};

		console.group("📊 Session Data Merged");
		console.log("Sessions:", mergedData.sessions.length);
		console.log("Behavior Data:", mergedData.behaviorData.length);
		console.groupEnd();

		logger.info("Merged session data", { sessions: mergedData.sessions.length });
		return mergedData;
	} catch (error) {
		console.error("❌ Failed to merge session data:", error);
		logger.error("Failed to merge session data", error);
		throw error;
	}
}

export class DataService {
	async storeBehaviorData(data: Partial<BehaviorData>) {
		try {
			const behaviorData: BehaviorData = {
				type: "custom",
				timestamp: Date.now(),
				data: data.data || {},
				...data,
			};

			console.group("📊 Storing Behavior Data");
			console.log("Type:", behaviorData.type);
			console.log("Data:", behaviorData.data);
			console.log("Timestamp:", new Date(behaviorData.timestamp).toISOString());
			console.groupEnd();

			await storage.storeBehaviorData(behaviorData);
			logger.info("Stored behavior data", behaviorData);
		} catch (error) {
			console.error("❌ Failed to store behavior data:", error);
			logger.error("Failed to store behavior data", error);
			throw error;
		}
	}

	async getCurrentSession(): Promise<UserSession | null> {
		try {
			const session = await storage.getCurrentSession();
			console.group("📊 Current Session");
			console.log("Session:", session);
			console.groupEnd();
			return session;
		} catch (error) {
			console.error("❌ Failed to get current session:", error);
			logger.error("Failed to get current session", error);
			return null;
		}
	}

	async getSessionBehaviorData(): Promise<BehaviorData[]> {
		try {
			const data = await storage.getSessionBehaviorData();
			console.group("📊 Session Behavior Data");
			console.log("Events:", data.length);
			console.log("Data:", data);
			console.groupEnd();
			return data;
		} catch (error) {
			console.error("❌ Failed to get session behavior data:", error);
			logger.error("Failed to get session behavior data", error);
			return [];
		}
	}
}

export const dataService = new DataService();
