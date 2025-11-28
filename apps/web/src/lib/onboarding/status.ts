/**
 * Utilities for determining onboarding completion across server components
 * and API routes. Keeps the logic centralized so we can evolve the rules
 * (e.g. adding new steps) without hunting down scattered checks.
 */

type ProgressRecord = Record<string, unknown> | null | undefined;

// Must match STEPS_ORDER from onboarding-store.ts
const REQUIRED_STEPS = ["welcome", "company"] as const;
const FINAL_STEP = "complete" as const;

/**
 * Determine whether onboarding is complete based on stored progress metadata.
 *
 * Completion criteria (in priority order):
 * 1. `completedAt` timestamp exists (set by completeOnboardingWizard action)
 * 2. `onboardingCompleted` flag is true in progress data
 * 3. "complete" step exists in completedSteps array
 *
 * Note: We intentionally check multiple signals for backward compatibility
 * with older onboarding records that may have different data structures.
 */
export function isOnboardingComplete(options: {
	progress?: ProgressRecord;
	completedAt?: string | null;
}): boolean {
	const { progress, completedAt } = options;

	// Primary check: completedAt timestamp from database
	if (completedAt) {
		return true;
	}

	if (!progress || typeof progress !== "object") {
		return false;
	}

	const progressRecord = progress as Record<string, unknown>;

	// Check onboardingCompleted flag
	if (progressRecord.onboardingCompleted === true) {
		return true;
	}

	// Check if completedSteps array includes the final step
	const completedSteps = progressRecord.completedSteps;
	if (Array.isArray(completedSteps) && completedSteps.includes(FINAL_STEP)) {
		return true;
	}

	return false;
}

/**
 * Get onboarding progress percentage based on completed steps.
 */
function getOnboardingProgress(options: {
	progress?: ProgressRecord;
}): number {
	const { progress } = options;

	if (!progress || typeof progress !== "object") {
		return 0;
	}

	const progressRecord = progress as Record<string, unknown>;
	const completedSteps = progressRecord.completedSteps;
	const skippedSteps = progressRecord.skippedSteps;

	if (!Array.isArray(completedSteps)) {
		return 0;
	}

	const totalSteps = 14; // Total steps in onboarding
	const finishedCount =
		completedSteps.length +
		(Array.isArray(skippedSteps) ? skippedSteps.length : 0);

	return Math.round((finishedCount / totalSteps) * 100);
}

/**
 * Check if required steps are completed.
 * Returns which required steps are missing if any.
 */
function getMissingRequiredSteps(options: {
	progress?: ProgressRecord;
}): string[] {
	const { progress } = options;

	if (!progress || typeof progress !== "object") {
		return [...REQUIRED_STEPS];
	}

	const progressRecord = progress as Record<string, unknown>;
	const completedSteps = progressRecord.completedSteps;

	if (!Array.isArray(completedSteps)) {
		return [...REQUIRED_STEPS];
	}

	return REQUIRED_STEPS.filter((step) => !completedSteps.includes(step));
}

/**
 * Get the current onboarding step from progress data.
 */
function getCurrentOnboardingStep(options: {
	progress?: ProgressRecord;
}): string {
	const { progress } = options;

	if (!progress || typeof progress !== "object") {
		return "welcome";
	}

	const progressRecord = progress as Record<string, unknown>;
	const currentStep = progressRecord.currentStep;

	if (typeof currentStep === "string" && currentStep.length > 0) {
		return currentStep;
	}

	return "welcome";
}
