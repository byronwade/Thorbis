import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Generic "new" work entity data loader for routes like `/work/appointments/new`
 * and `/work/contracts/new`. This can be specialized later per entity type.
 */
export async function WorkNewData() {
  const supabase = await createClient();
  if (!supabase) return notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return notFound();

  const activeCompanyId = await getActiveCompanyId();
  if (!activeCompanyId) return notFound();

  // TODO: Load any shared defaults needed for "new" work entities

  return <div>Work entity creation data loader placeholder</div>;
}
