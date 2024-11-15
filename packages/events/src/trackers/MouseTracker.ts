import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";

export class MouseTracker extends BaseTracker {
	private lastPosition: { x: number; y: number } = { x: 0, y: 0 };
	private boundMouseMove: (e: MouseEvent) => void;

	constructor(options: ThorbisEventOptions) {
		super(options);
		this.boundMouseMove = this.handleMouseMove.bind(this);
	}

	initialize(): void {
		if (typeof window === "undefined") return;

		// Start tracking immediately
		document.addEventListener("mousemove", this.boundMouseMove, { passive: true });

		if (this.options.debug) {
			console.log("[Thorbis] Mouse tracking initialized at", this.formatTimestamp(Date.now()));
		}
	}

	private handleMouseMove = (e: MouseEvent): void => {
		const now = Date.now();
		const newPosition = { x: e.clientX, y: e.clientY };

		// Track position change
		this.lastPosition = newPosition;

		// Only track position in debug mode
		if (this.options.debug) {
			this.trackEvent("mouse_move", {
				position: newPosition,
				metadata: {
					eventTime: this.formatTimestamp(now),
				},
			});
		}
	};

	getLastPosition(): { x: number; y: number } {
		return this.lastPosition;
	}

	destroy(): void {
		document.removeEventListener("mousemove", this.boundMouseMove);
	}
}
