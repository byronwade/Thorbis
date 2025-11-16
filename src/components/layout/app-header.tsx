import { getAllCustomers } from "@/actions/customers";
import { getCompanyPhoneNumbers } from "@/actions/telnyx";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getUserCompanies, getUserProfile } from "@/lib/auth/user-data";
import { AppHeaderClient } from "./app-header-client";

/**
 * AppHeader - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches user data BEFORE rendering (eliminates loading flash)
 * - Uses cached getUserProfile() and getUserCompanies() with RLS security
 * - Fetches customers and company phones for dialer functionality
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
		throw error;
	}

	// If no user, this should never happen because dashboard is protected by middleware
	// But we handle it gracefully anyway
	if (!userProfile) {
		return null; // Middleware will redirect to login
	}

	// Fetch customers and phone numbers for phone dropdown
	let customers: any[] = [];
	let companyPhones: any[] = [];

	if (activeCompanyId) {
		try {
			// Fetch in parallel for better performance
			const [customersResult, phonesResult] = await Promise.all([
				getAllCustomers(),
				getCompanyPhoneNumbers(activeCompanyId),
			]);

			if (customersResult.success && customersResult.data) {
				customers = customersResult.data.map((c) => ({
					id: c.id,
					first_name: c.first_name,
					last_name: c.last_name,
					email: c.email,
					phone: c.phone,
					company_name: c.company_name,
				}));
			}

			if (phonesResult.success && phonesResult.data) {
				companyPhones = phonesResult.data.map((p) => ({
					id: p.id,
					number: p.phone_number,
					label: p.formatted_number || p.phone_number,
				}));
			}
		} catch (_error) {
			// Continue without phone data - component will handle empty arrays
		}
	}

	// Pass server-fetched data to client component for interactivity
	// Client component only handles interactive parts (mobile menu, active nav state)
	return (
		<AppHeaderClient
			activeCompanyId={activeCompanyId}
			companies={companies}
			companyPhones={companyPhones}
			customers={customers}
			userProfile={userProfile}
		/>
	);
}
