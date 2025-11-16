"use client";

import CSRDashboard from "@/components/dashboard/views/csr-dashboard";
import DispatcherDashboard from "@/components/dashboard/views/dispatcher-dashboard";
import ManagerDashboard from "@/components/dashboard/views/manager-dashboard";
import OwnerDashboard from "@/components/dashboard/views/owner-dashboard";
import TechnicianDashboard from "@/components/dashboard/views/technician-dashboard";
import { useRoleStore } from "@/lib/stores/role-store";
import { USER_ROLES } from "@/types/roles";

/**
 * Role-Based Dashboard Router - Client Component
 *
 * Routes users to their appropriate dashboard view based on their role
 * In production, this would use actual user authentication data
 * Uses Zustand for state management (no Context Provider needed)
 */

interface RoleBasedDashboardProps {
  dashboardData?: any;
  renderedAt?: number;
}

export function RoleBasedDashboard({
  dashboardData,
  renderedAt,
}: RoleBasedDashboardProps) {
  const role = useRoleStore((state) => state.role);
  const isLoading = useRoleStore((state) => state.isLoading);

  // Show loading state while role is being determined
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground text-sm">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on role
  switch (role) {
    case USER_ROLES.OWNER:
    case USER_ROLES.ADMIN:
      return <OwnerDashboard data={dashboardData} renderedAt={renderedAt} />;

    case USER_ROLES.DISPATCHER:
      return <DispatcherDashboard />;

    case USER_ROLES.MANAGER:
      return <ManagerDashboard />;

    case USER_ROLES.TECHNICIAN:
      return <TechnicianDashboard />;

    case USER_ROLES.CSR:
      return <CSRDashboard />;

    default:
      return <OwnerDashboard data={dashboardData} renderedAt={renderedAt} />;
  }
}
