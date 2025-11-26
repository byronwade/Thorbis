import { AiPageContent } from "@/components/ai/ai-page-content";
import { createClient } from "@/lib/supabase/server";

// Force dynamic rendering since this page requires auth context
export const dynamic = "force-dynamic";

export default async function AiPage() {
	// Get the user's company ID from their active company membership
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	let companyId: string | undefined;

	if (user) {
		// Get the user's active company membership
		const { data: membership } = await supabase
			.from("company_memberships")
			.select("company_id")
			.eq("user_id", user.id)
			.eq("status", "active")
			.order("joined_at", { ascending: false, nullsFirst: false })
			.limit(1)
			.maybeSingle();

		companyId = membership?.company_id || undefined;
	}

	return <AiPageContent companyId={companyId} />;
}
