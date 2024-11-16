import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";

export class MouseTracker extends BaseTracker {
	private lastPosition = { x: 0, y: 0 };
	private readonly boundMouseMove: (e: MouseEvent) => void;
	private readonly THROTTLE_MS = 50;
	private lastThrottleTime = 0;

	constructor(options: ThorbisEventOptions) {
		super(options);
		this.boundMouseMove = (e: MouseEvent): void => {
			const now = Date.now();
			if (now - this.lastThrottleTime < this.THROTTLE_MS) {
				return;
			}
			this.lastThrottleTime = now;

			this.lastPosition.x = e.clientX;
			this.lastPosition.y = e.clientY;

			if (this.options.debug) {
				this.trackEvent("mouse_move", {
					position: this.lastPosition,
					metadata: {
						eventTime: this.formatTimestamp(now),
					},
				});
			}
		};
	}

	initialize(): void {
		if (typeof window === "undefined") return;

		document.addEventListener("mousemove", this.boundMouseMove, {
			passive: true,
		});

		if (this.options.debug) {
			console.log("[Thorbis] Mouse tracking initialized at", this.formatTimestamp(Date.now()));
		}
	}

	getLastPosition(): Readonly<{ x: number; y: number }> {
		return this.lastPosition;
	}

	destroy(): void {
		document.removeEventListener("mousemove", this.boundMouseMove);
	}
}
