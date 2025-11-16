/**
 * Edit Data - Async Server Component
 *
 * Displays work item edit form.
 * This component is wrapped in Suspense for PPR pattern.
 */

import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function EditData({ id }: { id: string }) {
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

	// TODO: Fetch work item data and render edit form
	// const { data: workItem } = await supabase
	//   .from("jobs")
	//   .select("*")
	//   .eq("id", id)
	//   .eq("company_id", activeCompanyId)
	//   .single();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-semibold text-2xl">Edit Work Item</h1>
				<p className="text-muted-foreground">ID: {id}</p>
			</div>
			<div className="rounded-lg border p-6">
				<p className="text-muted-foreground">Edit form coming soon...</p>
			</div>
		</div>
	);
}
