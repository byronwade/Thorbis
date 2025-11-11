/**
 * Generic Status Badge Component
 * 
 * A reusable badge component that accepts a status configuration map.
 * Used to consolidate duplicate getStatusBadge functions across table components.
 * 
 * @example
 * const statusConfig = {
 *   active: { label: "Active", className: "bg-green-500 text-white" },
 *   pending: { label: "Pending", className: "bg-yellow-500 text-white" },
 * };
 * 
 * <GenericStatusBadge status="active" config={statusConfig} />
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusConfig = {
  [key: string]: {
    label: string;
    className: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
};

interface GenericStatusBadgeProps {
  /** The status value to display */
  status: string;
  /** Configuration map: status -> { label, className, variant? } */
  config: StatusConfig;
  /** Default status to use if status not found in config */
  defaultStatus?: string;
  /** Additional className to apply */
  className?: string;
  /** Badge variant (overrides config variant) */
  variant?: "default" | "secondary" | "destructive" | "outline";
}

/**
 * GenericStatusBadge - Displays a badge based on status configuration
 */
export function GenericStatusBadge({
  status,
  config,
  defaultStatus,
  className,
  variant,
}: GenericStatusBadgeProps) {
  const statusConfig = config[status] || (defaultStatus ? config[defaultStatus] : null);

  if (!statusConfig) {
    // Fallback if status not found and no default
    return (
      <Badge className={cn("font-medium text-xs", className)} variant={variant || "outline"}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge
      className={cn("font-medium text-xs", statusConfig.className, className)}
      variant={variant || statusConfig.variant || "outline"}
    >
      {statusConfig.label}
    </Badge>
  );
}





