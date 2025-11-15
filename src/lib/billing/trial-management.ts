import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import type { ServiceSupabaseClient } from "@/lib/supabase/service-client";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_TRIAL_LENGTH_DAYS = 14;

type TrialOptions = {
  companyId: string;
  trialLengthDays?: number;
  now?: Date;
  serviceClient?: ServiceSupabaseClient;
};

type ExpireOptions = {
  companyId: string;
  now?: Date;
  serviceClient?: ServiceSupabaseClient;
};

export async function ensureCompanyTrialStatus({
  companyId,
  trialLengthDays = DEFAULT_TRIAL_LENGTH_DAYS,
  now = new Date(),
  serviceClient,
}: TrialOptions): Promise<{
  trialEndsAt: string;
  statusChanged: boolean;
}> {
  const client =
    serviceClient ?? (await createServiceSupabaseClient());

  const { data: company, error } = await client
    .from("companies")
    .select("stripe_subscription_status, trial_ends_at")
    .eq("id", companyId)
    .maybeSingle();

  if (error || !company) {
    throw new Error(
      error?.message || "Company not found while provisioning trial"
    );
  }

  const updates: Record<string, unknown> = {};
  let statusChanged = false;
  const currentStatus = company.stripe_subscription_status;
  const existingTrialEndsAt = company.trial_ends_at as string | null;

  if (
    currentStatus !== "active" &&
    currentStatus !== "trialing" &&
    currentStatus !== "paused"
  ) {
    updates.stripe_subscription_status = "trialing";
    statusChanged = true;
  }

  if (!existingTrialEndsAt) {
    const calculatedEndsAt = new Date(
      now.getTime() + trialLengthDays * DAY_IN_MS
    ).toISOString();
    updates.trial_ends_at = calculatedEndsAt;
  }

  if (Object.keys(updates).length > 0) {
    await client.from("companies").update(updates).eq("id", companyId);
  }

  const newTrialEndsAt =
    (updates.trial_ends_at as string | undefined) ?? existingTrialEndsAt;

  if (!newTrialEndsAt) {
    throw new Error("Unable to determine trial end date");
  }

  return {
    trialEndsAt: newTrialEndsAt,
    statusChanged,
  };
}

export async function expireCompanyTrialIfEligible({
  companyId,
  now = new Date(),
  serviceClient,
}: ExpireOptions): Promise<{ expired: boolean }> {
  const client =
    serviceClient ?? (await createServiceSupabaseClient());

  const { data: company, error } = await client
    .from("companies")
    .select("stripe_subscription_status, trial_ends_at")
    .eq("id", companyId)
    .maybeSingle();

  if (error || !company) {
    console.error("Failed to load company for trial expiration:", error);
    return { expired: false };
  }

  if (company.stripe_subscription_status !== "trialing") {
    return { expired: false };
  }

  const trialEndsAt = company.trial_ends_at as string | null;
  if (!trialEndsAt) {
    return { expired: false };
  }

  const trialEndDate = new Date(trialEndsAt);
  if (trialEndDate.getTime() > now.getTime()) {
    return { expired: false };
  }

  await client
    .from("companies")
    .update({ stripe_subscription_status: "incomplete_expired" })
    .eq("id", companyId)
    .eq("stripe_subscription_status", "trialing");

  return { expired: true };
}

