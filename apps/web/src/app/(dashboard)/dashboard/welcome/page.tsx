/**
 * Welcome Page - Onboarding Wizard
 *
 * Clean onboarding experience within the dashboard.
 * Uses PPR for instant page loads.
 */

import { Suspense } from "react";
import { WelcomeData } from "@/components/onboarding/welcome-data";
import { WelcomeSkeleton } from "@/components/onboarding/welcome-skeleton";

type WelcomePageProps = {
	searchParams: Promise<{ new?: string }>;
};

export default async function WelcomePage({ searchParams }: WelcomePageProps) {
	const params = await searchParams;
	const isCreatingNewCompany = params.new === "true";

	return (
		<Suspense fallback={<WelcomeSkeleton />}>
			<WelcomeData isCreatingNewCompany={isCreatingNewCompany} />
		</Suspense>
	);
}
