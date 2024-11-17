import { openDB, type IDBPDatabase } from "idb";
import { DB_NAME, DB_VERSION } from "../utils/constants";
import { logger } from "../utils/logger";
import type { AnalyticsDBSchema } from "../types/db";

/**
 * Singleton pattern for database connection
 * Manages IndexedDB connection and schema upgrades
 */
export const getDB = (() => {
	let dbPromise: Promise<IDBPDatabase<AnalyticsDBSchema>> | null = null;

	return () => {
		if (typeof window === "undefined") {
			logger.warn("Attempted to access DB in non-browser environment");
			return null;
		}
		if (!dbPromise) {
			logger.info("Initializing IndexedDB connection");
			dbPromise = openDB<AnalyticsDBSchema>(DB_NAME, DB_VERSION, {
				upgrade(db) {
					logger.info(`Upgrading DB to version ${DB_VERSION}`);
					if (!db.objectStoreNames.contains("events")) {
						const store = db.createObjectStore("events", {
							keyPath: "id",
							autoIncrement: true,
						});
						store.createIndex("timestamp", "timestamp");
						logger.info("Created events store");
					}
					if (!db.objectStoreNames.contains("profiles")) {
						db.createObjectStore("profiles", {
							keyPath: "userId",
						}).createIndex("lastSeen", "lastSeen");
						logger.info("Created profiles store");
					}
				},
			});
		}
		return dbPromise;
	};
})();
