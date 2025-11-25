import { getUserProfile, getUserCompanies } from "@/lib/auth/user-data";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { OnboardingUserMenu } from "./onboarding-user-menu";

/**
 * Onboarding Header - Server Component
 *
 * Minimal header for onboarding flow:
 * - User dropdown on left (companies + logout)
 * - No navigation, no branding clutter
 *
 * Clean, focused experience for new users completing setup.
 *
 * SPECIAL LOGIC: On the welcome page, we prioritize incomplete companies
 * for DISPLAY purposes only. We don't set cookies here - let the user's
 * explicit click in the dropdown be the only thing that sets the cookie.
 */
export async function OnboardingHeader() {
	let userProfile;
	let companies;
	let activeCompanyId: string | null;

	try {
		[userProfile, companies, activeCompanyId] = await Promise.all([
			getUserProfile(),
			getUserCompanies(),
			getActiveCompanyId(),
		]);
	} catch (error) {
		// During prerendering, cookies() may reject - this is expected
		if (error instanceof Error && error.message.includes("prerendering")) {
			return null;
		}
		console.error("OnboardingHeader: Failed to fetch user data", error);
		return null;
	}

	if (!userProfile) {
		return null;
	}

	// On the onboarding page, prioritize incomplete companies for DISPLAY only
	// If active company is complete but user has incomplete companies, show the first incomplete
	// NOTE: We do NOT set a cookie here - only update the displayed company
	// The user's explicit click in the dropdown is what should set the cookie
	const activeCompany = companies.find((c) => c.id === activeCompanyId);
	const incompleteCompanies = companies.filter((c) => !c.onboardingComplete);

	if (activeCompany?.onboardingComplete && incompleteCompanies.length > 0) {
		// Just update the displayed company, don't persist to cookie
		activeCompanyId = incompleteCompanies[0].id;
	}

	return (
		<header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
				<div className="flex items-center justify-between h-14">
					{/* Left: User dropdown */}
					<OnboardingUserMenu
						user={{
							id: userProfile.id,
							email: userProfile.email || "",
							name: userProfile.full_name || undefined,
							avatar_url: userProfile.avatar_url || undefined,
						}}
						companies={companies.map((c) => ({
							id: c.id,
							name: c.name,
							onboarding_completed_at: c.onboardingComplete ? "completed" : null,
						}))}
						activeCompanyId={activeCompanyId}
					/>

					{/* Right: Help link (optional) */}
					<a
						href="mailto:support@thorbis.com"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						Need help?
					</a>
				</div>
			</div>
		</header>
	);
}
