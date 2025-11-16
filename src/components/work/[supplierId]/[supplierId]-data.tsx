import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Work supplier detail data loader for the dynamic `[supplierId]` route.
 * This can be wired up to specific supplier entities when enabling PPR.
 */
export async function WorkSupplierIdData() {
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

	// TODO: Move data fetching logic from the original supplier detail page when we PPR-ify it

	return <div>Data component for [supplierId]</div>;
}
