/**
 * Utilities for determining onboarding completion across server components
 * and API routes. Keeps the logic centralized so we can evolve the rules
 * (e.g. adding new steps) without hunting down scattered checks.
 */

type ProgressRecord = Record<string, unknown> | null | undefined;

const COMPLETION_STEPS = ["step5", "step4"];

function isStepCompleted(step: unknown): boolean {
	if (!step || typeof step !== "object") {
		return false;
	}
	const record = step as Record<string, unknown>;
	const completed = record.completed;
	return completed === true;
}

/**
 * Determine whether onboarding is complete based on stored progress metadata.
 */
export function isOnboardingComplete(options: { progress?: ProgressRecord; completedAt?: string | null }): boolean {
	const { progress, completedAt } = options;

	if (completedAt) {
		return true;
	}

	if (!progress || typeof progress !== "object") {
		return false;
	}

	const progressRecord = progress as Record<string, unknown>;

	if (progressRecord.completed === true) {
		return true;
	}

	return COMPLETION_STEPS.some((stepKey) => isStepCompleted(progressRecord[stepKey]));
}
