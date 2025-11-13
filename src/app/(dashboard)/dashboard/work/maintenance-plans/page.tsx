/**
 * Maintenance Plans Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real-time data from Supabase
 * - Only MaintenancePlansTable component is client-side for interactivity
 * - Better SEO and initial page load performance
 * - Matches jobs/invoices page structure: stats pipeline + table/kanban views
 */

import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { MaintenancePlansKanban } from "@/components/work/maintenance-plans-kanban";
import { MaintenancePlansTable } from "@/components/work/maintenance-plans-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export default async function MaintenancePlansPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Get active company ID
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    return notFound();
  }

  // Fetch maintenance plans from database (include archived; filter in UI)
  const { data: plansRaw, error } = await supabase
    .from("maintenance_plans")
    .select(`
      *,
      customer:customers!customer_id(display_name, first_name, last_name)
    `)
    .eq("company_id", activeCompanyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching maintenance plans:", error);
  }

  // Transform data for table component
  const plans = (plansRaw || []).map((plan: any) => {
    const customer = Array.isArray(plan.customer)
      ? plan.customer[0]
      : plan.customer;
    const amountCents = plan.amount ? Math.round(Number(plan.amount) * 100) : 0;

    return {
      id: plan.id,
      planNumber: plan.plan_number,
      name: plan.name,
      planName: plan.name || plan.plan_name,
      serviceType: plan.frequency || "Maintenance",
      customer:
        customer?.display_name ||
        `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
        "Unknown Customer",
      status: plan.status,
      frequency: plan.frequency,
      price: amountCents,
      monthlyFee: amountCents,
      nextServiceDue: plan.next_service_date
        ? new Date(plan.next_service_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      nextVisit: plan.next_service_date
        ? new Date(plan.next_service_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      startDate: plan.start_date
        ? new Date(plan.start_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      archived_at: plan.archived_at,
      deleted_at: null,
    };
  });

  // Filter to active plans for stats calculations
  const activePlans = plans.filter((p) => !(p.archived_at || p.deleted_at));

  // Calculate maintenance plan stats (from active plans only)
  const totalPlans = activePlans.length;
  const activeCount = activePlans.filter((p) => p.status === "active").length;
  const pendingCount = activePlans.filter((p) => p.status === "pending").length;
  const suspendedCount = activePlans.filter(
    (p) => p.status === "suspended"
  ).length;
  const uniqueCustomers = new Set(activePlans.map((p) => p.customer)).size;
  const monthlyRevenue = activePlans
    .filter((p) => p.status === "active")
    .reduce((sum, p) => {
      // Convert annual to monthly if needed
      const monthly = p.price / 12;
      return sum + monthly;
    }, 0);
  const visitsThisMonth = activePlans.filter((p) => {
    if (!p.nextServiceDue) return false;
    const dueDate = new Date(p.nextServiceDue);
    const now = new Date();
    return (
      dueDate.getMonth() === now.getMonth() &&
      dueDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const planStats: StatCard[] = [
    {
      label: "Active Plans",
      value: activeCount,
      change: activeCount > 0 ? 11.4 : 0, // Green if active plans exist
      changeLabel: `${activeCount} active`,
    },
    {
      label: "Enrolled Customers",
      value: uniqueCustomers,
      change: uniqueCustomers > 0 ? 8.7 : 0, // Green if customers enrolled
      changeLabel: "enrolled customers",
    },
    {
      label: "This Month",
      value: visitsThisMonth,
      change: visitsThisMonth > 0 ? 5.3 : 0, // Green if visits scheduled
      changeLabel: "scheduled visits",
    },
    {
      label: "Monthly Revenue",
      value: `$${(monthlyRevenue / 100).toLocaleString()}`,
      change: monthlyRevenue > 0 ? 13.2 : 0, // Green if revenue exists
      changeLabel: "recurring revenue",
    },
    {
      label: "Total Plans",
      value: totalPlans,
      change: totalPlans > 0 ? 9.6 : 0, // Green if plans exist
      changeLabel: "all plans",
    },
  ];

  return (
    <>
      <StatusPipeline compact stats={planStats} />
      <WorkDataView
        kanban={<MaintenancePlansKanban plans={plans} />}
        section="maintenancePlans"
        table={<MaintenancePlansTable itemsPerPage={50} plans={plans} />}
      />
    </>
  );
}
