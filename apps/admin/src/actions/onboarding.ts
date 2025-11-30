"use server";

/**
 * Onboarding Management Actions
 *
 * Server actions for tracking company onboarding progress.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";

export interface OnboardingProgress {
	company_id: string;
	company_name: string;
	completion_percentage: number;
	current_step?: string;
	steps_completed: number;
	total_steps: number;
	started_at: string;
	completed_at?: string;
	status: "not_started" | "in_progress" | "completed" | "stalled";
}

export interface OnboardingStats {
	total_companies: number;
	in_progress: number;
	completed_this_week: number;
	avg_completion_time_days: number;
	completion_rate: number;
}

/**
 * Get onboarding progress for all companies
 */
export async function getOnboardingProgress(limit: number = 50) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		// Get companies with onboarding data
		const { data: companies, error } = await webDb
			.from("companies")
			.select("id, name, created_at, onboarding_completion_percentage, onboarding_step_completed, onboarding_completed_at")
			.order("created_at", { ascending: false })
			.limit(limit);

		if (error) {
			console.error("Failed to fetch companies:", error);
			return { error: "Failed to fetch onboarding progress" };
		}

		const progress: OnboardingProgress[] = (companies || []).map((company) => {
			const completionPercentage = company.onboarding_completion_percentage || 0;
			const stepsData = (company.onboarding_step_completed as Record<string, boolean>) || {};
			const stepsCompleted = Object.values(stepsData).filter(Boolean).length;
			const totalSteps = 8; // Estimated total steps

			let status: OnboardingProgress["status"] = "not_started";
			if (completionPercentage === 0) {
				status = "not_started";
			} else if (completionPercentage >= 75 && company.onboarding_completed_at) {
				status = "completed";
			} else if (completionPercentage > 0) {
				// Check if stalled (no progress in 7+ days)
				const updatedAt = new Date(company.onboarding_step_completed?.updated_at as string || company.created_at);
				const daysSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
				status = daysSinceUpdate > 7 ? "stalled" : "in_progress";
			}

			return {
				company_id: company.id,
				company_name: company.name,
				completion_percentage: completionPercentage,
				current_step: stepsCompleted > 0 ? `Step ${stepsCompleted}` : undefined,
				steps_completed: stepsCompleted,
				total_steps: totalSteps,
				started_at: company.created_at,
				completed_at: company.onboarding_completed_at || undefined,
				status,
			};
		});

		return { data: progress };
	} catch (error) {
		console.error("Failed to get onboarding progress:", error);
		return { error: error instanceof Error ? error.message : "Failed to get onboarding progress" };
	}
}

/**
 * Get onboarding statistics
 */
export async function getOnboardingStats(): Promise<{ data?: OnboardingStats; error?: string }> {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		const { data: companies } = await webDb
			.from("companies")
			.select("created_at, onboarding_completion_percentage, onboarding_completed_at");

		if (!companies) {
			return {
				data: {
					total_companies: 0,
					in_progress: 0,
					completed_this_week: 0,
					avg_completion_time_days: 0,
					completion_rate: 0,
				},
			};
		}

		const now = new Date();
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

		const inProgress = companies.filter(
			(c) => (c.onboarding_completion_percentage || 0) > 0 && !c.onboarding_completed_at,
		).length;

		const completedThisWeek = companies.filter(
			(c) => c.onboarding_completed_at && new Date(c.onboarding_completed_at) >= weekAgo,
		).length;

		// Calculate average completion time
		const completedCompanies = companies.filter((c) => c.onboarding_completed_at && c.created_at);
		const totalCompletionTime = completedCompanies.reduce((sum, c) => {
			const created = new Date(c.created_at).getTime();
			const completed = new Date(c.onboarding_completed_at!).getTime();
			return sum + (completed - created) / (1000 * 60 * 60 * 24); // days
		}, 0);
		const avgCompletionTime = completedCompanies.length > 0 ? totalCompletionTime / completedCompanies.length : 0;

		const completionRate = companies.length > 0
			? (completedCompanies.length / companies.length) * 100
			: 0;

		return {
			data: {
				total_companies: companies.length,
				in_progress,
				completed_this_week: completedThisWeek,
				avg_completion_time_days: Math.round(avgCompletionTime),
				completion_rate: Math.round(completionRate * 100) / 100,
			},
		};
	} catch (error) {
		console.error("Failed to get onboarding stats:", error);
		return { error: error instanceof Error ? error.message : "Failed to get onboarding stats" };
	}
}

