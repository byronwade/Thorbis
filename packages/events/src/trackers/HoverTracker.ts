import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";

export class HoverTracker extends BaseTracker {
	private hoverStartTimes: Map<string, number> = new Map();
	private readonly HOVER_THRESHOLD = 100; // ms
	private boundHoverStart: (e: MouseEvent) => void;
	private boundHoverEnd: (e: MouseEvent) => void;

	constructor(options: ThorbisEventOptions) {
		super(options);
		this.boundHoverStart = this.handleHoverStart.bind(this);
		this.boundHoverEnd = this.handleHoverEnd.bind(this);
	}

	initialize(): void {
		if (typeof window === "undefined") return;

		document.addEventListener("mouseover", this.boundHoverStart, true);
		document.addEventListener("mouseout", this.boundHoverEnd, true);

		if (this.options.debug) {
			console.log("[Thorbis] Hover tracking initialized at", this.formatTimestamp(Date.now()));
			this.logInteractiveElements();
		}
	}

	private logInteractiveElements(): void {
		const elements = document.querySelectorAll('a, button, input, textarea, select, [role="button"], [role="link"], [onclick], [href]');
		console.log("[Thorbis] Found interactive elements:", elements.length);
		elements.forEach((el) => {
			console.log("[Thorbis] Interactive element:", {
				tag: el.tagName,
				text: el.textContent?.trim(),
				href: (el as HTMLAnchorElement).href,
				role: el.getAttribute("role"),
				isInteractive: this.isInteractiveElement(el as HTMLElement),
			});
		});
	}

	private handleHoverStart(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		const now = Date.now();

		if (this.options.debug) {
			console.log("[Thorbis] Mouse over event:", {
				time: this.formatTimestamp(now),
				target: target.tagName,
				text: target.textContent?.trim(),
				isInteractive: this.isInteractiveElement(target),
			});
		}

		const interactiveElement = this.isInteractiveElement(target) ? target : this.findClosestInteractiveElement(target);

		if (!interactiveElement) return;

		const elementId = this.getElementIdentifier(interactiveElement);
		if (!this.hoverStartTimes.has(elementId)) {
			this.hoverStartTimes.set(elementId, now);
			if (this.options.debug) {
				console.log("[Thorbis] Started tracking hover:", {
					time: this.formatTimestamp(now),
					element: interactiveElement.tagName,
					text: interactiveElement.textContent?.trim(),
					id: elementId,
				});
			}
		}
	}

	private handleHoverEnd(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		const now = Date.now();
		const interactiveElement = this.isInteractiveElement(target) ? target : this.findClosestInteractiveElement(target);

		if (!interactiveElement) return;

		const elementId = this.getElementIdentifier(interactiveElement);
		const startTime = this.hoverStartTimes.get(elementId);

		if (startTime) {
			const duration = now - startTime;
			if (this.options.debug) {
				console.log("[Thorbis] Hover end detected:", {
					time: this.formatTimestamp(now),
					element: interactiveElement.tagName,
					duration: this.formatDuration(duration),
					threshold: this.formatDuration(this.HOVER_THRESHOLD),
				});
			}

			if (duration >= this.HOVER_THRESHOLD) {
				this.trackEvent("hover", {
					element: this.getElementData(interactiveElement),
					duration: {
						raw: duration,
						formatted: this.formatDuration(duration),
					},
					timestamp: now,
					metadata: {
						elementType: this.getElementType(interactiveElement),
						elementContent: this.getElementContent(interactiveElement),
						category: this.getElementCategory(interactiveElement),
						interactable: true,
						attributes: this.getRelevantAttributes(interactiveElement),
					},
				});

				if (this.options.debug) {
					console.log("[Thorbis] Hover event tracked:", {
						time: this.formatTimestamp(now),
						element: interactiveElement.tagName,
						duration: this.formatDuration(duration),
						content: this.getElementContent(interactiveElement),
					});
				}
			}
			this.hoverStartTimes.delete(elementId);
		}
	}

