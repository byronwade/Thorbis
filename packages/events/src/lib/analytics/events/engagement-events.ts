import { analytics } from "../core/analytics";
import { logger } from "../utils/logger";
import { getElementData } from "../utils/dom";

interface EngagementMetrics {
	clicks: {
		count: number;
		elements: Record<string, number>; // element type -> click count
		positions: Array<{ x: number; y: number; timestamp: number }>;
	};
	scroll: {
		maxDepth: number;
		currentDepth: number;
		timestamps: Array<{ depth: number; timestamp: number }>;
	};
	hover: {
		elements: Record<string, number>; // element type -> hover duration
		totalDuration: number;
	};
	video: {
		plays: number;
		pauses: number;
		seeks: number;
		completions: number;
		watchTime: number;
	};
}

let engagementMetrics: EngagementMetrics = {
	clicks: { count: 0, elements: {}, positions: [] },
	scroll: { maxDepth: 0, currentDepth: 0, timestamps: [] },
	hover: { elements: {}, totalDuration: 0 },
	video: { plays: 0, pauses: 0, seeks: 0, completions: 0, watchTime: 0 },
};

export function initEngagementTracking() {
	if (typeof window === "undefined") return;

	// Track clicks
	document.addEventListener("click", trackClickEngagement);

	// Track scroll
	window.addEventListener("scroll", trackScrollEngagement);

	// Track hover
	document.addEventListener("mouseover", startHoverTracking);
	document.addEventListener("mouseout", endHoverTracking);

	// Track video interactions
	document.addEventListener("play", trackVideoEngagement, true);
	document.addEventListener("pause", trackVideoEngagement, true);
	document.addEventListener("seeking", trackVideoEngagement, true);
	document.addEventListener("ended", trackVideoEngagement, true);

	// Report engagement periodically
	setInterval(reportEngagementMetrics, 30000); // Every 30 seconds

	logger.debug("Engagement tracking initialized");
}

let hoverStartTime: number | null = null;
let currentHoverElement: HTMLElement | null = null;

function trackClickEngagement(event: MouseEvent) {
	const target = event.target as HTMLElement;
	const elementType = target.tagName.toLowerCase();

	engagementMetrics.clicks.count++;
	engagementMetrics.clicks.elements[elementType] = (engagementMetrics.clicks.elements[elementType] || 0) + 1;
	engagementMetrics.clicks.positions.push({
		x: event.clientX,
		y: event.clientY,
		timestamp: Date.now(),
	});

	analytics.track("engagement_click", {
		element: getElementData(target),
		position: { x: event.clientX, y: event.clientY },
		isInteractive: ["a", "button", "input", "select"].includes(elementType),
		context: {
			path: window.location.pathname,
			timestamp: Date.now(),
			totalClicks: engagementMetrics.clicks.count,
		},
	});
}

function trackScrollEngagement() {
	const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
	const windowHeight = window.innerHeight;
	const scrolled = window.scrollY;
	const currentDepth = Math.min(Math.round(((scrolled + windowHeight) / docHeight) * 100), 100);

	engagementMetrics.scroll.currentDepth = currentDepth;
	engagementMetrics.scroll.maxDepth = Math.max(engagementMetrics.scroll.maxDepth, currentDepth);
	engagementMetrics.scroll.timestamps.push({
		depth: currentDepth,
		timestamp: Date.now(),
	});

	analytics.track("engagement_scroll", {
		currentDepth,
		maxDepth: engagementMetrics.scroll.maxDepth,
		timestamp: Date.now(),
		path: window.location.pathname,
	});
}

function startHoverTracking(event: MouseEvent) {
	const target = event.target as HTMLElement;
	if (!target || hoverStartTime) return;

	hoverStartTime = Date.now();
	currentHoverElement = target;
}

function endHoverTracking() {
	if (!hoverStartTime || !currentHoverElement) return;

	const hoverDuration = Date.now() - hoverStartTime;
	const elementType = currentHoverElement.tagName.toLowerCase();

	engagementMetrics.hover.elements[elementType] = (engagementMetrics.hover.elements[elementType] || 0) + hoverDuration;
	engagementMetrics.hover.totalDuration += hoverDuration;

	analytics.track("engagement_hover", {
		element: getElementData(currentHoverElement),
		duration: hoverDuration,
		totalHoverTime: engagementMetrics.hover.totalDuration,
		timestamp: Date.now(),
		path: window.location.pathname,
	});

	hoverStartTime = null;
	currentHoverElement = null;
}

function trackVideoEngagement(event: Event) {
	const video = event.target as HTMLVideoElement;
	const type = event.type;

	switch (type) {
		case "play":
			engagementMetrics.video.plays++;
			break;
		case "pause":
			engagementMetrics.video.pauses++;
			engagementMetrics.video.watchTime += video.currentTime;
			break;
		case "seeking":
			engagementMetrics.video.seeks++;
			break;
		case "ended":
			engagementMetrics.video.completions++;
			engagementMetrics.video.watchTime += video.duration;
			break;
	}

	analytics.track("engagement_video", {
		action: type,
		videoElement: getElementData(video),
		currentTime: video.currentTime,
		duration: video.duration,
		metrics: {
			plays: engagementMetrics.video.plays,
			pauses: engagementMetrics.video.pauses,
			seeks: engagementMetrics.video.seeks,
			completions: engagementMetrics.video.completions,
			watchTime: engagementMetrics.video.watchTime,
		},
		timestamp: Date.now(),
		path: window.location.pathname,
	});
}

async function reportEngagementMetrics() {
	try {
		await analytics.track("engagement_summary", {
			metrics: engagementMetrics,
			timestamp: Date.now(),
			path: window.location.pathname,
			summary: {
				totalClicks: engagementMetrics.clicks.count,
				maxScrollDepth: engagementMetrics.scroll.maxDepth,
				totalHoverTime: engagementMetrics.hover.totalDuration,
				videoCompletionRate: engagementMetrics.video.completions / engagementMetrics.video.plays || 0,
			},
		});

		logger.debug("Engagement metrics reported", engagementMetrics);
	} catch (error) {
		logger.error("Failed to report engagement metrics", error);
	}
}

export function getEngagementMetrics(): EngagementMetrics {
	return { ...engagementMetrics };
}
