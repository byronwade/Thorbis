import { logger } from "../utils/logger";
import type { BehaviorData, UserSession } from "../types";

interface StoredData {
	behaviorData: BehaviorData[];
	sessions: Record<string, UserSession>;
}

class StorageService {
	private sessionData: Map<string, UserSession> = new Map();
	private behaviorData: BehaviorData[] = [];
	private readonly MAX_CACHE_SIZE = 1000;
	private readonly CLEANUP_INTERVAL = 5 * 60 * 1000;

	constructor() {
		if (typeof window !== "undefined") {
			setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
		}
	}

	async init() {
		try {
			if (typeof window !== "undefined") {
				const savedData = localStorage.getItem("thorbis_analytics");
				if (savedData) {
					const parsed = JSON.parse(savedData) as StoredData;
					this.behaviorData = parsed.behaviorData || [];
					Object.entries(parsed.sessions || {}).forEach(([key, value]) => {
						this.sessionData.set(key, {
							...value,
							lastActive: value.lastActive || value.startTime || Date.now(),
						});
					});
				}
			}
			logger.info("Storage initialized", { events: this.behaviorData.length });
		} catch (error) {
			logger.error("Storage initialization failed", error);
		}
	}

	async getCurrentSession(): Promise<UserSession | null> {
		const currentSessionId = localStorage.getItem("thorbis_current_session");
		if (!currentSessionId) return null;

		const session = this.sessionData.get(currentSessionId);
		if (session) {
			session.lastActive = Date.now();
			this.sessionData.set(currentSessionId, session);
			this.persistData();
		}
		return session || null;
	}

	async storeBehaviorData(data: BehaviorData) {
		const enrichedData = {
			...data,
			performance: {
				timestamp: performance.now(),
				memory: (performance as any).memory?.usedJSHeapSize,
			},
		};

		this.behaviorData.push(enrichedData);
		logger.info(`Stored ${data.type} event`, enrichedData);

		if (this.behaviorData.length > this.MAX_CACHE_SIZE) {
			this.behaviorData = this.behaviorData.slice(-this.MAX_CACHE_SIZE);
		}

		this.persistData();
	}

	async getSessionBehaviorData(): Promise<BehaviorData[]> {
		return this.behaviorData;
	}

	private persistData() {
		if (typeof window === "undefined") return;

		try {
			const dataToStore = {
				behaviorData: this.behaviorData,
				sessions: Object.fromEntries(this.sessionData),
			};
			localStorage.setItem("thorbis_analytics", JSON.stringify(dataToStore));
		} catch (error) {
			logger.error("Failed to persist analytics data", error);
		}
	}

	private cleanup() {
		const now = Date.now();
		const SESSION_TIMEOUT = 30 * 60 * 1000;

		for (const [id, session] of this.sessionData.entries()) {
			if (now - session.lastActive > SESSION_TIMEOUT) {
				this.sessionData.delete(id);
				logger.info("Cleaned up inactive session", { id });
			}
		}

		const ONE_DAY = 24 * 60 * 60 * 1000;
		this.behaviorData = this.behaviorData.filter((data) => now - data.timestamp < ONE_DAY);

		this.persistData();
	}
}

export const storage = new StorageService();
