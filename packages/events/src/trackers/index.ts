import { BaseTracker } from "./BaseTracker";
import { ClickTracker } from "./ClickTracker";
import { ErrorTracker } from "./ErrorTracker";
import { FormTracker } from "./FormTracker";
import { HoverTracker } from "./HoverTracker";
import { IdleTracker } from "./IdleTracker";
import { InteractionTracker } from "./InteractionTracker";
import { NavigationTracker } from "./NavigationTracker";
import { PerformanceTracker } from "./PerformanceTracker";
import { SessionTracker } from "./SessionTracker";
import { UserTracker } from "./UserTracker";
import { SearchTracker } from "./SearchTracker";
import { MouseTracker } from "./MouseTracker";
import type { ThorbisEventOptions } from "../types";

// Export all trackers
export { BaseTracker, ClickTracker, ErrorTracker, FormTracker, HoverTracker, IdleTracker, InteractionTracker, NavigationTracker, PerformanceTracker, SessionTracker, UserTracker, SearchTracker, MouseTracker };

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
		case "hover":
			return new HoverTracker(options);
		case "idle":
			return new IdleTracker(options);
		case "interaction":
			return new InteractionTracker(options);
		case "navigation":
			return new NavigationTracker(options);
		case "performance_metrics":
			return new PerformanceTracker(options);
		case "session":
			return new SessionTracker(options);
		case "user":
			return new UserTracker(options);
		case "search":
			return new SearchTracker(options);
		case "mouse":
			return new MouseTracker(options);
		default:
			throw new Error(`Unknown tracker type: ${type}`);
	}
};
