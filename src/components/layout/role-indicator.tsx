"use client";

import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRoleStore } from "@/lib/stores/role-store";
import { ROLE_CONFIGS } from "@/types/roles";

/**
 * Role Indicator Component - Client Component
 *
 * Displays the current user's role in the header
 * Useful for development and testing different role views
 * Uses Zustand for state management (no Context Provider needed)
 */

export function RoleIndicator() {
  const role = useRoleStore((state) => state.role);
  const config = ROLE_CONFIGS[role];

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const colorClasses = {
    purple: "border-border text-accent-foreground bg-accent/10",
    blue: "border-primary text-primary bg-primary/10",
    green: "border-success text-success bg-success/10",
    orange: "border-warning text-warning bg-warning/10",
    pink: "border-border text-accent-foreground bg-accent/10",
    red: "border-destructive text-destructive bg-destructive/10",
  };

  return (
    <Badge
      className={`flex items-center gap-1.5 ${colorClasses[config.color as keyof typeof colorClasses] || colorClasses.blue}`}
      variant="outline"
    >
      <Shield className="size-3" />
      <span className="text-xs">{config.label}</span>
    </Badge>
  );
}
