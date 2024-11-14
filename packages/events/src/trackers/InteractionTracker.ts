import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";

export class InteractionTracker extends BaseTracker {
	private lastHoverTarget: Element | null = null;
	private hoverStartTime: number = 0;
	private clickHistory: { timestamp: number; position: { x: number; y: number } }[] = [];
	private readonly RAGE_CLICK_THRESHOLD = 3; // clicks within 1 second
	private readonly RAGE_CLICK_INTERVAL = 1000;
	private clickHandler: ((e: MouseEvent) => void) | null = null;
	private hoverHandler: ((e: MouseEvent) => void) | null = null;

	constructor(options: ThorbisEventOptions) {
		super(options);

		// Remove any existing listeners before adding new ones
		if (this.clickHandler) {
			document.removeEventListener("click", this.clickHandler);
		}
		if (this.hoverHandler) {
			document.removeEventListener("mouseover", this.hoverHandler);
		}

		this.trackClicks();
		this.trackHovers();
		this.trackTextSelection();
	}

	private trackClicks() {
		this.clickHandler = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const now = Date.now();

			// Track regular click
			this.trackEvent("click", {
				element: this.getElementData(target),
				position: { x: e.clientX, y: e.clientY },
				timestamp: now,
			});

			// Track rage clicks
			this.clickHistory.push({
				timestamp: now,
				position: { x: e.clientX, y: e.clientY },
			});

			// Only keep clicks within the rage click interval
			this.clickHistory = this.clickHistory.filter((click) => now - click.timestamp < this.RAGE_CLICK_INTERVAL);

			if (this.clickHistory.length >= this.RAGE_CLICK_THRESHOLD) {
				const area = this.calculateClickArea(this.clickHistory);
				this.trackEvent("rage_click", {
					clicks: this.clickHistory.length,
					timespan: now - this.clickHistory[0].timestamp,
					area,
					positions: this.clickHistory.map((c) => c.position),
				});
				this.clickHistory = []; // Reset after tracking
			}
		};

		document.addEventListener("click", this.clickHandler, { passive: true });
	}

	private calculateClickArea(clicks: typeof this.clickHistory) {
		const xs = clicks.map((c) => c.position.x);
		const ys = clicks.map((c) => c.position.y);
		const width = Math.max(...xs) - Math.min(...xs);
		const height = Math.max(...ys) - Math.min(...ys);
		return width * height;
	}

	private trackHovers() {
		let hoverTimeout: NodeJS.Timeout;

		document.addEventListener(
			"mouseover",
			(e) => {
				const target = e.target as HTMLElement;
				const now = Date.now();

				clearTimeout(hoverTimeout);
				hoverTimeout = setTimeout(() => {
					if (this.lastHoverTarget && this.lastHoverTarget !== target) {
						const duration = now - this.hoverStartTime;
						if (duration > 100) {
							// Filter out quick passes
							this.trackEvent("hover", {
								element: this.getElementData(this.lastHoverTarget as HTMLElement),
								duration,
								exitPoint: { x: e.clientX, y: e.clientY },
							});
						}
					}

					this.lastHoverTarget = target;
					this.hoverStartTime = now;
				}, 50);
			},
			{ passive: true }
		);
	}

	private trackTextSelection() {
		document.addEventListener("selectionchange", () => {
			const selection = window.getSelection();
			if (selection && selection.toString().length > 0) {
				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();

				this.trackEvent("text_selection", {
					text: selection.toString(),
					length: selection.toString().length,
					position: {
						x: rect.x,
						y: rect.y,
						width: rect.width,
						height: rect.height,
					},
					element: selection.anchorNode?.parentElement ? this.getElementData(selection.anchorNode.parentElement) : undefined,
				});
			}
		});
	}

	initialize(): void {
		this.trackClicks();
		this.trackHovers();
		this.trackTextSelection();
	}

	destroy(): void {
		if (this.clickHandler) {
			document.removeEventListener("click", this.clickHandler);
		}
		if (this.hoverHandler) {
			document.removeEventListener("mouseover", this.hoverHandler);
		}
		// Clean up any other event listeners
		document.removeEventListener("selectionchange", this.trackTextSelection);
	}
}
