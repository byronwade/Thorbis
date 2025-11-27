import { AiPageContent } from "@/components/ai/ai-page-content";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";

// Force dynamic rendering since this page requires auth context
export const dynamic = "force-dynamic";

export default async function AiPage() {
	// Use cached helpers for user + active company to reduce re-renders and queries
	const [user, activeCompanyId] = await Promise.all([
		getCurrentUser(),
		getActiveCompanyId(),
	]);
	const fallbackCompanyId = process.env.DEFAULT_COMPANY_ID;
	const companyId = activeCompanyId || fallbackCompanyId;

	return <AiPageContent companyId={companyId || undefined} userId={user?.id} />;
}
