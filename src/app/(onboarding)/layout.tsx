import { Suspense } from "react";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";

/**
 * Onboarding Layout - Minimal, focused experience
 *
 * No sidebar, no navigation, no distractions.
 * Just:
 * - User dropdown (top left) - switch companies / logout
 * - Help link (top right)
 * - Clean white background
 *
 * This layout is used for:
 * - /welcome (onboarding wizard)
 * - /onboarding/* (payment success/cancel pages)
 */
export default function OnboardingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Minimal header with user dropdown */}
			<Suspense fallback={<HeaderSkeleton />}>
				<OnboardingHeader />
			</Suspense>

			{/* Content */}
			<main className="flex-1 flex flex-col">
				{children}
			</main>
		</div>
	);
}

function HeaderSkeleton() {
	return (
		<header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
			<div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
				<div className="flex items-center justify-between h-14">
					<div className="flex items-center gap-2">
						<div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
						<div className="h-4 w-24 rounded bg-muted animate-pulse hidden sm:block" />
					</div>
					<div className="h-4 w-16 rounded bg-muted animate-pulse" />
				</div>
			</div>
		</header>
	);
}
