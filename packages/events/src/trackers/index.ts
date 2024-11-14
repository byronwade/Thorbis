import { BaseTracker } from "./BaseTracker";
import { ClickTracker } from "./ClickTracker";
import { ErrorTracker } from "./ErrorTracker";
import { FormTracker } from "./FormTracker";
import { IdleTracker } from "./IdleTracker";
import { InteractionTracker } from "./InteractionTracker";
import { NavigationTracker } from "./NavigationTracker";
import { NetworkTracker } from "./NetworkTracker";
import { PerformanceTracker } from "./PerformanceTracker";
import { SessionTracker } from "./SessionTracker";
import { UserTracker } from "./UserTracker";
import type { ThorbisEventOptions } from "../types";

// Export all trackers
export { BaseTracker, ClickTracker, ErrorTracker, FormTracker, IdleTracker, InteractionTracker, NavigationTracker, NetworkTracker, PerformanceTracker, SessionTracker, UserTracker };

/**
 * Factory function to create tracker instances based on type
 * @param type - The type of tracker to create
 * @param options - Configuration options for the tracker
 * @returns Instance of the requested tracker
 */
export const createTracker = (type: string, options: ThorbisEventOptions): BaseTracker => {
	switch (type.toLowerCase()) {
		case "click":
			return new ClickTracker(options);
		case "error":
			return new ErrorTracker(options);
		case "form":
			return new FormTracker(options);
		case "idle":
			return new IdleTracker(options);
		case "interaction":
			return new InteractionTracker(options);
		case "navigation":
			return new NavigationTracker(options);
		case "network":
			return new NetworkTracker(options);
		case "performance":
			return new PerformanceTracker(options);
		case "session":
			return new SessionTracker(options);
		case "user":
			return new UserTracker(options);
		default:
			throw new Error(`Unknown tracker type: ${type}`);
	}
};
