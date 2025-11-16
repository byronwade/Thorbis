/**
 * Onboarding Header Component
 *
 * Header for onboarding page with:
 * - Thorbis logo and name
 * - User dropdown with company switcher
 * - Shows onboarding status for each company
 *
 * Note: This is a client component because it's used in WelcomePage which is a client component.
 * The client component fetches its own data to avoid server/client boundary issues.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { UserProfile } from "@/lib/auth/user-data";
import { OnboardingHeaderClient } from "./onboarding-header-client";

export function OnboardingHeader() {
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [companies, setCompanies] = useState<
		Array<{
			id: string;
			name: string;
			plan: string;
			onboardingComplete?: boolean;
			hasPayment?: boolean;
		}>
	>([]);
	const [loading, setLoading] = useState(true);

	// CRITICAL: useCallback prevents infinite loop
	// Without it, fetchData is recreated on every render → useEffect runs infinitely
	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			// Fetch user profile and companies client-side
			const [profileRes, companiesRes] = await Promise.all([
				fetch("/api/get-current-user-info"),
				fetch("/api/get-user-companies"),
			]);

			if (profileRes.ok) {
				const profileData = await profileRes.json();
				setUserProfile({
					id: profileData.id || "",
					name:
						`${profileData.firstName} ${profileData.lastName}`.trim() ||
						profileData.email,
					email: profileData.email,
					avatar: "",
					emailVerified: profileData.emailVerified,
					createdAt: profileData.createdAt
						? new Date(profileData.createdAt)
						: new Date(),
				});
			} else {
			}

			if (companiesRes.ok) {
				const companiesData = await companiesRes.json();
				// Deduplicate by ID just in case (defensive programming)
				const uniqueCompanies = Array.from(
					new Map(companiesData.map((c: any) => [c.id, c])).values(),
				) as Array<{
					id: string;
					name: string;
					plan: string;
					onboardingComplete?: boolean;
					hasPayment?: boolean;
				}>;
				setCompanies(uniqueCompanies || []);
			} else {
				const _errorData = await companiesRes.json().catch(() => ({}));
				setCompanies([]); // Set empty array on error
			}
		} catch (_error) {
			setCompanies([]); // Set empty array on error
		} finally {
			setLoading(false);
		}
	}, []); // Empty deps - function is stable, only depends on setState which are stable

	useEffect(() => {
		// Fetch data once on mount
		fetchData();

		// Listen for custom event to refresh companies list
		const handleRefresh = () => {
			fetchData();
		};

		// REMOVED: visibilitychange listener - too aggressive, caused continuous API calls
		// Only listen for explicit refresh events

		window.addEventListener("refresh-companies", handleRefresh);

		return () => {
			window.removeEventListener("refresh-companies", handleRefresh);
		};
	}, [fetchData]); // fetchData is now stable (useCallback)

	if (loading || !userProfile) {
		return (
			<header className="sticky top-0 z-50 w-full bg-header-bg">
				<div className="flex h-14 items-center gap-2 px-4">
					<Link
						className="flex size-8 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:hover:bg-accent/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
						href="/dashboard"
					>
						<Image
							alt="Thorbis"
							className="size-5"
							height={20}
							src="/ThorbisLogo.webp"
							width={20}
						/>
						<span className="sr-only">Thorbis</span>
					</Link>
				</div>
			</header>
		);
	}

	return (
		<OnboardingHeaderClient companies={companies} userProfile={userProfile} />
	);
}
