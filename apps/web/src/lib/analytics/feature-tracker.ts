/**
 * Client-Side Feature Usage Tracking
 *
 * Tracks user interactions and feature usage for analytics:
 * - Page views and navigation
 * - Button clicks and UI interactions
 * - Feature engagement (which features are used most)
 * - Session tracking
 * - Performance metrics (client-side)
 *
 * Usage:
 * ```typescript
 * // In a client component
 * "use client";
 * import { useFeatureTracker, trackFeature, trackPageView } from "@/lib/analytics/feature-tracker";
 *
 * // Hook-based tracking
 * function MyComponent() {
 *   const { trackClick, trackFeatureUse } = useFeatureTracker();
 *
 *   return (
 *     <Button onClick={() => trackClick("create_job_button", "jobs")}>
 *       Create Job
 *     </Button>
 *   );
 * }
 *
 * // Direct function call
 * trackFeature("dark_mode_toggle", "settings", { value: "enabled" });
 *
 * // Page view tracking
 * trackPageView("/dashboard/jobs");
 * ```
 */

"use client";

import { useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

// ============================================
// Types
// ============================================

export type FeatureCategory =
	| "navigation"
	| "jobs"
	| "invoices"
	| "estimates"
	| "payments"
	| "customers"
	| "properties"
	| "equipment"
	| "contracts"
	| "appointments"
	| "team"
	| "communications"
	| "settings"
	| "reports"
	| "search"
	| "ai"
	| "ui"
	| "other";

export interface FeatureEvent {
	featureName: string;
	category: FeatureCategory;
	action: "click" | "view" | "toggle" | "submit" | "dismiss" | "expand" | "custom";
	metadata?: Record<string, unknown>;
	timestamp: number;
}

export interface PageViewEvent {
	path: string;
	referrer: string | null;
	duration: number | null;
	timestamp: number;
}

export interface SessionInfo {
	sessionId: string;
	startedAt: number;
	lastActivityAt: number;
	pageViews: number;
	interactions: number;
}

// ============================================
// Session Management
// ============================================

const SESSION_KEY = "stratos_analytics_session";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function getOrCreateSession(): SessionInfo {
	if (typeof window === "undefined") {
		return {
			sessionId: uuidv4(),
			startedAt: Date.now(),
			lastActivityAt: Date.now(),
			pageViews: 0,
			interactions: 0,
		};
	}

	try {
		const stored = sessionStorage.getItem(SESSION_KEY);
		if (stored) {
			const session: SessionInfo = JSON.parse(stored);

			// Check if session has expired
			if (Date.now() - session.lastActivityAt > SESSION_TIMEOUT) {
				// Start new session
				return createNewSession();
			}

			return session;
		}
	} catch {
		// Ignore parse errors
	}

	return createNewSession();
}

function createNewSession(): SessionInfo {
	const session: SessionInfo = {
		sessionId: uuidv4(),
		startedAt: Date.now(),
		lastActivityAt: Date.now(),
		pageViews: 0,
		interactions: 0,
	};

	saveSession(session);
	return session;
}

function saveSession(session: SessionInfo): void {
	if (typeof window === "undefined") return;

	try {
		sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
	} catch {
		// Ignore storage errors
	}
}

function updateSessionActivity(type: "pageView" | "interaction"): SessionInfo {
	const session = getOrCreateSession();
	session.lastActivityAt = Date.now();

	if (type === "pageView") {
		session.pageViews++;
	} else {
		session.interactions++;
	}

	saveSession(session);
	return session;
}

// ============================================
// Event Queue for Batching
// ============================================

interface QueuedEvent {
	type: "feature" | "pageView";
	data: FeatureEvent | PageViewEvent;
	sessionId: string;
	timestamp: number;
}

class FeatureEventQueue {
	private queue: QueuedEvent[] = [];
	private flushInterval: NodeJS.Timeout | null = null;
	private readonly maxQueueSize = 50;
	private readonly flushIntervalMs = 10000; // 10 seconds

	constructor() {
		if (typeof window !== "undefined") {
			this.startFlushInterval();
			// Flush on page unload
			window.addEventListener("beforeunload", () => this.flush());
			// Flush on visibility change (tab switch)
			document.addEventListener("visibilitychange", () => {
				if (document.visibilityState === "hidden") {
					this.flush();
				}
			});
		}
	}

	add(event: QueuedEvent): void {
		this.queue.push(event);

		if (this.queue.length >= this.maxQueueSize) {
			this.flush();
		}
	}

	private startFlushInterval(): void {
		this.flushInterval = setInterval(() => {
			this.flush();
		}, this.flushIntervalMs);
	}

	async flush(): Promise<void> {
		if (this.queue.length === 0) return;

		const events = [...this.queue];
		this.queue = [];

		try {
			// Use sendBeacon for reliability on page unload
			const blob = new Blob([JSON.stringify({ events })], {
				type: "application/json",
			});

			if (navigator.sendBeacon) {
				navigator.sendBeacon("/api/analytics/features", blob);
			} else {
				// Fallback to fetch
				await fetch("/api/analytics/features", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ events }),
					keepalive: true,
				});
			}
		} catch (err) {
			// Put events back in queue on failure
			console.error("[Feature Tracker] Flush failed:", err);
			this.queue = [...events, ...this.queue].slice(0, this.maxQueueSize * 2);
		}
	}

	stop(): void {
		if (this.flushInterval) {
			clearInterval(this.flushInterval);
			this.flushInterval = null;
		}
		this.flush();
	}
}

