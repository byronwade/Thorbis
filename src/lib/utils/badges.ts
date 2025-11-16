/**
 * Centralized Badge Utilities
 *
 * Unified badge configurations for status, priority, and type badges.
 * Replaces duplicate implementations scattered across components.
 */

export type BadgeConfig = {
	className: string;
	label: string;
};

/**
 * Job status badge configurations
 */
export function getJobStatusBadgeConfig(status: string): BadgeConfig {
	const configs: Record<string, BadgeConfig> = {
		quoted: {
			className: "border-border/50 bg-background text-muted-foreground hover:bg-muted/50",
			label: "Quoted",
		},
		scheduled: {
			className:
				"border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
			label: "Scheduled",
		},
		in_progress: {
			className: "border-blue-500/50 bg-blue-500 text-white hover:bg-blue-600",
			label: "In Progress",
		},
		completed: {
			className: "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
			label: "Completed",
		},
		cancelled: {
			className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
			label: "Cancelled",
		},
	};

	return (
		configs[status] || {
			className: "border-border/50 bg-background text-muted-foreground",
			label: status.replace(/_/g, " "),
		}
	);
}

/**
 * Invoice status badge configurations
 */
export function getInvoiceStatusBadgeConfig(status: string): BadgeConfig {
	const configs: Record<string, BadgeConfig> = {
		paid: {
			className: "border-green-500/30 bg-green-500 text-white hover:bg-green-600 shadow-sm",
			label: "Paid",
		},
		unpaid: {
			className:
				"border-yellow-200/50 bg-yellow-50/50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-400 shadow-sm",
			label: "Unpaid",
		},
		overdue: {
			className: "border-red-500/30 bg-red-500 text-white hover:bg-red-600 shadow-sm ring-1 ring-red-500/20",
			label: "Overdue",
		},
		draft: {
			className: "border-border/50 bg-background text-muted-foreground hover:bg-muted/50 shadow-sm",
			label: "Draft",
		},
		sent: {
			className:
				"border-blue-200/50 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400 shadow-sm",
			label: "Sent",
		},
		pending: {
			className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 shadow-sm",
			label: "Pending",
		},
	};

	return (
		configs[status] || {
			className: "border-border/50 bg-background text-muted-foreground shadow-sm",
			label: status.replace(/_/g, " "),
		}
	);
}

/**
 * Estimate status badge configurations
 */
export function getEstimateStatusBadgeConfig(status: string): BadgeConfig {
	const configs: Record<string, BadgeConfig> = {
		accepted: {
			className: "bg-green-500 hover:bg-green-600 text-white",
			label: "Accepted",
		},
		sent: {
			className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
			label: "Sent",
		},
		draft: {
			className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
			label: "Draft",
		},
		declined: {
			className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
			label: "Declined",
		},
	};

	return (
		configs[status] || {
			className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
			label: status.replace(/_/g, " "),
		}
	);
}

/**
 * Contract status badge configurations
 */
export function getContractStatusBadgeConfig(status: string): BadgeConfig {
	const configs: Record<string, BadgeConfig> = {
		signed: {
			className: "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
			label: "Signed",
		},
		sent: {
			className:
				"border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
			label: "Sent",
		},
		viewed: {
			className:
				"border-purple-200/50 bg-purple-50/50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-400",
			label: "Viewed",
		},
		draft: {
			className: "border-border/50 bg-background text-muted-foreground hover:bg-muted/50",
			label: "Draft",
		},
		rejected: {
			className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
			label: "Rejected",
		},
		expired: {
			className:
				"border-orange-200/50 bg-orange-50/50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-400",
			label: "Expired",
		},
	};

	return (
		configs[status] || {
			className: "border-border/50 bg-background text-muted-foreground hover:bg-muted/50",
			label: status.replace(/_/g, " "),
		}
	);
}

/**
 * Customer status badge configurations
 */
export function getCustomerStatusBadgeConfig(status: string): BadgeConfig {
	const configs: Record<string, BadgeConfig> = {
		active: {
			className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
			label: "Active",
		},
		inactive: {
			className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
			label: "Inactive",
		},
		prospect: {
			className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
			label: "Prospect",
		},
		lead: {
			className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
			label: "Lead",
		},
	};

	return (
		configs[status] || {
			className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
			label: status.replace(/_/g, " "),
		}
	);
}

/**
 * Priority badge configurations
 */
export function getPriorityBadgeConfig(priority: string): BadgeConfig {
	const configs: Record<string, BadgeConfig> = {
		low: {
			className:
				"border-blue-200/50 bg-blue-50/50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400",
			label: "Low",
		},
		medium: {
			className:
				"border-yellow-200/50 bg-yellow-50/50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-400",
			label: "Medium",
		},
		high: {
			className:
				"border-orange-200/50 bg-orange-50/50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-400",
			label: "High",
		},
		urgent: {
			className:
				"border-red-200/50 bg-red-50/50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400",
			label: "Urgent",
		},
	};

	return (
		configs[priority] || {
			className: "border-border/50 bg-background text-muted-foreground",
			label: priority.replace(/_/g, " "),
		}
	);
}

/**
 * Purchase order status badge configurations
 */
export function getPurchaseOrderStatusBadgeConfig(status: string): BadgeConfig {
	const configs: Record<string, BadgeConfig> = {
		draft: {
			className: "border-border/50 bg-background text-muted-foreground hover:bg-muted/50",
			label: "Draft",
		},
		pending: {
			className:
				"border-yellow-200/50 bg-yellow-50/50 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-400",
			label: "Pending",
		},
		approved: {
			className: "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
			label: "Approved",
		},
		partially_received: {
			className:
				"border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
			label: "Partially Received",
		},
		received: {
			className: "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
			label: "Received",
		},
		cancelled: {
			className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
			label: "Cancelled",
		},
	};

	return (
		configs[status] || {
			className: "border-border/50 bg-background text-muted-foreground",
			label: status.replace(/_/g, " "),
		}
	);
}

/**
 * Contract type badge configurations
 */
export function getContractTypeBadgeConfig(type: string): BadgeConfig {
	const configs: Record<string, BadgeConfig> = {
		service: {
			className:
				"border-blue-200/50 bg-blue-50/50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400",
			label: "Service",
		},
		maintenance: {
			className:
				"border-green-200/50 bg-green-50/50 text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400",
			label: "Maintenance",
		},
		custom: {
			className:
				"border-purple-200/50 bg-purple-50/50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-400",
			label: "Custom",
		},
	};

	return (
		configs[type] || {
			className:
				"border-purple-200/50 bg-purple-50/50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-400",
			label: type.replace(/_/g, " "),
		}
	);
}

/**
 * Generic status badge config getter
 */
export function getStatusBadgeConfig(
	status: string,
	type: "job" | "invoice" | "estimate" | "contract" | "customer"
): BadgeConfig {
	switch (type) {
		case "job":
			return getJobStatusBadgeConfig(status);
		case "invoice":
			return getInvoiceStatusBadgeConfig(status);
		case "estimate":
			return getEstimateStatusBadgeConfig(status);
		case "contract":
			return getContractStatusBadgeConfig(status);
		case "customer":
			return getCustomerStatusBadgeConfig(status);
		default:
			return {
				className: "border-border/50 bg-background text-muted-foreground",
				label: status.replace(/_/g, " "),
			};
	}
}
