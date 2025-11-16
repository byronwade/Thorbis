import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Communication detail data loader for the dynamic `[id]` route.
 * This is a server component helper that can be used with Suspense/PPR.
 */
export async function CommunicationIdData() {
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

  // TODO: Move data fetching logic from original page when we PPR-ify it

  return <div>Communication detail data loader placeholder</div>;
}
