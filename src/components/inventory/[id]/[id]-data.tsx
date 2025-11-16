import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Inventory vendor detail data loader for the dynamic `[id]` route.
 * This is a server component helper that can be used with Suspense/PPR.
 */
export async function InventoryVendorIdData() {
  const supabase = await createClient();
  if (!supabase) return notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return notFound();

  const activeCompanyId = await getActiveCompanyId();
  if (!activeCompanyId) return notFound();

  // TODO: Move data fetching logic from original vendor detail page when we PPR-ify it

  return <div>Inventory vendor detail data loader placeholder</div>;
}
