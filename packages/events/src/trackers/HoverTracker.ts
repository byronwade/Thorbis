import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";

export class HoverTracker extends BaseTracker {
	private activeHovers: WeakMap<
		HTMLElement,
		{
			startTime: number;
			position: { x: number; y: number };
			hoverCount: number;
		}
	> = new WeakMap();

	private readonly HOVER_THRESHOLD = 100;
	private readonly HOVER_RESET_DELAY = 2000;
	private readonly PROCESS_BATCH_SIZE = 10;
	private readonly THROTTLE_MS = 150;

	private boundHoverStart: (e: MouseEvent) => void;
	private boundHoverEnd: (e: MouseEvent) => void;
	private lastProcessTime: number = 0;
	private pendingHovers: Set<HTMLElement> = new Set();
	private processingTimeout: number | null = null;

	private readonly TRACKABLE_TAGS = new Set(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "IMG", "VIDEO", "AUDIO", "CANVAS", "SVG", "DETAILS", "SUMMARY"]);

	constructor(options: ThorbisEventOptions) {
		super(options);
		this.boundHoverStart = this.throttle(this.handleHoverStart.bind(this), this.THROTTLE_MS);
		this.boundHoverEnd = this.throttle(this.handleHoverEnd.bind(this), this.THROTTLE_MS);
	}

	initialize(): void {
		if (typeof window === "undefined") return;

		document.addEventListener("mouseover", this.boundHoverStart, { passive: true });
		document.addEventListener("mouseout", this.boundHoverEnd, { passive: true });

		this.setupOptimizedObserver();
	}

	private throttle(func: Function, limit: number): any {
		let inThrottle = false;
		return function (this: any, ...args: any[]) {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	}

	private setupOptimizedObserver(): void {
		const observer = new MutationObserver(
			this.throttle((mutations: MutationRecord[]) => {
				let shouldUpdate = false;
				for (const mutation of mutations) {
					if (mutation.type === "childList" && Array.from(mutation.addedNodes).some((node) => node instanceof HTMLElement && this.TRACKABLE_TAGS.has(node.tagName))) {
						shouldUpdate = true;
						break;
					}
				}
				if (shouldUpdate) {
					this.detectAndObserveElements();
				}
			}, 1000)
		);

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: false,
			characterData: false,
		});
	}

	private isTrackableElement(element: HTMLElement): boolean {
		if (this.TRACKABLE_TAGS.has(element.tagName)) return true;

		if (element.hasAttribute("role") || element.onclick || element.hasAttribute("onclick")) {
			return true;
		}

		const style = window.getComputedStyle(element);
		return style.cursor === "pointer";
	}

	private handleHoverStart(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		if (!target || !(target instanceof HTMLElement)) return;

		if (!this.isTrackableElement(target)) return;

		const now = Date.now();
		this.pendingHovers.add(target);

		if (!this.processingTimeout && now - this.lastProcessTime > this.THROTTLE_MS) {
			this.processingTimeout = window.setTimeout(() => this.processHoverBatch(), this.THROTTLE_MS);
		}
	}

	private processHoverBatch(): void {
		this.processingTimeout = null;
		this.lastProcessTime = Date.now();

		const elements = Array.from(this.pendingHovers).slice(0, this.PROCESS_BATCH_SIZE);
		elements.forEach((element) => {
			this.processHoverStart(element);
			this.pendingHovers.delete(element);
		});

		if (this.pendingHovers.size > 0) {
			this.processingTimeout = window.setTimeout(() => this.processHoverBatch(), this.THROTTLE_MS);
		}
	}

	private processHoverStart(element: HTMLElement): void {
		const now = Date.now();
		const existing = this.activeHovers.get(element);

		if (existing) {
			existing.hoverCount++;
			existing.startTime = now;
		} else {
			this.activeHovers.set(element, {
				startTime: now,
				position: { x: 0, y: 0 },
				hoverCount: 1,
			});
		}
	}

	private handleHoverEnd = (event: MouseEvent): void => {
		const target = event.target as HTMLElement;
		if (!target || !(target instanceof HTMLElement)) return;

		if (!this.isTrackableElement(target)) return;

		const hoverData = this.activeHovers.get(target);
		if (hoverData) {
			const now = Date.now();
			const duration = now - hoverData.startTime;

			if (duration >= this.HOVER_THRESHOLD) {
				this.trackEvent("hover", {
					element: this.getElementData(target),
					duration: {
						raw: duration,
						formatted: this.formatDuration(duration),
					},
					position: hoverData.position,
					metadata: {
						elementType: this.getElementType(target),
						elementContent: this.getElementContent(target),
						category: this.getElementCategory(target),
						interactable: true,
						attributes: this.getRelevantAttributes(target),
						eventTime: this.formatTimestamp(now),
						startTime: this.formatTimestamp(hoverData.startTime),
						endTime: this.formatTimestamp(now),
						hoverCount: hoverData.hoverCount.toString(),
					},
				});
			}
			this.activeHovers.delete(target);
		}
	};

	private detectAndObserveElements(): void {
		// Find all trackable elements
		const elements = document.querySelectorAll("*");
		elements.forEach((element) => {
			if (element instanceof HTMLElement && this.isTrackableElement(element)) {
				const elementId = this.getElementIdentifier(element);
				if (!this.activeHovers.has(element)) {
					this.activeHovers.set(element, {
						startTime: Date.now(),
						position: { x: 0, y: 0 },
						hoverCount: 0,
					});
				}
			}
		});

		// Set up observer for dynamic elements
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "childList") {
					mutation.addedNodes.forEach((node) => {
						if (node instanceof HTMLElement && this.isTrackableElement(node)) {
							const elementId = this.getElementIdentifier(node);
							if (!this.activeHovers.has(node)) {
								this.activeHovers.set(node, {
									startTime: Date.now(),
									position: { x: 0, y: 0 },
									hoverCount: 0,
								});
							}
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	private getElementIdentifier(element: HTMLElement): string {
		return `${element.tagName}-${element.id || element.className || Date.now()}`;
	}

	destroy(): void {
		document.removeEventListener("mouseover", this.boundHoverStart);
		document.removeEventListener("mouseout", this.boundHoverEnd);
		if (this.processingTimeout) {
			window.clearTimeout(this.processingTimeout);
		}
		this.pendingHovers.clear();
	}

	private getElementType(element: HTMLElement): string {
		if (element instanceof HTMLInputElement) {
			return `input-${element.type}`;
		}
		if (element instanceof HTMLButtonElement) {
			return "button";
		}
		if (element instanceof HTMLAnchorElement) {
			return "link";
		}
		if (element instanceof HTMLImageElement) {
			return "image";
		}
		if (element instanceof HTMLVideoElement) {
			return "video";
		}
		if (element instanceof HTMLAudioElement) {
			return "audio";
		}
		if (element instanceof HTMLSelectElement) {
			return "select";
		}
		if (element instanceof HTMLTextAreaElement) {
			return "textarea";
		}

		const role = element.getAttribute("role");
		if (role) return `role-${role}`;

		return element.tagName.toLowerCase();
	}

	private getElementContent(element: HTMLElement): string {
		if (element instanceof HTMLImageElement) {
			return element.alt || element.title || "image";
		}
		if (element instanceof HTMLInputElement) {
			return element.placeholder || element.value || element.type;
		}
		if (element instanceof HTMLAnchorElement) {
			return element.textContent?.trim() || element.title || element.href;
		}
		if (element instanceof HTMLButtonElement) {
			return element.textContent?.trim() || element.value || "button";
		}

		return element.textContent?.trim() || "";
	}

	private getElementCategory(element: HTMLElement): string {
		if (element instanceof HTMLAnchorElement) {
			return "navigation";
		}
		if (element instanceof HTMLButtonElement || element.getAttribute("role") === "button") {
			return "interactive";
		}
		if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
			return "form";
		}
		if (element instanceof HTMLImageElement || element instanceof HTMLVideoElement || element instanceof HTMLAudioElement) {
			return "media";
		}
		if (element.closest("nav")) {
			return "navigation";
		}
		if (element.closest("form")) {
			return "form";
		}

		return "other";
	}

	private getRelevantAttributes(element: HTMLElement): Record<string, string> {
		const relevantAttrs = ["id", "class", "name", "type", "role", "aria-label", "aria-describedby", "title", "placeholder", "href", "src", "alt"];

		const attributes: Record<string, string> = {};

		relevantAttrs.forEach((attr) => {
			const value = element.getAttribute(attr);
			if (value) {
				attributes[attr] = value;
			}
		});

		return attributes;
	}
}
