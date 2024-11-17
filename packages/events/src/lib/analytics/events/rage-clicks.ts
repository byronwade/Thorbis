import { analytics } from "../core/analytics";
import { logger } from "../utils/logger";
import { getElementData } from "../utils/dom";

const RAGE_CLICK_THRESHOLD = 3; // Number of clicks to consider "rage"
const RAGE_CLICK_TIMEOUT = 1000; // Time window in ms for rage clicks

interface ClickRecord {
	element: HTMLElement;
	timestamp: number;
	position: { x: number; y: number };
}

let recentClicks: ClickRecord[] = [];

export function initRageClickTracking() {
	if (typeof window === "undefined") return;

	document.addEventListener("click", handleClick);
	logger.debug("Click tracking initialized");
}

function handleClick(event: MouseEvent) {
	const target = event.target as HTMLElement;
	const now = Date.now();

	// Track normal click first
	trackNormalClick(event);

	// Add current click to rage click history
	recentClicks.push({
		element: target,
		timestamp: now,
		position: { x: event.clientX, y: event.clientY },
	});

	// Remove old clicks outside the rage click time window
	recentClicks = recentClicks.filter((click) => now - click.timestamp < RAGE_CLICK_TIMEOUT);

	// Check for rage clicks
	if (recentClicks.length >= RAGE_CLICK_THRESHOLD) {
		trackRageClick(target, recentClicks);
		recentClicks = []; // Reset after tracking rage click
	}
}

async function trackNormalClick(event: MouseEvent) {
	const target = event.target as HTMLElement;
	try {
		const elementData = getElementData(target);
		const content = target.textContent;

		await analytics.track("click", {
			element: elementData,
			position: {
				x: event.clientX,
				y: event.clientY,
				relativeX: event.offsetX,
				relativeY: event.offsetY,
			},
			content: content ? content.trim().substring(0, 100) : undefined,
			context: {
				tagName: target.tagName.toLowerCase(),
				isInteractive: ["a", "button", "input", "select", "textarea"].includes(target.tagName.toLowerCase()),
				hasHref: (target as HTMLAnchorElement).href,
				isFormElement: target.closest("form") !== null,
				parentId: target.parentElement?.id,
				parentClass: target.parentElement?.className,
			},
			metadata: {
				ctrlKey: event.ctrlKey,
				altKey: event.altKey,
				shiftKey: event.shiftKey,
				metaKey: event.metaKey,
				button: event.button, // 0: left, 1: middle, 2: right
				buttons: event.buttons,
				timestamp: Date.now(),
				url: window.location.href,
				path: window.location.pathname,
			},
		});

		logger.debug("Click tracked", {
			element: target.tagName,
			position: { x: event.clientX, y: event.clientY },
			content: content ? content.trim().substring(0, 50) : undefined,
		});
	} catch (error) {
		logger.error("Failed to track click", error);
	}
}

async function trackRageClick(element: HTMLElement, clicks: ClickRecord[]) {
	try {
		await analytics.track("rage_click", {
			element: getElementData(element),
			clickCount: clicks.length,
			timeWindow: RAGE_CLICK_TIMEOUT,
			clickPositions: clicks.map((c) => c.position),
			clickSpread: calculateClickSpread(clicks),
			averageTimeBetweenClicks: calculateAverageTimeBetweenClicks(clicks),
			timestamp: Date.now(),
			path: window.location.pathname,
		});

		logger.debug("Rage click tracked", {
			element: element.tagName,
			clicks: clicks.length,
			spread: calculateClickSpread(clicks),
		});
	} catch (error) {
		logger.error("Failed to track rage click", error);
	}
}

function calculateClickSpread(clicks: ClickRecord[]) {
	if (clicks.length < 2) return 0;

	const positions = clicks.map((c) => c.position);
	const minX = Math.min(...positions.map((p) => p.x));
	const maxX = Math.max(...positions.map((p) => p.x));
	const minY = Math.min(...positions.map((p) => p.y));
	const maxY = Math.max(...positions.map((p) => p.y));

	return {
		width: maxX - minX,
		height: maxY - minY,
		area: (maxX - minX) * (maxY - minY),
	};
}

function calculateAverageTimeBetweenClicks(clicks: ClickRecord[]) {
	if (clicks.length < 2) return 0;

	let totalTime = 0;
	for (let i = 1; i < clicks.length; i++) {
		totalTime += clicks[i].timestamp - clicks[i - 1].timestamp;
	}

	return totalTime / (clicks.length - 1);
}
