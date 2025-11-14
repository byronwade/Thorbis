"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireActiveCompany } from "@/lib/auth/company-context";
import { requireUser } from "@/lib/auth/session";

const toggleSchema = z.object({
  enabled: z.boolean(),
});

export async function togglePurchaseOrderSystem(enabled: boolean) {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Unable to connect to Supabase");
  }

  const user = await requireUser();
  const companyId = await requireActiveCompany();
  const payload = toggleSchema.parse({ enabled });
  const timestamp = new Date().toISOString();

  const { data, error } = await supabase
    .from("company_settings")
    .upsert(
      {
        company_id: companyId,
        po_system_enabled: payload.enabled,
        po_system_last_enabled_at: payload.enabled ? timestamp : null,
      },
      { onConflict: "company_id" }
    )
    .select("po_system_enabled,po_system_last_enabled_at")
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to update purchase order system");
  }

  const actorName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? null;
  const actionKey = payload.enabled ? "po_system.enabled" : "po_system.disabled";
  const description = payload.enabled
    ? "Purchase order system enabled."
    : "Purchase order system disabled.";

  const { error: activityError } = await supabase.from("activities").insert({
    action: actionKey,
    activity_type: "settings.change",
    actor_id: user.id,
    actor_name: actorName,
    actor_type: "user",
    category: "settings",
    company_id: companyId,
    created_at: timestamp,
    description,
    entity_id: companyId,
    entity_type: "company",
    is_important: false,
    is_system_generated: false,
    is_visible: true,
    metadata: {
      source: "settings_overview",
      po_system_enabled: payload.enabled,
    },
    occurred_at: timestamp,
  });
  if (activityError) {
    // Non-blocking telemetry failure
  }

  revalidatePath("/dashboard/settings");

  return {
    enabled: Boolean(data?.po_system_enabled ?? payload.enabled),
    lastEnabledAt: data?.po_system_last_enabled_at ?? (payload.enabled ? timestamp : null),
  };
}