// Singleton queue instance
let eventQueue: FeatureEventQueue | null = null;

function getEventQueue(): FeatureEventQueue {
	if (!eventQueue && typeof window !== "undefined") {
		eventQueue = new FeatureEventQueue();
	}
	return eventQueue!;
}

// ============================================
// Tracking Functions
// ============================================

/**
 * Track a feature usage event
 */
export function trackFeature(
	featureName: string,
	category: FeatureCategory,
	metadata?: Record<string, unknown>,
	action: FeatureEvent["action"] = "custom",
): void {
	if (typeof window === "undefined") return;

	const session = updateSessionActivity("interaction");

	const event: FeatureEvent = {
		featureName,
		category,
		action,
		metadata,
		timestamp: Date.now(),
	};

	getEventQueue()?.add({
		type: "feature",
		data: event,
		sessionId: session.sessionId,
		timestamp: Date.now(),
	});
}

/**
 * Track a button click
 */
export function trackClick(
	featureName: string,
	category: FeatureCategory,
	metadata?: Record<string, unknown>,
): void {
	trackFeature(featureName, category, metadata, "click");
}

/**
 * Track a form submission
 */
export function trackSubmit(
	featureName: string,
	category: FeatureCategory,
	metadata?: Record<string, unknown>,
): void {
	trackFeature(featureName, category, metadata, "submit");
}

/**
 * Track a toggle change
 */
export function trackToggle(
	featureName: string,
	category: FeatureCategory,
	value: boolean,
	metadata?: Record<string, unknown>,
): void {
	trackFeature(featureName, category, { ...metadata, value }, "toggle");
}

/**
 * Track a page view
 */
export function trackPageView(
	path: string,
	referrer?: string | null,
): void {
	if (typeof window === "undefined") return;

	const session = updateSessionActivity("pageView");

	const event: PageViewEvent = {
		path,
		referrer: referrer ?? (document.referrer || null),
		duration: null, // Will be calculated on next page view
		timestamp: Date.now(),
	};

	getEventQueue()?.add({
		type: "pageView",
		data: event,
		sessionId: session.sessionId,
		timestamp: Date.now(),
	});
}

/**
 * Track search query
 */
export function trackSearch(
	query: string,
	category: FeatureCategory = "search",
	resultsCount?: number,
): void {
	trackFeature("search", category, {
		query,
		query_length: query.length,
		results_count: resultsCount,
	});
}

// ============================================
// React Hook
// ============================================

export interface UseFeatureTrackerReturn {
	trackClick: (featureName: string, category: FeatureCategory, metadata?: Record<string, unknown>) => void;
	trackToggle: (featureName: string, category: FeatureCategory, value: boolean, metadata?: Record<string, unknown>) => void;
	trackSubmit: (featureName: string, category: FeatureCategory, metadata?: Record<string, unknown>) => void;
	trackFeatureUse: (featureName: string, category: FeatureCategory, metadata?: Record<string, unknown>) => void;
	trackSearch: (query: string, category?: FeatureCategory, resultsCount?: number) => void;
	sessionId: string;
}

/**
 * React hook for feature tracking
 * Provides memoized tracking functions for use in components
 */
export function useFeatureTracker(): UseFeatureTrackerReturn {
	const sessionRef = useRef<SessionInfo | null>(null);

	// Initialize session on mount
	useEffect(() => {
		sessionRef.current = getOrCreateSession();
	}, []);

	const trackClickMemo = useCallback(
		(featureName: string, category: FeatureCategory, metadata?: Record<string, unknown>) => {
			trackClick(featureName, category, metadata);
		},
		[],
	);

	const trackToggleMemo = useCallback(
		(featureName: string, category: FeatureCategory, value: boolean, metadata?: Record<string, unknown>) => {
			trackToggle(featureName, category, value, metadata);
		},
		[],
	);

	const trackSubmitMemo = useCallback(
		(featureName: string, category: FeatureCategory, metadata?: Record<string, unknown>) => {
			trackSubmit(featureName, category, metadata);
		},
		[],
	);

	const trackFeatureUseMemo = useCallback(
		(featureName: string, category: FeatureCategory, metadata?: Record<string, unknown>) => {
			trackFeature(featureName, category, metadata, "custom");
		},
		[],
	);

	const trackSearchMemo = useCallback(
		(query: string, category: FeatureCategory = "search", resultsCount?: number) => {
			trackSearch(query, category, resultsCount);
		},
		[],
	);

	return {
		trackClick: trackClickMemo,
		trackToggle: trackToggleMemo,
		trackSubmit: trackSubmitMemo,
		trackFeatureUse: trackFeatureUseMemo,
		trackSearch: trackSearchMemo,
		sessionId: sessionRef.current?.sessionId || "",
	};
}

