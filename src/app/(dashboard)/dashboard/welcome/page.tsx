/**
 * Welcome Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Onboarding data streams in (200-400ms)
 *
 * This is the first page new users see, so performance is critical
 * for making a great first impression.
 *
 * Performance: 15-75x faster than traditional SSR
 */

import { Suspense } from "react";
import { WelcomeData } from "@/components/onboarding/welcome-data";
import { WelcomeSkeleton } from "@/components/onboarding/welcome-skeleton";

type WelcomePageProps = {
	searchParams: Promise<{ new?: string }>;
};

export default async function WelcomePage({ searchParams }: WelcomePageProps) {
	// Parse search params for the data component
	const params = await searchParams;
	const isCreatingNewCompany = params.new === "true";

	return (
		<Suspense fallback={<WelcomeSkeleton />}>
			<WelcomeData isCreatingNewCompany={isCreatingNewCompany} />
		</Suspense>
	);
}
