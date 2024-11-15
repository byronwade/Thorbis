import type { EventData, ThorbisEventOptions } from "../types";

export abstract class BaseTracker {
	protected options: ThorbisEventOptions;
	protected eventQueue: EventData[] = [];
	protected isEnabled: boolean = true;
	private lastEventTime: number = 0;
	private readonly MIN_EVENT_INTERVAL = 100; // Minimum ms between events

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
			timestamp: Date.now(),
			sessionId: this.getSessionId(),
			userId: this.getUserId(),
			...data,
		};

		this.eventQueue.push(event);

		if (this.options.debug) {
			console.log(`[Thorbis] Tracked ${type} event:`, event);
		}

		this.processQueue();
	}

	protected formatDuration(ms: number): string {
		if (ms < 1000) return `${ms.toFixed(0)}ms`;
		if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
		if (ms < 3600000) {
			const minutes = Math.floor(ms / 60000);
			const seconds = ((ms % 60000) / 1000).toFixed(1);
			return `${minutes}m ${seconds}s`;
		}
		const hours = Math.floor(ms / 3600000);
		const minutes = Math.floor((ms % 3600000) / 60000);
		return `${hours}h ${minutes}m`;
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

	private processQueue() {
		if (this.options.debug) {
			console.log(`[Thorbis] Queue size: ${this.eventQueue.length}`);
		}

		if (this.eventQueue.length > 0) {
			const batch = this.eventQueue.splice(0, this.options.batchSize ?? 50);
			this.options.onEvent?.(batch);
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
