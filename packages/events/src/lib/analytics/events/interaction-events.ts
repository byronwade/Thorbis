import { analytics } from "../core/analytics";
import { logger } from "../utils/logger";

interface MousePosition {
	x: number;
	y: number;
	timestamp: number;
}

export async function trackInteraction(event: MouseEvent, type: string) {
	const position: MousePosition = {
		x: event.clientX,
		y: event.clientY,
		timestamp: Date.now(),
	};

	try {
		await analytics.track(type, {
			position,
			target: {
				tagName: (event.target as HTMLElement)?.tagName,
				className: (event.target as HTMLElement)?.className,
				id: (event.target as HTMLElement)?.id,
			},
		});
	} catch (error) {
		logger.error(`Failed to track ${type} interaction`, error);
	}
}
