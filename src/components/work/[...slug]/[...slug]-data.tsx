import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Generic work detail data loader for the catch-all `[...slug]` route.
 * This can be wired up to specific work entities when enabling PPR.
 */
export async function WorkSlugData() {
  const supabase = await createClient();
  if (!supabase) return notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return notFound();

  const activeCompanyId = await getActiveCompanyId();
  if (!activeCompanyId) return notFound();

  // TODO: Move data fetching logic from the original work detail page when we PPR-ify it

  return <div>Data component for generic work [...slug] route</div>;
}
