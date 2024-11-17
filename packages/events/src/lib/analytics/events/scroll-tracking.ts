import { analytics } from "../core/analytics";
import { logger } from "../utils/logger";

const RAPID_SCROLL_THRESHOLD = 1000; // Pixels scrolled within time window
const SCROLL_TIME_WINDOW = 500; // Time window in ms
const SCROLL_SAMPLE_RATE = 100; // How often to check scroll position (ms)

interface ScrollRecord {
	position: number;
	timestamp: number;
	direction: "up" | "down";
}

let recentScrolls: ScrollRecord[] = [];
let lastScrollPosition = 0;
let scrollTimeout: NodeJS.Timeout | null = null;

export function initScrollTracking() {
	if (typeof window === "undefined") return;

	window.addEventListener("scroll", handleScroll, { passive: true });
	logger.debug("Scroll tracking initialized");
}

function handleScroll() {
	if (scrollTimeout) return; // Throttle scroll events

	scrollTimeout = setTimeout(() => {
		const currentPosition = window.scrollY;
		const now = Date.now();

		// Determine scroll direction
		const direction = currentPosition > lastScrollPosition ? "down" : "up";

		// Add current scroll to history
		recentScrolls.push({
			position: currentPosition,
			timestamp: now,
			direction,
		});

		// Remove old scrolls outside the time window
		recentScrolls = recentScrolls.filter((scroll) => now - scroll.timestamp < SCROLL_TIME_WINDOW);

		// Check for rapid scrolling
		const totalScrollDistance = recentScrolls.reduce((total, curr, i, arr) => {
			if (i === 0) return 0;
			return total + Math.abs(curr.position - arr[i - 1].position);
		}, 0);

		if (totalScrollDistance > RAPID_SCROLL_THRESHOLD) {
			trackRapidScroll(totalScrollDistance, recentScrolls);
			recentScrolls = []; // Reset after tracking
		}

		lastScrollPosition = currentPosition;
		scrollTimeout = null;
	}, SCROLL_SAMPLE_RATE);
}

async function trackRapidScroll(distance: number, scrolls: ScrollRecord[]) {
	try {
		const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

		await analytics.track("rapid_scroll", {
			distance,
			scrollDepth,
			timeWindow: SCROLL_TIME_WINDOW,
			scrollCount: scrolls.length,
			directions: scrolls.map((s) => s.direction),
			timestamp: Date.now(),
			path: window.location.pathname,
		});

		logger.debug("Rapid scroll tracked", {
			distance,
			scrollDepth,
			scrolls: scrolls.length,
		});
	} catch (error) {
		logger.error("Failed to track rapid scroll", error);
	}
}
