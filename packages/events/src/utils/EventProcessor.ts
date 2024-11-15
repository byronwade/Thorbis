export class EventProcessor {
	private static readonly MAX_RETRIES = 3;
	private static readonly RETRY_DELAY = 2000;
	private static readonly DEFAULT_ENDPOINT = "http://localhost:3010/events";
	private static readonly MAX_STORED_EVENTS = 1000;

	static async processEvents(events: any[], endpoint: string = EventProcessor.DEFAULT_ENDPOINT, debug: boolean = false): Promise<void> {
		if (process.env.NODE_ENV === "development") {
			if (debug) {
				console.log("[Thorbis] Development mode - events:", events);
			}
			await this.storeEvents(events);
			return;
		}

		let retries = 0;

		while (retries < this.MAX_RETRIES) {
			try {
				const response = await fetch(endpoint, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						events,
						timestamp: Date.now(),
						debug,
					}),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				return;
			} catch (error) {
				retries++;
				if (debug) {
					console.warn(`[Thorbis] Event processing attempt ${retries} failed:`, error);
				}

				if (retries === this.MAX_RETRIES) {
					await this.storeEvents(events);
					return;
				}

				await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
			}
		}
	}

	private static async storeEvents(events: any[]): Promise<void> {
		try {
			const storedEvents = this.getStoredEvents();
			const updatedEvents = [...storedEvents, ...events].slice(-this.MAX_STORED_EVENTS); // Keep last N events

			localStorage.setItem("thorbis_events", JSON.stringify(updatedEvents));

			if (process.env.NODE_ENV === "development") {
				console.log(`[Thorbis] Stored ${events.length} events locally`);
			}
		} catch (error) {
			console.warn("[Thorbis] Failed to store events:", error);
		}
	}

	static getStoredEvents(): any[] {
		try {
			return JSON.parse(localStorage.getItem("thorbis_events") || "[]");
		} catch {
			return [];
		}
	}

	static clearStoredEvents(): void {
		try {
			localStorage.removeItem("thorbis_events");
		} catch (error) {
			console.warn("[Thorbis] Failed to clear stored events:", error);
		}
	}
}
