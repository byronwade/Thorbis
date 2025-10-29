/**
 * Role Type Definitions
 *
 * Defines all user roles in the system with their permissions and capabilities
 */

export const USER_ROLES = {
  OWNER: "owner",
  DISPATCHER: "dispatcher",
  MANAGER: "manager",
  TECHNICIAN: "technician",
  CSR: "csr", // Customer Service Representative
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface RoleConfig {
  id: UserRole;
  label: string;
  description: string;
  color: string;
  permissions: string[];
  dashboardFeatures: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  [USER_ROLES.OWNER]: {
    id: "owner",
    label: "Owner",
    description: "Full system access with focus on business financials and growth",
    color: "purple",
    permissions: ["*"],
    dashboardFeatures: [
      "financial-overview",
      "profit-margins",
      "cash-flow",
      "business-growth",
      "payroll-overview",
      "all-reports",
    ],
  },
  [USER_ROLES.DISPATCHER]: {
    id: "dispatcher",
    label: "Dispatcher",
    description: "Manage technician schedules, job assignments, and real-time operations",
    color: "blue",
    permissions: [
      "view-schedule",
      "manage-assignments",
      "view-technicians",
      "dispatch-jobs",
      "view-customers",
    ],
    dashboardFeatures: [
      "dispatch-map",
      "technician-locations",
      "unassigned-jobs",
      "emergency-queue",
      "quick-dispatch",
      "tech-status",
    ],
  },
  [USER_ROLES.MANAGER]: {
    id: "manager",
    label: "Manager",
    description: "Oversee team performance, customer satisfaction, and operations",
    color: "green",
    permissions: [
      "view-reports",
      "manage-team",
      "view-customers",
      "handle-escalations",
      "view-financials",
    ],
    dashboardFeatures: [
      "team-performance",
      "customer-satisfaction",
      "callback-queue",
      "review-alerts",
      "kpi-tracking",
      "inventory-management",
    ],
  },
  [USER_ROLES.TECHNICIAN]: {
    id: "technician",
    label: "Technician",
    description: "View assigned jobs, update job status, and track personal performance",
    color: "orange",
    permissions: [
      "view-my-schedule",
      "update-job-status",
      "view-job-details",
      "upload-photos",
      "create-invoices",
    ],
    dashboardFeatures: [
      "my-schedule",
      "active-job",
      "my-earnings",
      "my-performance",
      "parts-inventory",
      "time-tracking",
    ],
  },
  [USER_ROLES.CSR]: {
    id: "csr",
    label: "Customer Service Rep",
    description: "Handle customer calls, schedule appointments, and manage customer relationships",
    color: "pink",
    permissions: [
      "view-customers",
      "create-jobs",
      "schedule-appointments",
      "view-schedule",
      "send-communications",
    ],
    dashboardFeatures: [
      "call-queue",
      "booking-calendar",
      "customer-search",
      "follow-up-queue",
      "estimate-pipeline",
      "call-scripts",
    ],
  },
  [USER_ROLES.ADMIN]: {
    id: "admin",
    label: "Admin",
    description: "System administration and configuration",
    color: "red",
    permissions: ["*"],
    dashboardFeatures: [
      "system-settings",
      "user-management",
      "integrations",
      "audit-logs",
    ],
  },
};

export function getRoleConfig(role: UserRole): RoleConfig {
  return ROLE_CONFIGS[role];
}

export function hasPermission(role: UserRole, permission: string): boolean {
  const config = getRoleConfig(role);
  return config.permissions.includes("*") || config.permissions.includes(permission);
}
