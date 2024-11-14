import type { EventData, ThorbisEventOptions } from "../types";

export abstract class BaseTracker {
	protected options: ThorbisEventOptions;
	protected isEnabled: boolean = true;
	protected eventQueue: EventData[] = [];

	constructor(options: ThorbisEventOptions) {
		this.options = {
			sampleRate: 1,
			batchSize: 50,
			...options,
		};
	}

	abstract initialize(): void;
	abstract destroy(): void;

	protected trackEvent(eventType: string, data?: any) {
		if (!this.isEnabled || Math.random() > (this.options.sampleRate ?? 1)) return;

		const event: EventData = {
			type: eventType,
			timestamp: Date.now(),
			sessionId: this.getSessionId(),
			userId: this.getUserId(),
			...data,
		};

		this.eventQueue.push(event);
		this.processQueue();
	}

	protected formatDuration(ms: number): string {
		if (ms < 0) return "0ms";
		if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
		if (ms < 1000) return `${ms.toFixed(2)}ms`;
		if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(2);
		return `${minutes}m ${seconds}s`;
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
		if (this.eventQueue.length >= (this.options.batchSize ?? 50)) {
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
