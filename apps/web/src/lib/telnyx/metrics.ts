/**
 * Telnyx Metrics & Monitoring
 *
 * Tracks API performance, error rates, and usage statistics.
 */

import { telnyxLogger } from "./logger";

// =============================================================================
// TYPES
// =============================================================================

export interface RequestMetrics {
	endpoint: string;
	method: string;
	statusCode: number;
	latencyMs: number;
	success: boolean;
	timestamp: Date;
	companyId?: string;
	correlationId?: string;
}

export interface AggregatedMetrics {
	totalRequests: number;
	successfulRequests: number;
	failedRequests: number;
	errorRate: number;
	latency: {
		p50: number;
		p95: number;
		p99: number;
		avg: number;
		min: number;
		max: number;
	};
	byEndpoint: Record<
		string,
		{
			count: number;
			errors: number;
			avgLatency: number;
		}
	>;
	byStatusCode: Record<number, number>;
}

export interface OperationMetrics {
	smsSent: number;
	smsDelivered: number;
	smsFailed: number;
	callsInitiated: number;
	callsCompleted: number;
	callsFailed: number;
	webhooksReceived: number;
	webhooksProcessed: number;
	webhooksFailed: number;
}

// =============================================================================
// METRICS COLLECTOR
// =============================================================================

class MetricsCollector {
	private requests: RequestMetrics[] = [];
	private operations: OperationMetrics = {
		smsSent: 0,
		smsDelivered: 0,
		smsFailed: 0,
		callsInitiated: 0,
		callsCompleted: 0,
		callsFailed: 0,
		webhooksReceived: 0,
		webhooksProcessed: 0,
		webhooksFailed: 0,
	};
	private retentionMs: number = 60 * 60 * 1000; // 1 hour
	private maxEntries: number = 10000;
	private cleanupInterval?: NodeJS.Timeout;

	constructor() {
		this.startCleanup();
	}

	/**
	 * Start periodic cleanup
	 */
	private startCleanup(): void {
		this.cleanupInterval = setInterval(() => {
			this.cleanup();
		}, 60000); // Every minute

		if (this.cleanupInterval.unref) {
			this.cleanupInterval.unref();
		}
	}

	/**
	 * Clean up old metrics
	 */
	private cleanup(): void {
		const cutoff = Date.now() - this.retentionMs;
		const initialCount = this.requests.length;

		this.requests = this.requests.filter((r) => r.timestamp.getTime() > cutoff);

		// Also trim if over max entries
		if (this.requests.length > this.maxEntries) {
			this.requests = this.requests.slice(-this.maxEntries);
		}

		const removed = initialCount - this.requests.length;
		if (removed > 0) {
			telnyxLogger.debug("Metrics cleanup", { removed });
		}
	}

	/**
	 * Record a request
	 */
	recordRequest(metrics: RequestMetrics): void {
		this.requests.push(metrics);

		// Log slow requests
		if (metrics.latencyMs > 2000) {
			telnyxLogger.warn("Slow request detected", {
				endpoint: metrics.endpoint,
				latencyMs: metrics.latencyMs,
				correlationId: metrics.correlationId,
			});
		}
	}

	/**
	 * Record SMS sent
	 */
	recordSmsSent(success: boolean): void {
		this.operations.smsSent++;
		if (!success) {
			this.operations.smsFailed++;
		}
	}

	/**
	 * Record SMS delivered
	 */
	recordSmsDelivered(): void {
		this.operations.smsDelivered++;
	}

	/**
	 * Record call initiated
	 */
	recordCallInitiated(success: boolean): void {
		this.operations.callsInitiated++;
		if (!success) {
			this.operations.callsFailed++;
		}
	}

	/**
	 * Record call completed
	 */
	recordCallCompleted(): void {
		this.operations.callsCompleted++;
	}

	/**
	 * Record webhook received
	 */
	recordWebhook(processed: boolean): void {
		this.operations.webhooksReceived++;
		if (processed) {
			this.operations.webhooksProcessed++;
		} else {
			this.operations.webhooksFailed++;
		}
	}

