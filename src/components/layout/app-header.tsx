import { getPayrixMerchantAccount } from "@/actions/payrix";
import { getCompanyPhoneNumbers } from "@/actions/telnyx";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getUserCompanies, getUserProfile } from "@/lib/auth/user-data";
import { getUnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";
import { headers } from "next/headers";
import { AppHeaderClient } from "./app-header-client";

/**
 * AppHeader - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches user data BEFORE rendering (eliminates loading flash)
 * - Uses cached getUserProfile() and getUserCompanies() with RLS security
 * - Uses LIGHTWEIGHT getCustomersForDialer() instead of getAllCustomers()
 *   (50-100ms vs 1200-2000ms - eliminates N+1 query pattern)
 * - Fetches company phones for dialer functionality
 * - Passes data to minimal client component for interactivity only
 * - Better SEO and initial page load performance
 *
 * Why Server Component?
 * - Dashboard is always protected (user always logged in via middleware)
 * - No need for client-side loading states or auth checks
 * - Faster initial render with server-fetched data
 * - Smaller JavaScript bundle (auth logic stays on server)
 *
 * Conditional Rendering:
 * - Dashboard layout decides when to render the header (e.g. hides on TV/welcome routes)
 */

export async function AppHeader() {
	// For now, always pass null - the client component will handle sub-header detection
	const subHeaderComponent = null;

	// Fetch user profile and companies on server (cached with React cache())
	// This runs on server BEFORE sending HTML to client
	// Handle prerender cookie access gracefully
	let userProfile;
	let companies;
	let activeCompanyId;

	try {
		[userProfile, companies, activeCompanyId] = await Promise.all([
			getUserProfile(),
			getUserCompanies(),
			getActiveCompanyId(),
		]);
	} catch (error) {
		// During prerendering, cookies() may reject - this is expected
		// Return null and let the client-side handle it
		if (error instanceof Error && error.message.includes("prerendering")) {
			return null;
		}
		// Log error for monitoring but don't expose details to user
		console.error("AppHeader: Failed to fetch user data", error);
		throw error; // Let error boundary handle it
	}

	// If no user, this should never happen because dashboard is protected by middleware
	// But we handle it gracefully anyway
	if (!userProfile) {
		return null; // Middleware will redirect to login
	}

	// Fetch ONLY company phone numbers on server
	// PERFORMANCE: Customer data is lazy-loaded on client when dialer opens
	// This saves 400-800ms per page load by not fetching ALL customers upfront
	let companyPhones: any[] = [];
	let hasPhoneNumbers = false;
	let hasPayrixAccount = false;
	let payrixStatus: string | null = null;

	if (activeCompanyId) {
		try {
			const [phonesResult, payrixResult] = await Promise.all([
				getCompanyPhoneNumbers(activeCompanyId),
				getPayrixMerchantAccount(activeCompanyId),
			]);

			if (phonesResult.success && phonesResult.data) {
				companyPhones = phonesResult.data.map((p) => ({
					id: p.id,
					number: p.phone_number,
					label: p.formatted_number || p.phone_number,
				}));
				hasPhoneNumbers = phonesResult.data.length > 0;
			}

			if (payrixResult.success && payrixResult.data) {
				hasPayrixAccount = true;
				payrixStatus = payrixResult.data.status;
			}
		} catch (_error) {
			// Continue without phone/payrix data - component will handle empty array
		}
	}

	// Pass server-fetched data to client component for interactivity
	// Customers will be lazy-loaded on client side when dialer is opened
	return (
		<AppHeaderClient
			activeCompanyId={activeCompanyId}
			companies={companies}
			companyPhones={companyPhones}
			userProfile={userProfile}
			hasPhoneNumbers={hasPhoneNumbers}
			hasPayrixAccount={hasPayrixAccount}
			payrixStatus={payrixStatus}
			subHeader={subHeaderComponent}
		/>
	);
}
