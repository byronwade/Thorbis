import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function UcalendarData() {
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

	// TODO: Move data fetching logic from original page

	return <div>Data component for calendar</div>;
}
