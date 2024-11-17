import { analytics } from "../core/analytics";
import { logger } from "../utils/logger";

interface NavigationHistory {
	path: string;
	timestamp: number;
	type: "navigation" | "back" | "forward" | "reload";
}

let navigationHistory: NavigationHistory[] = [];
let entryPage: string | null = null;
let lastPage: string | null = null;

export function initNavigationTracking() {
	if (typeof window === "undefined") return;

	// Track initial page load
	entryPage = window.location.pathname;
	addToHistory(entryPage, "navigation");

	// Track navigation events
	window.addEventListener("popstate", handlePopState);
	window.addEventListener("beforeunload", handleBeforeUnload);

	// Track navigation using History API
	const originalPushState = history.pushState;
	const originalReplaceState = history.replaceState;

	history.pushState = function (...args) {
		originalPushState.apply(this, args);
		handleNavigation("navigation");
	};

	history.replaceState = function (...args) {
		originalReplaceState.apply(this, args);
		handleNavigation("navigation");
	};

	logger.debug("Navigation tracking initialized");
}

export async function trackNavigation(from: string, to: string) {
	try {
		await analytics.track("navigation", {
			from,
			to,
			type: "navigation",
			timestamp: Date.now(),
			entryPage,
			pathHistory: navigationHistory,
			metrics: {
				timeOnPreviousPage: lastPage ? Date.now() - (navigationHistory[navigationHistory.length - 1]?.timestamp || 0) : 0,
				pagesVisited: navigationHistory.length,
				uniquePagesVisited: new Set(navigationHistory.map((h) => h.path)).size,
				backButtonUsage: navigationHistory.filter((h) => h.type === "back").length,
			},
		});

		logger.debug("Navigation tracked", { from, to });
	} catch (error) {
		logger.error("Failed to track navigation", error);
	}
}

function addToHistory(path: string, type: NavigationHistory["type"]) {
	navigationHistory.push({
		path,
		timestamp: Date.now(),
		type,
	});
	lastPage = path;
}

async function handleNavigation(type: NavigationHistory["type"]) {
	const currentPath = window.location.pathname;
	if (currentPath === lastPage) return;

	await trackNavigation(lastPage || "", currentPath);
	addToHistory(currentPath, type);
}

function handlePopState() {
	const type = determineNavigationType();
	handleNavigation(type);
}

function determineNavigationType(): NavigationHistory["type"] {
	const currentIndex = navigationHistory.findIndex((h) => h.path === window.location.pathname);
	const lastIndex = navigationHistory.length - 1;

	if (currentIndex === -1) return "navigation";
	if (currentIndex < lastIndex) return "back";
	return "forward";
}

async function handleBeforeUnload() {
	try {
		await analytics.track("page_exit", {
			path: window.location.pathname,
			entryPage,
			exitPage: window.location.pathname,
			timestamp: Date.now(),
			sessionDuration: Date.now() - navigationHistory[0].timestamp,
			navigationSummary: {
				totalPages: navigationHistory.length,
				uniquePages: new Set(navigationHistory.map((h) => h.path)).size,
				backButtonUsage: navigationHistory.filter((h) => h.type === "back").length,
				averageTimePerPage: calculateAverageTimePerPage(),
				pathTaken: navigationHistory.map((h) => ({
					path: h.path,
					type: h.type,
					timeSpent: h.timestamp - (navigationHistory[navigationHistory.indexOf(h) - 1]?.timestamp || navigationHistory[0].timestamp),
				})),
			},
		});

		logger.debug("Exit page tracked", {
			entryPage,
			exitPage: window.location.pathname,
			pagesVisited: navigationHistory.length,
		});
	} catch (error) {
		logger.error("Failed to track page exit", error);
		// Use sendBeacon as fallback
		const data = {
			type: "page_exit",
			path: window.location.pathname,
			timestamp: Date.now(),
			navigationHistory,
		};
		navigator.sendBeacon("/analytics", JSON.stringify(data));
	}
}

function calculateAverageTimePerPage(): number {
	if (navigationHistory.length <= 1) return 0;

	let totalTime = 0;
	for (let i = 1; i < navigationHistory.length; i++) {
		totalTime += navigationHistory[i].timestamp - navigationHistory[i - 1].timestamp;
	}
	return Math.round(totalTime / (navigationHistory.length - 1));
}

export async function getNavigationData() {
	return {
		entryPage,
		currentPage: window.location.pathname,
		history: navigationHistory,
		metrics: {
			totalPages: navigationHistory.length,
			uniquePages: new Set(navigationHistory.map((h) => h.path)).size,
			backButtonUsage: navigationHistory.filter((h) => h.type === "back").length,
			averageTimePerPage: calculateAverageTimePerPage(),
		},
	};
}
