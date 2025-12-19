"use client";

/**
 * Customers Stats (Convex Version)
 *
 * Client component that fetches customer statistics from Convex.
 * Provides real-time updates via Convex subscriptions.
 */
import { useCustomerStats } from "@/lib/convex/hooks/customers";
import { useActiveCompany } from "@/lib/convex/hooks/use-active-company";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Archive } from "lucide-react";

/**
 * Loading skeleton for stats cards
 */
function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Stats Card Component
 */
interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Customers Stats - Client Component using Convex
 *
 * REAL-TIME UPDATES:
 * - Uses Convex subscriptions for live data updates
 * - Stats update automatically when customers change
 */
export function CustomersStatsConvex() {
  const { activeCompanyId, isLoading: companyLoading } = useActiveCompany();

  // Fetch stats from Convex
  const stats = useCustomerStats(
    activeCompanyId
      ? { companyId: activeCompanyId }
      : "skip"
  );

  // Loading state
  if (companyLoading || stats === undefined) {
    return <StatsLoadingSkeleton />;
  }

  // No company selected
  if (!activeCompanyId) {
    return null;
  }

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Customers"
        value={stats.total}
        description={`${stats.residential} residential, ${stats.commercial} commercial`}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="Active Customers"
        value={stats.active}
        description={`${Math.round((stats.active / (stats.total || 1)) * 100)}% of total`}
        icon={<UserCheck className="h-4 w-4 text-green-500" />}
      />
      <StatsCard
        title="Inactive Customers"
        value={stats.inactive}
        description={`${stats.archived} archived`}
        icon={<UserX className="h-4 w-4 text-yellow-500" />}
      />
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        description={`${formatCurrency(stats.totalOutstanding)} outstanding`}
        icon={<Archive className="h-4 w-4 text-blue-500" />}
      />
    </div>
  );
}