	private isInteractiveElement(element: HTMLElement): boolean {
		if (element.closest("a")) return true;

		if (element.tagName === "A" || element.tagName === "BUTTON" || element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT" || element.hasAttribute("href") || element.hasAttribute("onclick") || element.getAttribute("role") === "button" || element.getAttribute("role") === "link") {
			return true;
		}

		const style = window.getComputedStyle(element);
		if (style.cursor === "pointer") return true;

		return false;
	}

	private findClosestInteractiveElement(element: HTMLElement): HTMLElement | null {
		if (this.isInteractiveElement(element)) {
			return element;
		}

		let current = element.parentElement;
		while (current) {
			if (this.isInteractiveElement(current)) {
				return current;
			}
			current = current.parentElement;
		}

		return null;
	}

	private isTrackableElement(element: HTMLElement): boolean {
		const isNextLink = element.closest("a[href]") !== null;

		const isInteractive = element.tagName === "BUTTON" || element.tagName === "A" || element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT" || element instanceof HTMLButtonElement || element.getAttribute("role") === "button" || element.getAttribute("role") === "link" || element.onclick !== null || getComputedStyle(element).cursor === "pointer";

		const hasText = Boolean(element.textContent?.trim());

		const isCode = element.tagName === "CODE" || element.closest("code") !== null;

		const isImage = element.tagName === "IMG" || element instanceof HTMLImageElement;

		return isNextLink || isInteractive || hasText || isCode || isImage;
	}

	private getElementCategory(element: HTMLElement): string {
		if (element.tagName === "A" || element.closest("a[href]")) return "link";
		if (element.tagName === "BUTTON" || element.getAttribute("role") === "button") return "button";
		if (element.tagName === "CODE" || element.closest("code")) return "code";
		if (element.tagName === "IMG" || element instanceof HTMLImageElement) return "image";
		if (element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT") return "form";
		if (element.textContent?.trim()) return "text";
		return "other";
	}

	private getRelevantAttributes(element: HTMLElement): Record<string, string> {
		const attributes: Record<string, string> = {};
		const relevantAttrs = ["id", "class", "name", "type", "role", "aria-label", "placeholder", "href", "title", "value"];

		relevantAttrs.forEach((attr) => {
			const value = element.getAttribute(attr);
			if (value) attributes[attr] = value;
		});

		return attributes;
	}

	private getElementIdentifier(element: HTMLElement): string {
		return `${element.tagName}-${element.id || element.className || Date.now()}`;
	}

	private getElementType(element: HTMLElement): string {
		if (element instanceof HTMLButtonElement) return "button";
		if (element instanceof HTMLAnchorElement) return "link";
		if (element instanceof HTMLInputElement) return `input-${element.type}`;
		if (element instanceof HTMLTextAreaElement) return "textarea";
		if (element instanceof HTMLSelectElement) return "select";
		if (element.getAttribute("role")) return `role-${element.getAttribute("role")}`;
		if (element.onclick !== null) return "clickable";
		if (getComputedStyle(element).cursor === "pointer") return "interactive";
		return element.tagName.toLowerCase();
	}

	private getElementContent(element: HTMLElement): string {
		const parentLink = element.closest("a[href]");
		if (parentLink) {
			return parentLink.textContent?.trim() || parentLink.getAttribute("href") || "";
		}

		const text = element.textContent?.trim() || "";

		if (element instanceof HTMLImageElement) {
			return element.alt || element.src || text;
		}

		if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
			return element.placeholder || element.value || text;
		}

		return text.length > 50 ? text.substring(0, 47) + "..." : text;
	}

	destroy(): void {
		document.removeEventListener("mouseover", this.boundHoverStart, true);
		document.removeEventListener("mouseout", this.boundHoverEnd, true);
		this.hoverStartTimes.clear();
		if (this.options.debug) {
			console.log("[Thorbis] Hover tracking destroyed at", this.formatTimestamp(Date.now()));
		}
	}
}
