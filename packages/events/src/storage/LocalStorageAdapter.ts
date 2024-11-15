import type { StorageAdapter } from "./StorageManager";
import type { EventData } from "../types";

type EventFilter = Partial<EventData>;

export class LocalStorageAdapter implements StorageAdapter {
	private readonly STORAGE_KEY = "thorbis_analytics_events";

	async store(events: EventData[]): Promise<void> {
		try {
			const existing = this.getStoredEvents();
			const updated = [...existing, ...events];

			// Keep only last 1000 events to prevent storage overflow
			const trimmed = updated.slice(-1000);
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
		} catch (error) {
			console.error("Failed to store events:", error);
		}
	}

	async retrieve(filter?: EventFilter): Promise<EventData[]> {
		const events = this.getStoredEvents();
		if (!filter) return events;

		return events.filter((event) => {
			return Object.entries(filter).every(([key, value]) => {
				const typedKey = key as keyof EventData;
				return event[typedKey] === value;
			});
		});
	}

	async clear(): Promise<void> {
		localStorage.removeItem(this.STORAGE_KEY);
	}

	private getStoredEvents(): EventData[] {
		try {
			const stored = localStorage.getItem(this.STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	}
}