// ============================================
// Page View Tracking Hook
// ============================================

/**
 * Hook to automatically track page views
 * Use in your root layout or page components
 */
export function usePageViewTracker(path: string): void {
	const lastPathRef = useRef<string | null>(null);
	const startTimeRef = useRef<number>(Date.now());

	useEffect(() => {
		// Track page view on mount and path change
		if (path !== lastPathRef.current) {
			// Calculate duration of previous page
			const duration = lastPathRef.current
				? Date.now() - startTimeRef.current
				: null;

			// Track the page view
			trackPageView(path, lastPathRef.current);

			// Update refs
			lastPathRef.current = path;
			startTimeRef.current = Date.now();
		}

		// Track duration on unmount
		return () => {
			// This will be handled by the next page view
		};
	}, [path]);
}

// ============================================
// Performance Metrics
// ============================================

export interface PerformanceMetrics {
	ttfb: number | null; // Time to First Byte
	fcp: number | null; // First Contentful Paint
	lcp: number | null; // Largest Contentful Paint
	fid: number | null; // First Input Delay
	cls: number | null; // Cumulative Layout Shift
	inp: number | null; // Interaction to Next Paint
}

/**
 * Collect Core Web Vitals and send to analytics
 */
export function trackWebVitals(): void {
	if (typeof window === "undefined") return;

	// Use web-vitals library if available, otherwise use basic Performance API
	try {
		const metrics: PerformanceMetrics = {
			ttfb: null,
			fcp: null,
			lcp: null,
			fid: null,
			cls: null,
			inp: null,
		};

		// Get navigation timing
		const navEntry = performance.getEntriesByType(
			"navigation",
		)[0] as PerformanceNavigationTiming;
		if (navEntry) {
			metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
		}

		// Get paint timing
		const paintEntries = performance.getEntriesByType("paint");
		for (const entry of paintEntries) {
			if (entry.name === "first-contentful-paint") {
				metrics.fcp = entry.startTime;
			}
		}

		// Use PerformanceObserver for LCP
		if ("PerformanceObserver" in window) {
			// LCP
			const lcpObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				const lastEntry = entries[entries.length - 1];
				if (lastEntry) {
					metrics.lcp = lastEntry.startTime;
					sendPerformanceMetrics(metrics);
				}
			});
			lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

			// FID
			const fidObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				for (const entry of entries) {
					const fidEntry = entry as PerformanceEventTiming;
					if (fidEntry.processingStart) {
						metrics.fid = fidEntry.processingStart - fidEntry.startTime;
						sendPerformanceMetrics(metrics);
					}
				}
			});
			fidObserver.observe({ type: "first-input", buffered: true });

			// CLS
			let clsValue = 0;
			const clsObserver = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					const layoutShiftEntry = entry as PerformanceEntry & {
						hadRecentInput: boolean;
						value: number;
					};
					if (!layoutShiftEntry.hadRecentInput) {
						clsValue += layoutShiftEntry.value;
						metrics.cls = clsValue;
					}
				}
			});
			clsObserver.observe({ type: "layout-shift", buffered: true });
		}

		// Send initial metrics after a delay
		setTimeout(() => {
			sendPerformanceMetrics(metrics);
		}, 5000);
	} catch (err) {
		console.error("[Feature Tracker] Web vitals error:", err);
	}
}

function sendPerformanceMetrics(metrics: PerformanceMetrics): void {
	trackFeature("web_vitals", "ui", {
		ttfb_ms: metrics.ttfb,
		fcp_ms: metrics.fcp,
		lcp_ms: metrics.lcp,
		fid_ms: metrics.fid,
		cls: metrics.cls,
		inp_ms: metrics.inp,
	});
}

// ============================================
// Exports
// ============================================

export default {
	trackFeature,
	trackClick,
	trackSubmit,
	trackToggle,
	trackPageView,
	trackSearch,
	trackWebVitals,
	useFeatureTracker,
	usePageViewTracker,
};
