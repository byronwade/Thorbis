/**
 * Usage & Billing Dashboard - Server Component
 *
 * Performance optimizations:
 * - Server Component by default
 * - Real-time usage metrics from Supabase
 * - Client components only for interactive charts
 * - Lazy-load UsageTrendsChart (recharts ~100KB+)
 */

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { BudgetAlertsPanel } from "@/components/telnyx/budget-alerts-panel";
import { CostBreakdownTable } from "@/components/telnyx/cost-breakdown-table";
import { ExportUsageButton } from "@/components/telnyx/export-usage-button";
import { UsageMetricsCards } from "@/components/telnyx/usage-metrics-cards";
import { createClient } from "@/lib/supabase/server";

/**
 * PERFORMANCE: Lazy load chart component with recharts dependency
 * Only loads when user scrolls to trends section
 */
const UsageTrendsChart = dynamic(
  () =>
    import("@/components/telnyx/usage-trends-chart").then(
      (mod) => mod.UsageTrendsChart
    ),
  {
    loading: () => <div className="h-96 animate-pulse rounded-lg bg-muted" />,
  }
);

export default async function UsageBillingPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/login");

  // Get current user and company
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (!profile?.company_id) redirect("/dashboard");

  const companyId = profile.company_id;

  // Fetch usage data for current month
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
    23,
    59,
    59
  ).toISOString();

  // Get call usage
  const { data: calls } = await supabase
    .from("communications")
    .select("*")
    .eq("company_id", companyId)
    .eq("type", "phone")
    .gte("created_at", startOfMonth)
    .lte("created_at", endOfMonth);

  // Get SMS usage
  const { data: messages } = await supabase
    .from("communications")
    .select("*")
    .eq("company_id", companyId)
    .eq("type", "sms")
    .gte("created_at", startOfMonth)
    .lte("created_at", endOfMonth);

  // Get voicemail usage
  const { data: voicemails } = await supabase
    .from("voicemails")
    .select("*")
    .eq("company_id", companyId)
    .gte("received_at", startOfMonth)
    .lte("received_at", endOfMonth);

  // Get phone numbers
  const { data: phoneNumbers } = await supabase
    .from("phone_numbers")
    .select("*")
    .eq("company_id", companyId)
    .is("deleted_at", null);

  // Calculate usage metrics
  const callMinutes =
    calls?.reduce((sum, call) => {
      if (call.duration_seconds) {
        return sum + Math.ceil(call.duration_seconds / 60);
      }
      return sum;
    }, 0) || 0;

  const smsSent =
    messages?.filter((m) => m.direction === "outbound").length || 0;
  const smsReceived =
    messages?.filter((m) => m.direction === "inbound").length || 0;
  const voicemailCount = voicemails?.length || 0;
  const voicemailMinutes =
    voicemails?.reduce(
      (sum, vm) =>
        sum + (vm.duration_seconds ? Math.ceil(vm.duration_seconds / 60) : 0),
      0
    ) || 0;

  // Calculate costs (based on Telnyx pricing)
  const callCost = callMinutes * 0.012; // $0.012 per minute
  const smsCost = smsSent * 0.0075; // $0.0075 per SMS sent
  const voicemailTranscriptionCost = voicemailCount * 0.05; // $0.05 per transcription
  const phoneNumberCost = (phoneNumbers?.length || 0) * 1.0; // $1.00 per number per month

  const totalCost =
    callCost + smsCost + voicemailTranscriptionCost + phoneNumberCost;

  // Get company budget settings
  const { data: company } = await supabase
    .from("companies")
    .select("telnyx_budget_limit, telnyx_budget_alert_threshold")
    .eq("id", companyId)
    .single();

  const budgetLimit = company?.telnyx_budget_limit || 100; // Default $100
  const alertThreshold = company?.telnyx_budget_alert_threshold || 80; // Default 80%
  const budgetUsedPercent = (totalCost / budgetLimit) * 100;

  // Prepare data for components
  const metrics = {
    callMinutes,
    smsSent,
    smsReceived,
    voicemailCount,
    voicemailMinutes,
    totalCost,
    phoneNumberCount: phoneNumbers?.length || 0,
  };

  const costs = {
    callCost,
    smsCost,
    voicemailTranscriptionCost,
    phoneNumberCost,
    totalCost,
  };

  const budget = {
    limit: budgetLimit,
    used: totalCost,
    usedPercent: budgetUsedPercent,
    alertThreshold,
    isOverBudget: totalCost > budgetLimit,
    isNearLimit: budgetUsedPercent >= alertThreshold,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-4xl tracking-tight">Usage & Billing</h1>
          <p className="text-muted-foreground">
            Track your Telnyx usage and costs
          </p>
        </div>
        <ExportUsageButton
          companyId={companyId}
          endDate={endOfMonth}
          startDate={startOfMonth}
        />
      </div>

      {/* Budget Alert */}
      {budget.isNearLimit && <BudgetAlertsPanel budget={budget} />}

      {/* Usage Metrics Cards */}
      <UsageMetricsCards costs={costs} metrics={metrics} />

      {/* Usage Trends Chart */}
      <UsageTrendsChart companyId={companyId} />

      {/* Cost Breakdown Table */}
      <CostBreakdownTable costs={costs} phoneNumbers={phoneNumbers || []} />
    </div>
  );
}
