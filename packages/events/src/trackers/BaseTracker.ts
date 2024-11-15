import type { EventData, ThorbisEventOptions } from "../types";
import { EventProcessor } from "../utils/EventProcessor";

export abstract class BaseTracker {
	protected options: ThorbisEventOptions;
	protected eventQueue: EventData[] = [];
	protected isEnabled: boolean = true;
	private lastEventTime: number = 0;
	private readonly MIN_EVENT_INTERVAL = 10; // Minimum ms between events

	constructor(options: ThorbisEventOptions) {
		this.options = options;
	}

	abstract initialize(): void;
	abstract destroy(): void;

	protected trackEvent(type: string, data: Partial<EventData>) {
		const now = Date.now();
		if (now - this.lastEventTime < this.MIN_EVENT_INTERVAL) {
			return; // Skip if too soon
		}
		this.lastEventTime = now;

		if (!this.isEnabled || typeof window === "undefined") return;

		const event: EventData = {
			type,
			timestamp: now,
			sessionId: this.getSessionId(),
			userId: this.getUserId(),
			duration: {
				raw: data.duration?.raw || 0,
				formatted: data.duration?.raw ? this.formatDuration(data.duration.raw) : "0ms",
			},
			...data,
		};

		this.eventQueue.push(event);

		if (this.options.debug) {
			console.log(`[Thorbis] Tracked ${type} event:`, {
				...event,
				time: this.formatTimestamp(now),
				duration: event.duration?.formatted,
				metadata: {
					...event.metadata,
					timestamp: this.formatTimestamp(now),
					duration: event.duration?.formatted,
				},
			});
		}

		this.processQueue();
	}

	protected formatDuration(ms: number): string {
		// For nanoseconds (less than 1 microsecond)
		if (ms < 0.001) {
			return `${(ms * 1000000).toFixed(0)}ns`;
		}

		// For microseconds (less than 1ms)
		if (ms < 1) {
			return `${(ms * 1000).toFixed(0)}μs`;
		}

		// For milliseconds (less than 1 second)
		if (ms < 1000) {
			return `${ms.toFixed(0)}ms`;
		}

		// For seconds (less than 1 minute)
		if (ms < 60000) {
			const seconds = ms / 1000;
			return `${seconds.toFixed(1)}s`;
		}

		// For minutes (less than 1 hour)
		if (ms < 3600000) {
			const minutes = Math.floor(ms / 60000);
			const seconds = ((ms % 60000) / 1000).toFixed(1);
			return `${minutes}m ${seconds}s`;
		}

		// For hours
		const hours = Math.floor(ms / 3600000);
		const minutes = Math.floor((ms % 3600000) / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(1);
		return `${hours}h ${minutes}m ${seconds}s`;
	}

	protected formatTimestamp(timestamp: number): string {
		const date = new Date(timestamp);
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		const seconds = date.getSeconds().toString().padStart(2, "0");
		const ms = date.getMilliseconds().toString().padStart(3, "0");
		return `${hours}:${minutes}:${seconds}.${ms}`;
	}

	public getElementData(element: HTMLElement) {
		const rect = element.getBoundingClientRect();
		return {
			tag: element.tagName.toLowerCase(),
			id: element.id || undefined,
			className: element.className || undefined,
			text: element.textContent?.trim() || undefined,
			href: (element as HTMLAnchorElement).href || undefined,
			dimensions: {
				width: rect.width,
				height: rect.height,
				x: rect.x,
				y: rect.y,
			},
			attributes: this.getElementAttributes(element),
		};
	}

	protected getElementAttributes(element: HTMLElement): Record<string, string> {
		const attributes: Record<string, string> = {};
		for (const attr of element.attributes) {
			attributes[attr.name] = attr.value;
		}
		return attributes;
	}

	private async processQueue() {
		if (this.options.debug) {
			console.log(`[Thorbis] Queue size: ${this.eventQueue.length}`);
		}

		if (this.eventQueue.length > 0) {
			const batch = this.eventQueue.splice(0, this.options.batchSize ?? 50);

			try {
				await EventProcessor.processEvents(batch, undefined, this.options.debug);

				if (process.env.NODE_ENV !== "development") {
					this.options.onEvent?.(batch);
				}
			} catch (error) {
				if (this.options.debug) {
					console.warn("[Thorbis] Failed to process events:", error);
				}
			}
		}
	}

	protected getSessionId(): string {
		return `session-${Date.now()}`;
	}

	protected getUserId(): string {
		return this.options.userId || `user-${Math.random().toString(36).substr(2, 9)}`;
	}

	enable(): void {
		this.isEnabled = true;
	}

	disable(): void {
		this.isEnabled = false;
	}

	clearEvents(): void {
		this.eventQueue = [];
	}

	getEvents(): EventData[] {
		return [...this.eventQueue];
	}
}
