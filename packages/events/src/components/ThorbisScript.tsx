"use client";

import React, { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { initializeTrackers } from "../initialize";
import { DebugDisplay } from "./DebugDisplay";
import type { EventData } from "../types";

interface ThorbisScriptProps {
	debug?: boolean;
	devServerUrl?: string;
}

interface AnalyticsState {
	performance: {
		pageLoad?: {
			ttfb: { raw: number; formatted: string };
			domInteractive: { raw: number; formatted: string };
			domComplete: { raw: number; formatted: string };
			loadComplete: { raw: number; formatted: string };
		};
		paint?: {
			firstPaint?: number;
			firstContentfulPaint?: number;
		};
		cls?: number;
	};
	profile: {
		userId: string;
		sessionId: string;
		startTime: number;
		lastActive: number;
		totalEvents: number;
		interactions: {
			clicks: number;
			scrolls: number;
			forms: number;
			searches: number;
		};
	};
	events: EventData[];
}

export function ThorbisScript({ debug = false, devServerUrl = "http://localhost:3010" }: ThorbisScriptProps) {
	const [analyticsData, setAnalyticsData] = useState<AnalyticsState>({
		performance: {},
		profile: {
			userId: "",
			sessionId: "",
			startTime: 0,
			lastActive: 0,
			totalEvents: 0,
			interactions: {
				clicks: 0,
				scrolls: 0,
				forms: 0,
				searches: 0,
			},
		},
		events: [],
	});

	const eventQueueRef = useRef<EventData[]>([]);
	const processingRef = useRef(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const processQueue = async () => {
		if (processingRef.current || eventQueueRef.current.length === 0) return;

		processingRef.current = true;
		const events = [...eventQueueRef.current];
		eventQueueRef.current = [];

		try {
			// Update local state
			setAnalyticsData((prev: AnalyticsState) => {
				const newState = { ...prev };
				events.forEach((event) => {
					// Update performance metrics
					if (event.type === "performance" && event.timing) {
						newState.performance = {
							...newState.performance,
							...event.timing,
						};
					}

					// Update profile
					if (event.type === "click") newState.profile.interactions.clicks++;
					if (event.type === "scroll") newState.profile.interactions.scrolls++;
					if (event.type === "form") newState.profile.interactions.forms++;
					if (event.type === "search") newState.profile.interactions.searches++;

					newState.profile.lastActive = Date.now();
					newState.profile.totalEvents++;

					// Add to events array (keep last 100)
					newState.events = [...newState.events.slice(-99), event];
				});

				return newState;
			});

			// Send to server if configured
			if (devServerUrl) {
				const response = await fetch(devServerUrl + "/events", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Thorbis-Debug": debug ? "1" : "0",
					},
					mode: "cors",
					credentials: "omit",
					body: JSON.stringify({
						events,
						timestamp: Date.now(),
						debug,
					}),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
			}
		} catch (err) {
			if (debug) {
				console.warn("[Thorbis] Failed to process events:", err);
			}
		} finally {
			processingRef.current = false;

			// Process next batch if there are more events
			if (eventQueueRef.current.length > 0) {
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				timeoutRef.current = setTimeout(processQueue, 1000);
			}
		}
	};

	useEffect(() => {
		if (typeof window === "undefined") return;

		const analytics = initializeTrackers({
			debug,
			onEvent: (events) => {
				eventQueueRef.current.push(...events);
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				timeoutRef.current = setTimeout(processQueue, 1000);
			},
		});

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			analytics.destroy();
		};
	}, [debug, devServerUrl]);

	return debug ? (
		<>
			<Script
				id="thorbis-script"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
						window.__THORBIS_DEBUG__ = ${debug};
						window.__THORBIS_DEV_SERVER__ = "${devServerUrl}";
					`,
				}}
			/>
			<DebugDisplay data={analyticsData} />
		</>
	) : null;
}