	/**
	 * Get aggregated metrics for a time window
	 */
	getAggregatedMetrics(windowMs: number = 5 * 60 * 1000): AggregatedMetrics {
		const cutoff = Date.now() - windowMs;
		const filtered = this.requests.filter(
			(r) => r.timestamp.getTime() > cutoff,
		);

		const successfulRequests = filtered.filter((r) => r.success).length;
		const failedRequests = filtered.length - successfulRequests;
		const latencies = filtered.map((r) => r.latencyMs).sort((a, b) => a - b);

		// Calculate percentiles
		const getPercentile = (arr: number[], p: number): number => {
			if (arr.length === 0) return 0;
			const index = Math.ceil((p / 100) * arr.length) - 1;
			return arr[Math.max(0, index)];
		};

		// Group by endpoint
		const byEndpoint: Record<
			string,
			{ count: number; errors: number; totalLatency: number }
		> = {};
		for (const r of filtered) {
			if (!byEndpoint[r.endpoint]) {
				byEndpoint[r.endpoint] = { count: 0, errors: 0, totalLatency: 0 };
			}
			byEndpoint[r.endpoint].count++;
			byEndpoint[r.endpoint].totalLatency += r.latencyMs;
			if (!r.success) {
				byEndpoint[r.endpoint].errors++;
			}
		}

		// Group by status code
		const byStatusCode: Record<number, number> = {};
		for (const r of filtered) {
			byStatusCode[r.statusCode] = (byStatusCode[r.statusCode] || 0) + 1;
		}

		return {
			totalRequests: filtered.length,
			successfulRequests,
			failedRequests,
			errorRate: filtered.length > 0 ? failedRequests / filtered.length : 0,
			latency: {
				p50: getPercentile(latencies, 50),
				p95: getPercentile(latencies, 95),
				p99: getPercentile(latencies, 99),
				avg:
					latencies.length > 0
						? latencies.reduce((a, b) => a + b, 0) / latencies.length
						: 0,
				min: latencies[0] || 0,
				max: latencies[latencies.length - 1] || 0,
			},
			byEndpoint: Object.fromEntries(
				Object.entries(byEndpoint).map(([ep, data]) => [
					ep,
					{
						count: data.count,
						errors: data.errors,
						avgLatency: data.totalLatency / data.count,
					},
				]),
			),
			byStatusCode,
		};
	}

	/**
	 * Get operation metrics
	 */
	getOperationMetrics(): OperationMetrics {
		return { ...this.operations };
	}

	/**
	 * Get health score (0-100)
	 */
	getHealthScore(windowMs: number = 5 * 60 * 1000): number {
		const metrics = this.getAggregatedMetrics(windowMs);

		if (metrics.totalRequests === 0) {
			return 100; // No requests, assume healthy
		}

		// Factors:
		// - Error rate (weight: 50%)
		// - Latency (weight: 30%)
		// - 5xx errors (weight: 20%)

		// Error rate score (0 = 100%, 10%+ = 0)
		const errorScore = Math.max(0, 100 - metrics.errorRate * 1000);

		// Latency score (0ms = 100, 3000ms+ = 0)
		const latencyScore = Math.max(0, 100 - (metrics.latency.p95 / 3000) * 100);

		// 5xx score
		const total5xx = Object.entries(metrics.byStatusCode)
			.filter(([code]) => parseInt(code) >= 500)
			.reduce((sum, [, count]) => sum + count, 0);
		const rate5xx = total5xx / metrics.totalRequests;
		const score5xx = Math.max(0, 100 - rate5xx * 1000);

		return Math.round(errorScore * 0.5 + latencyScore * 0.3 + score5xx * 0.2);
	}

	/**
	 * Reset metrics
	 */
	reset(): void {
		this.requests = [];
		this.operations = {
			smsSent: 0,
			smsDelivered: 0,
			smsFailed: 0,
			callsInitiated: 0,
			callsCompleted: 0,
			callsFailed: 0,
			webhooksReceived: 0,
			webhooksProcessed: 0,
			webhooksFailed: 0,
		};
	}

	/**
	 * Stop cleanup interval
	 */
	stop(): void {
		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval);
		}
	}
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const telnyxMetrics = new MetricsCollector();

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Create a request timer
 */
export function startRequestTimer(
	endpoint: string,
	method: string,
	companyId?: string,
	correlationId?: string,
): { end: (statusCode: number, success: boolean) => void } {
	const startTime = Date.now();

	return {
		end: (statusCode: number, success: boolean) => {
			telnyxMetrics.recordRequest({
				endpoint,
				method,
				statusCode,
				latencyMs: Date.now() - startTime,
				success,
				timestamp: new Date(),
				companyId,
				correlationId,
			});
		},
	};
}

/**
 * Get a summary for monitoring dashboards
 */
export function getMetricsSummary(): {
	health: number;
	metrics: AggregatedMetrics;
	operations: OperationMetrics;
} {
	return {
		health: telnyxMetrics.getHealthScore(),
		metrics: telnyxMetrics.getAggregatedMetrics(),
		operations: telnyxMetrics.getOperationMetrics(),
	};
}

/**
 * Format metrics for logging
 */
export function formatMetricsForLogging(): string {
	const summary = getMetricsSummary();
	const { metrics, operations, health } = summary;

	return [
		`Health Score: ${health}/100`,
		`Requests: ${metrics.totalRequests} (${metrics.failedRequests} failed)`,
		`Error Rate: ${(metrics.errorRate * 100).toFixed(2)}%`,
		`Latency: p50=${metrics.latency.p50}ms p95=${metrics.latency.p95}ms`,
		`SMS: ${operations.smsSent} sent, ${operations.smsDelivered} delivered, ${operations.smsFailed} failed`,
		`Calls: ${operations.callsInitiated} initiated, ${operations.callsCompleted} completed`,
		`Webhooks: ${operations.webhooksReceived} received, ${operations.webhooksFailed} failed`,
	].join(" | ");
}
