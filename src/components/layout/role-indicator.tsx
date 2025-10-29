"use client";

import { Shield } from "lucide-react";
import { useRoleStore } from "@/lib/stores/role-store";
import { ROLE_CONFIGS } from "@/types/roles";
import { Badge } from "@/components/ui/badge";

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
    purple: "border-purple-600 text-purple-600 bg-purple-500/10",
    blue: "border-blue-600 text-blue-600 bg-blue-500/10",
    green: "border-green-600 text-green-600 bg-green-500/10",
    orange: "border-orange-600 text-orange-600 bg-orange-500/10",
    pink: "border-pink-600 text-pink-600 bg-pink-500/10",
    red: "border-red-600 text-red-600 bg-red-500/10",
  };

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 ${colorClasses[config.color as keyof typeof colorClasses] || colorClasses.blue}`}
    >
      <Shield className="size-3" />
      <span className="text-xs">{config.label}</span>
    </Badge>
  );
}
