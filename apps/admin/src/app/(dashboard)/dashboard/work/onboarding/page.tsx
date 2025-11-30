import { Suspense } from "react";
import { getOnboardingProgress, getOnboardingStats } from "@/actions/onboarding";
import { OnboardingManager } from "@/components/work/onboarding-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Onboarding Management Page
 *
 * Track and manage company onboarding progress.
 */
async function OnboardingData() {
	const [progressResult, statsResult] = await Promise.all([
		getOnboardingProgress(50),
		getOnboardingStats(),
	]);

	if (progressResult.error || statsResult.error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					{progressResult.error || statsResult.error || "Failed to load onboarding data"}
				</p>
			</div>
		);
	}

	return (
		<OnboardingManager
			initialProgress={progressResult.data || []}
			initialStats={statsResult.data || {
				total_companies: 0,
				in_progress: 0,
				completed_this_week: 0,
				avg_completion_time_days: 0,
				completion_rate: 0,
			}}
		/>
	);
}

export default function OnboardingPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Onboarding</h1>
				<p className="text-muted-foreground text-sm">
					Track new company onboarding progress and completion rates
				</p>
			</div>
			<Suspense fallback={<OnboardingSkeleton />}>
				<OnboardingData />
			</Suspense>
		</div>
	);
}

/**
 * Loading skeleton
 */
function OnboardingSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<Skeleton className="h-4 w-24 mb-2" />
							<Skeleton className="h-8 w-16 mb-1" />
							<Skeleton className="h-3 w-20" />
						</CardContent>
					</Card>
				))}
			</div>
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-10 w-full mb-4" />
					<div className="space-y-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-16 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
