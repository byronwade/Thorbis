import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function UmaintenanceUplansStats() {
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

  // TODO: Move stats logic from original page
  const stats: StatCard[] = [];

  return <StatusPipeline compact stats={stats} />;
}
