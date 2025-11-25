import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";
import { getEmailProviderStatus } from "@/actions/settings/email-provider";
import { EmailProviderContent } from "./email-provider-content";

export async function EmailProviderData() {
	const supabase = await createClient();
	if (!supabase) {
		return notFound();
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return notFound();
	}

	const activeCompanyId = await getActiveCompanyId();
	if (!activeCompanyId) {
		return notFound();
	}

	// Get current provider status
	const status = await getEmailProviderStatus();

	return (
		<EmailProviderContent
			currentProvider={status.provider}
			isConnected={status.isConnected}
			companyId={activeCompanyId}
		/>
	);
}
