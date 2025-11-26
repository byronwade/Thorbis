/**
 * Settings Status Utilities
 *
 * Shared helpers for deriving progress, statuses, and descriptive labels
 * that can be used across the overview data layer and UI components.
 */

export type HealthStatus = "ready" | "warning" | "danger";

/**
 * Clamp and normalize a progress value between 0 and 100.
 */
export function normalizeProgress(value?: number | null): number {
	if (typeof value !== "number" || Number.isNaN(value)) {
		return 0;
	}

	if (value === Number.POSITIVE_INFINITY) {
		return 100;
	}

	return Math.min(100, Math.max(0, Math.round(value)));
}

/**
 * Derive a health status label from a normalized progress value.
 *
 * - 85-100  => ready
 * - 50-84   => warning
 * - 0-49    => danger
 */
export function deriveHealthStatus(progress: number): HealthStatus {
	const normalized = normalizeProgress(progress);

	if (normalized >= 85) {
		return "ready";
	}

	if (normalized >= 50) {
		return "warning";
	}

	return "danger";
}

/**
 * Convert a health status into a short descriptive phrase for screen readers
 * and helper text.
 */
export function describeHealthStatus(status: HealthStatus): string {
	switch (status) {
		case "ready":
			return "Fully configured";
		case "warning":
			return "Needs attention";
		case "danger":
			return "Action required";
		default:
			return "Unknown status";
	}
}

/**
 * Map status to Tailwind color tokens used by badges and icons.
 */
export function getStatusColorClasses(status: HealthStatus): {
	text: string;
	background: string;
	border: string;
} {
	switch (status) {
		case "ready":
			return {
				text: "text-success",
				background: "bg-success/10",
				border: "border-success/50",
			};
		case "warning":
			return {
				text: "text-warning",
				background: "bg-warning/10",
				border: "border-warning/50",
			};
		default:
			return {
				text: "text-destructive",
				background: "bg-destructive/10",
				border: "border-destructive/50",
			};
	}
}

/**
 * Helper to calculate a progress percentage from completed + total steps.
 */
export function progressFromSteps(completed: number, total: number): number {
	if (total <= 0) {
		return 0;
	}
	return normalizeProgress((completed / total) * 100);
}

/**
 * Format numeric deltas with +/- symbols for telemetry cards.
 */
export function formatTrendDelta(value?: number | null): string {
	if (typeof value !== "number" || Number.isNaN(value) || value === 0) {
		return "0%";
	}

	const rounded = Math.abs(Math.round(value));
	const prefix = value > 0 ? "+" : "-";
	return `${prefix}${rounded}%`;
}
