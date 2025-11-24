import { AiPageContent } from "@/components/ai/ai-page-content";
import { createClient } from "@/lib/supabase/server";

// Force dynamic rendering since this page requires auth context
export const dynamic = "force-dynamic";

export default async function AiPage() {
	// Get the user's company ID from the session
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	let companyId: string | undefined;

	if (user) {
		// Get the user's company from their profile
		const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single();

		companyId = profile?.company_id || undefined;
	}

	return <AiPageContent companyId={companyId} />;
}
