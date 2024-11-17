"use client";

import { useEffect } from "react";
import { initializeAnalytics, analytics } from "../lib/analytics/core/analytics";
import { logger } from "../lib/analytics/utils/logger";
import { storage } from "../lib/analytics/services/storage";
import { initHoverTracking } from "../lib/analytics/events/hover-events";
import { initRageClickTracking } from "../lib/analytics/events/rage-clicks";
import { initScrollTracking } from "../lib/analytics/events/scroll-tracking";
import { initSelectionTracking } from "../lib/analytics/events/selection-events";
import { initKeyboardTracking } from "../lib/analytics/events/keyboard-events";
import { initPageTracking } from "../lib/analytics/events/page-events";
import { initNavigationTracking } from "../lib/analytics/events/navigation-events";
import { initEngagementTracking } from "../lib/analytics/events/engagement-events";
import { initFormTracking } from "../lib/analytics/events/form-events";

interface ThorbisProps {
	debug?: boolean;
}

const Thorbis = ({ debug = false }: ThorbisProps) => {
	useEffect(() => {
		const init = async () => {
			try {
				// Enable logging and set debug mode
				logger.enable();
				if (debug) {
					logger.setLevel("debug");
					console.log("🔧 Debug mode enabled");
				}

				console.group("🚀 Thorbis Analytics Initialization");

				// Initialize core analytics
				const analyticsInstance = initializeAnalytics();
				console.log("✅ Analytics instance created");

				// Initialize storage
				await storage.init();
				console.log("✅ Storage initialized");

				// Initialize all trackers
				initPageTracking();
				initNavigationTracking();
				initHoverTracking();
				initRageClickTracking();
				initScrollTracking();
				initSelectionTracking();
				initKeyboardTracking();
				initEngagementTracking();
				initFormTracking();
				console.log("✅ Event tracking initialized");

				// Track initial page view
				await analytics.page({
					title: document.title,
					url: window.location.href,
					path: window.location.pathname,
					referrer: document.referrer,
					timestamp: new Date().toISOString(),
				});
				console.log("✅ Initial page view tracked");

				console.groupEnd();
			} catch (error) {
				console.error("❌ Failed to initialize Thorbis analytics:", error);
				logger.error("Failed to initialize Thorbis analytics", error);
			}
		};

		init();

		// Store cleanup function
		const cleanup = () => {
			logger.info("🧹 Cleaning up event listeners");
			document.removeEventListener("click", () => {});
			document.removeEventListener("scroll", () => {});
			document.removeEventListener("mouseover", () => {});
			document.removeEventListener("mouseout", () => {});
			document.removeEventListener("selectionchange", () => {});
			document.removeEventListener("mouseup", () => {});
			document.removeEventListener("keyup", () => {});
			document.removeEventListener("keydown", () => {});
			document.removeEventListener("visibilitychange", () => {});
			document.removeEventListener("play", () => {}, true);
			document.removeEventListener("pause", () => {}, true);
			document.removeEventListener("seeking", () => {}, true);
			document.removeEventListener("ended", () => {}, true);
			window.removeEventListener("beforeunload", () => {});
			window.removeEventListener("popstate", () => {});
			window.removeEventListener("blur", () => {});
		};

		// Return cleanup function
		return cleanup;
	}, [debug]);

	return null;
};

export default Thorbis;
