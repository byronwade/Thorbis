import type { EventData } from "../types";

type EventFilter = Partial<EventData>;

export interface StorageAdapter {
	store(events: EventData[]): Promise<void>;
	retrieve(filter?: EventFilter): Promise<EventData[]>;
	clear(): Promise<void>;
}

export class StorageManager {
	private adapter: StorageAdapter;
	private batchQueue: EventData[] = [];
	private batchSize: number;
	private flushInterval: NodeJS.Timeout | null = null;

	constructor(adapter: StorageAdapter, batchSize: number = 50) {
		this.adapter = adapter;
		this.batchSize = batchSize;
		this.startPeriodicFlush();
	}

	async addEvents(events: EventData[]): Promise<void> {
		console.log("[Thorbis] Adding events to storage:", events.length);
		this.batchQueue.push(...events);

		if (this.batchQueue.length >= this.batchSize) {
			await this.flush();
		}
	}

	private async flush(): Promise<void> {
		if (this.batchQueue.length === 0) return;

		const batch = this.batchQueue.splice(0, this.batchSize);
		console.log("[Thorbis] Flushing events to storage:", batch.length);
		await this.adapter.store(batch);
	}

	private startPeriodicFlush(): void {
		this.flushInterval = setInterval(async () => {
			await this.flush();
		}, 30000); // Flush every 30 seconds
	}

	async destroy(): Promise<void> {
		if (this.flushInterval) {
			clearInterval(this.flushInterval);
		}
		await this.flush(); // Final flush
	}
}
