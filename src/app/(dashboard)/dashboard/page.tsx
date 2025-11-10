/**
 * Main Dashboard Page - Server Component
 *
 * Fetches dashboard data server-side and passes to client components
 * This prevents server/client boundary violations with next/headers
 */

import { RoleBasedDashboard } from "@/components/dashboard/role-based-dashboard";
import { getMissionControlData } from "@/lib/dashboard/mission-control-data";
import { getActiveCompanyId } from "@/lib/auth/company-context";

export default async function DashboardPage() {
  // Fetch company ID and data server-side
  const companyId = await getActiveCompanyId();
  const dashboardData = companyId ? await getMissionControlData(companyId) : null;

  return <RoleBasedDashboard dashboardData={dashboardData} />;
}
