/**
 * Call Quality Monitoring Hook
 *
 * Monitors WebRTC connection quality using RTCPeerConnection stats.
 * Provides real-time quality metrics (excellent/good/poor) based on:
 * - Packet loss
 * - Jitter
 * - Round-trip time (RTT)
 * - Audio levels
 */

"use client";

import type { Call } from "@telnyx/webrtc";
import { useCallback, useEffect, useState } from "react";

export type ConnectionQuality = "excellent" | "good" | "poor" | "unknown";

type QualityMetrics = {
	packetLoss: number;
	jitter: number;
	rtt: number;
	audioLevel: number;
};

type UseCallQualityOptions = {
	call: Call | null;
	updateInterval?: number; // milliseconds
};

type UseCallQualityReturn = {
	quality: ConnectionQuality;
	metrics: QualityMetrics | null;
	isMonitoring: boolean;
};

/**
 * Calculate connection quality based on WebRTC metrics
 */
function calculateQuality(metrics: QualityMetrics): ConnectionQuality {
	const { packetLoss, jitter, rtt } = metrics;

	// Excellent: < 1% loss, < 30ms jitter, < 150ms RTT
	if (packetLoss < 1 && jitter < 30 && rtt < 150) {
		return "excellent";
	}

	// Good: < 3% loss, < 50ms jitter, < 300ms RTT
	if (packetLoss < 3 && jitter < 50 && rtt < 300) {
		return "good";
	}

	// Poor: anything worse
	return "poor";
}

/**
 * Extract quality metrics from WebRTC stats
 */
async function getQualityMetrics(call: Call): Promise<QualityMetrics | null> {
	try {
		// Access the underlying RTCPeerConnection
		// @ts-expect-error - Telnyx SDK may not expose this in types
		const peerConnection = call._peer?.connection;

		if (!(peerConnection && peerConnection instanceof RTCPeerConnection)) {
			return null;
		}

		const stats = await peerConnection.getStats();
		const metrics: QualityMetrics = {
			packetLoss: 0,
			jitter: 0,
			rtt: 0,
			audioLevel: 0,
		};

		stats.forEach((report) => {
			// Inbound RTP stats (receiving audio)
			if (report.type === "inbound-rtp" && report.kind === "audio") {
				const packetsLost = report.packetsLost || 0;
				const packetsReceived = report.packetsReceived || 1;
				metrics.packetLoss = (packetsLost / (packetsLost + packetsReceived)) * 100;
				metrics.jitter = (report.jitter || 0) * 1000; // Convert to ms
			}

			// Candidate pair stats (RTT)
			if (report.type === "candidate-pair" && report.state === "succeeded") {
				metrics.rtt = report.currentRoundTripTime ? report.currentRoundTripTime * 1000 : 0;
			}

			// Media source stats (audio level)
			if (report.type === "media-source" && report.kind === "audio") {
				metrics.audioLevel = report.audioLevel || 0;
			}
		});

		return metrics;
	} catch (_error) {
    console.error("Error:", _error);
		return null;
	}
}

/**
 * Hook to monitor call quality in real-time
 */
export function useCallQuality({
	call,
	updateInterval = 2000, // Update every 2 seconds
}: UseCallQualityOptions): UseCallQualityReturn {
	const [quality, setQuality] = useState<ConnectionQuality>("unknown");
	const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
	const [isMonitoring, setIsMonitoring] = useState(false);

	const updateQuality = useCallback(async () => {
		if (!call) {
			setQuality("unknown");
			setMetrics(null);
			return;
		}

		const newMetrics = await getQualityMetrics(call);
		if (newMetrics) {
			setMetrics(newMetrics);
			setQuality(calculateQuality(newMetrics));
		}
	}, [call]);

	useEffect(() => {
		if (!call) {
			setIsMonitoring(false);
			setQuality("unknown");
			setMetrics(null);
			return;
		}

		setIsMonitoring(true);

		// Initial update
		updateQuality();

		// Set up interval for continuous monitoring
		const intervalId = setInterval(updateQuality, updateInterval);

		return () => {
			clearInterval(intervalId);
			setIsMonitoring(false);
		};
	}, [call, updateInterval, updateQuality]);

	return {
		quality,
		metrics,
		isMonitoring,
	};
}
