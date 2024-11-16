import type { EventData, ThorbisEventOptions } from "../types";
import { EventProcessor } from "../utils/EventProcessor";
import { debounce, formatTimestamp } from "../utils/performance";

export abstract class BaseTracker {
	protected options: ThorbisEventOptions;
	protected eventQueue: EventData[] = [];
	protected isEnabled: boolean = true;
	private lastEventTime: number = 0;
	private readonly MIN_EVENT_INTERVAL = 10; // Minimum ms between events
	private readonly QUEUE_PROCESS_DELAY = 1000; // 1 second delay for batching
	private static readonly TIME_UNITS = {
		ns: 1e-6,
		μs: 0.001,
		ms: 1,
		s: 1000,
		m: 60000,
		h: 3600000,
	};
	private _elementDataCache: WeakMap<HTMLElement, any> = new WeakMap();

	constructor(options: ThorbisEventOptions) {
		this.options = options;
		// Fix the debounce return type to match async function
		this.processQueue = debounce(async (...args: Parameters<typeof this.processQueue>) => {
			await this.processQueue.apply(this, args);
		}, this.QUEUE_PROCESS_DELAY);
	}

	abstract initialize(): void;

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
		// More efficient duration formatting using lookup table
		if (ms < BaseTracker.TIME_UNITS.μs) return `${(ms / BaseTracker.TIME_UNITS.ns).toFixed(0)}ns`;
		if (ms < BaseTracker.TIME_UNITS.ms) return `${(ms / BaseTracker.TIME_UNITS.μs).toFixed(0)}μs`;
		if (ms < BaseTracker.TIME_UNITS.s) return `${ms.toFixed(0)}ms`;
		if (ms < BaseTracker.TIME_UNITS.m) {
			return `${(ms / BaseTracker.TIME_UNITS.s).toFixed(1)}s`;
		}
		if (ms < BaseTracker.TIME_UNITS.h) {
			const minutes = Math.floor(ms / BaseTracker.TIME_UNITS.m);
			const seconds = ((ms % BaseTracker.TIME_UNITS.m) / BaseTracker.TIME_UNITS.s).toFixed(1);
			return `${minutes}m ${seconds}s`;
		}
		const hours = Math.floor(ms / BaseTracker.TIME_UNITS.h);
		const minutes = Math.floor((ms % BaseTracker.TIME_UNITS.h) / BaseTracker.TIME_UNITS.m);
		const seconds = ((ms % BaseTracker.TIME_UNITS.m) / BaseTracker.TIME_UNITS.s).toFixed(1);
		return `${hours}h ${minutes}m ${seconds}s`;
	}

	protected formatTimestamp(timestamp: number): string {
		return formatTimestamp(timestamp);
	}

	public getElementData(element: HTMLElement) {
		// Use WeakMap to cache element data
		if (!this._elementDataCache) {
			this._elementDataCache = new WeakMap();
		}

		let cachedData = this._elementDataCache.get(element);
		if (cachedData) return cachedData;

		const rect = element.getBoundingClientRect();
		const data = {
			tag: element.tagName.toLowerCase(),
			id: element.id || undefined,
			className: element.className || undefined,
			text: element.textContent?.slice(0, 100)?.trim() || undefined, // Limit text length
			href: element instanceof HTMLAnchorElement ? element.href : undefined,
			dimensions: {
				width: Math.round(rect.width),
				height: Math.round(rect.height),
				x: Math.round(rect.x),
				y: Math.round(rect.y),
			},
			attributes: this.getElementAttributes(element),
		};

		this._elementDataCache.set(element, data);
		return data;
	}

	protected getElementAttributes(element: HTMLElement): Record<string, string> {
		const attributes: Record<string, string> = {};
		for (const attr of element.attributes) {
			attributes[attr.name] = attr.value;
		}
		return attributes;
	}

	protected async processQueue(): Promise<void> {
		if (!this.eventQueue.length) return;

		const batch = this.eventQueue.splice(0, this.options.batchSize ?? 50);

		if (this.options.debug) {
			console.log(`[Thorbis] Processing batch of ${batch.length} events`);
		}

		try {
			await EventProcessor.processEvents(batch, undefined, this.options.debug);

			if (process.env.NODE_ENV !== "development") {
				this.options.onEvent?.(batch);
			}
		} catch (error) {
			if (this.options.debug) {
				console.warn("[Thorbis] Failed to process events:", error);
				// Requeue failed events
				this.eventQueue.unshift(...batch);
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

	public destroy(): void {
		this.clearEvents();
		this._elementDataCache = new WeakMap();
	}
}
