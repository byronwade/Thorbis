/**
 * Status Badge Component
 *
 * Reusable badge component that uses centralized badge configurations.
 * Provides consistent styling across the application.
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  type BadgeConfig,
  getContractTypeBadgeConfig,
  getJobStatusBadgeConfig,
  getPriorityBadgeConfig,
  getPurchaseOrderStatusBadgeConfig,
  getStatusBadgeConfig,
} from "@/lib/utils/badges";

type StatusBadgeProps = {
  status: string;
  type?:
    | "job"
    | "invoice"
    | "estimate"
    | "contract"
    | "customer"
    | "purchase_order";
  priority?: string;
  contractType?: string;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
};

/**
 * StatusBadge - Unified badge component for all status types
 */
export function StatusBadge({
  status,
  type,
  priority,
  contractType,
  className,
  variant = "outline",
}: StatusBadgeProps) {
  let config: BadgeConfig;

  if (contractType) {
    config = getContractTypeBadgeConfig(contractType);
  } else if (priority) {
    config = getPriorityBadgeConfig(priority);
  } else if (type === "purchase_order") {
    config = getPurchaseOrderStatusBadgeConfig(status);
  } else if (type) {
    config = getStatusBadgeConfig(status, type);
  } else {
    // Default to job status if no type specified
    config = getJobStatusBadgeConfig(status);
  }

  return (
    <Badge
      className={cn("font-medium text-[11px] px-2 py-0.5 transition-all duration-200", config.className, className)}
      variant={variant}
    >
      {config.label}
    </Badge>
  );
}

/**
 * JobStatusBadge - Convenience component for job statuses
 */
export function JobStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return <StatusBadge className={className} status={status} type="job" />;
}

/**
 * InvoiceStatusBadge - Convenience component for invoice statuses
 */
export function InvoiceStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return <StatusBadge className={className} status={status} type="invoice" />;
}

/**
 * EstimateStatusBadge - Convenience component for estimate statuses
 */
export function EstimateStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return <StatusBadge className={className} status={status} type="estimate" />;
}

/**
 * ContractStatusBadge - Convenience component for contract statuses
 */
export function ContractStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return <StatusBadge className={className} status={status} type="contract" />;
}

/**
 * CustomerStatusBadge - Convenience component for customer statuses
 */
export function CustomerStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return <StatusBadge className={className} status={status} type="customer" />;
}

/**
 * PriorityBadge - Convenience component for priority badges
 */
export function PriorityBadge({
  priority,
  className,
}: {
  priority: string;
  className?: string;
}) {
  return <StatusBadge className={className} priority={priority} status="" />;
}

/**
 * ContractTypeBadge - Convenience component for contract type badges
 */
export function ContractTypeBadge({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  return <StatusBadge className={className} contractType={type} status="" />;
}
