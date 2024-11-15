import { BaseTracker } from "./BaseTracker";
import type { ThorbisEventOptions } from "../types";

export class InteractionTracker extends BaseTracker {
	initialize(): void {
		if (typeof window === "undefined") return;

		if (this.options.debug) {
			console.log("[Thorbis] Interaction tracking initialized");
		}
	}

	destroy(): void {
		// Cleanup if needed
	}
}
