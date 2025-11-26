import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Inventory vendor "new" page data loader for the `/vendors/new` route.
 * This is a server helper that can later be wired into a full PPR flow.
 */
export async function InventoryVendorNewData() {
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

	// TODO: Load any defaults or reference data needed for the vendor create form

	return <div>Inventory vendor creation data loader placeholder</div>;
}
