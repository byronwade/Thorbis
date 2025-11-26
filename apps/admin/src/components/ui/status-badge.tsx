/**
 * Admin Status Badge Components
 *
 * Simple status badges for admin panel entities.
 */

import { Badge, cn } from "@stratos/ui";
import {
	AlertCircle,
	Ban,
	Calendar,
	CheckCircle,
	Clock,
	FileText,
	Loader2,
	Mail,
	Pause,
	Send,
	Timer,
	XCircle,
} from "lucide-react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

/**
 * Company Status Badge
 */
export function CompanyStatusBadge({
	status,
	className,
}: {
	status: string;
	className?: string;
}) {
	const config = getCompanyStatusConfig(status);
	const Icon = config.icon;

	return (
		<Badge
			className={cn(
				"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
				config.className,
				className
			)}
			variant={config.variant}
		>
			<Icon className="h-3 w-3" />
			{config.label}
		</Badge>
	);
}

function getCompanyStatusConfig(status: string): {
	label: string;
	icon: typeof CheckCircle;
	className: string;
	variant: BadgeVariant;
} {
	switch (status?.toLowerCase()) {
		case "active":
			return {
				label: "Active",
				icon: CheckCircle,
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
				variant: "outline",
			};
		case "trial":
			return {
				label: "Trial",
				icon: Timer,
				className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
				variant: "outline",
			};
		case "suspended":
			return {
				label: "Suspended",
				icon: Pause,
				className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
				variant: "outline",
			};
		case "cancelled":
		case "canceled":
			return {
				label: "Cancelled",
				icon: Ban,
				className: "bg-red-500/10 text-red-600 border-red-500/20",
				variant: "outline",
			};
		default:
			return {
				label: status || "Unknown",
				icon: AlertCircle,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
	}
}

/**
 * Subscription Status Badge
 */
export function SubscriptionStatusBadge({
	status,
	className,
}: {
	status: string;
	className?: string;
}) {
	const config = getSubscriptionStatusConfig(status);
	const Icon = config.icon;

	return (
		<Badge
			className={cn(
				"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
				config.className,
				className
			)}
			variant={config.variant}
		>
			<Icon className="h-3 w-3" />
			{config.label}
		</Badge>
	);
}

function getSubscriptionStatusConfig(status: string): {
	label: string;
	icon: typeof CheckCircle;
	className: string;
	variant: BadgeVariant;
} {
	switch (status?.toLowerCase()) {
		case "active":
			return {
				label: "Active",
				icon: CheckCircle,
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
				variant: "outline",
			};
		case "trialing":
			return {
				label: "Trialing",
				icon: Timer,
				className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
				variant: "outline",
			};
		case "past_due":
			return {
				label: "Past Due",
				icon: AlertCircle,
				className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
				variant: "outline",
			};
		case "cancelled":
		case "canceled":
			return {
				label: "Cancelled",
				icon: Ban,
				className: "bg-red-500/10 text-red-600 border-red-500/20",
				variant: "outline",
			};
		case "paused":
			return {
				label: "Paused",
				icon: Pause,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
		default:
			return {
				label: status || "Unknown",
				icon: AlertCircle,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
	}
}

/**
 * User Status Badge
 */
export function UserStatusBadge({
	status,
	className,
}: {
	status: string;
	className?: string;
}) {
	const config = getUserStatusConfig(status);
	const Icon = config.icon;

	return (
		<Badge
			className={cn(
				"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
				config.className,
				className
			)}
			variant={config.variant}
		>
			<Icon className="h-3 w-3" />
			{config.label}
		</Badge>
	);
}

function getUserStatusConfig(status: string): {
	label: string;
	icon: typeof CheckCircle;
	className: string;
	variant: BadgeVariant;
} {
	switch (status?.toLowerCase()) {
		case "active":
			return {
				label: "Active",
				icon: CheckCircle,
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
				variant: "outline",
			};
		case "pending":
			return {
				label: "Pending",
				icon: Clock,
				className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
				variant: "outline",
			};
		case "suspended":
			return {
				label: "Suspended",
				icon: Pause,
				className: "bg-red-500/10 text-red-600 border-red-500/20",
				variant: "outline",
			};
		case "inactive":
			return {
				label: "Inactive",
				icon: Ban,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
		default:
			return {
				label: status || "Unknown",
				icon: AlertCircle,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
	}
}

/**
 * Ticket Status Badge
 */
export function TicketStatusBadge({
	status,
	className,
}: {
	status: string;
	className?: string;
}) {
	const config = getTicketStatusConfig(status);
	const Icon = config.icon;

	return (
		<Badge
			className={cn(
				"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
				config.className,
				className
			)}
			variant={config.variant}
		>
			<Icon className="h-3 w-3" />
			{config.label}
		</Badge>
	);
}

function getTicketStatusConfig(status: string): {
	label: string;
	icon: typeof CheckCircle;
	className: string;
	variant: BadgeVariant;
} {
	switch (status?.toLowerCase()) {
		case "open":
			return {
				label: "Open",
				icon: AlertCircle,
				className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
				variant: "outline",
			};
		case "in_progress":
			return {
				label: "In Progress",
				icon: Clock,
				className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
				variant: "outline",
			};
		case "resolved":
			return {
				label: "Resolved",
				icon: CheckCircle,
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
				variant: "outline",
			};
		case "closed":
			return {
				label: "Closed",
				icon: Ban,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
		default:
			return {
				label: status || "Unknown",
				icon: AlertCircle,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
	}
}

/**
 * Plan Badge
 */
export function PlanBadge({
	plan,
	className,
}: {
	plan: string;
	className?: string;
}) {
	const config = getPlanConfig(plan);

	return (
		<Badge
			className={cn(
				"px-2 py-0.5 text-[11px] font-medium",
				config.className,
				className
			)}
			variant={config.variant}
		>
			{config.label}
		</Badge>
	);
}

function getPlanConfig(plan: string): {
	label: string;
	className: string;
	variant: BadgeVariant;
} {
	switch (plan?.toLowerCase()) {
		case "starter":
			return {
				label: "Starter",
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
		case "professional":
		case "pro":
			return {
				label: "Professional",
				className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
				variant: "outline",
			};
		case "enterprise":
			return {
				label: "Enterprise",
				className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
				variant: "outline",
			};
		default:
			return {
				label: plan || "Free",
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
	}
}

/**
 * Campaign Status Badge
 */
export function CampaignStatusBadge({
	status,
	className,
}: {
	status: string;
	className?: string;
}) {
	const config = getCampaignStatusConfig(status);
	const Icon = config.icon;

	return (
		<Badge
			className={cn(
				"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
				config.className,
				className
			)}
			variant={config.variant}
		>
			<Icon className="h-3 w-3" />
			{config.label}
		</Badge>
	);
}

function getCampaignStatusConfig(status: string): {
	label: string;
	icon: typeof CheckCircle;
	className: string;
	variant: BadgeVariant;
} {
	switch (status?.toLowerCase()) {
		case "draft":
			return {
				label: "Draft",
				icon: FileText,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
		case "scheduled":
			return {
				label: "Scheduled",
				icon: Calendar,
				className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
				variant: "outline",
			};
		case "sending":
			return {
				label: "Sending",
				icon: Loader2,
				className: "bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse",
				variant: "outline",
			};
		case "sent":
			return {
				label: "Sent",
				icon: CheckCircle,
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
				variant: "outline",
			};
		case "paused":
			return {
				label: "Paused",
				icon: Pause,
				className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
				variant: "outline",
			};
		case "cancelled":
		case "canceled":
			return {
				label: "Cancelled",
				icon: XCircle,
				className: "bg-red-500/10 text-red-600 border-red-500/20",
				variant: "outline",
			};
		default:
			return {
				label: status || "Unknown",
				icon: AlertCircle,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
	}
}

/**
 * Campaign Audience Type Badge
 */
export function AudienceTypeBadge({
	audienceType,
	className,
}: {
	audienceType: string;
	className?: string;
}) {
	const config = getAudienceTypeConfig(audienceType);
	const Icon = config.icon;

	return (
		<Badge
			className={cn(
				"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
				config.className,
				className
			)}
			variant={config.variant}
		>
			<Icon className="h-3 w-3" />
			{config.label}
		</Badge>
	);
}

function getAudienceTypeConfig(audienceType: string): {
	label: string;
	icon: typeof CheckCircle;
	className: string;
	variant: BadgeVariant;
} {
	switch (audienceType?.toLowerCase()) {
		case "all_users":
			return {
				label: "All Users",
				icon: Mail,
				className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
				variant: "outline",
			};
		case "all_companies":
			return {
				label: "All Companies",
				icon: Mail,
				className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
				variant: "outline",
			};
		case "waitlist":
			return {
				label: "Waitlist",
				icon: Clock,
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
				variant: "outline",
			};
		case "segment":
			return {
				label: "Segment",
				icon: Send,
				className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
				variant: "outline",
			};
		case "custom":
			return {
				label: "Custom",
				icon: FileText,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
		default:
			return {
				label: audienceType || "Unknown",
				icon: AlertCircle,
				className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
				variant: "outline",
			};
	}
}

// Re-export web app status badges for shared component compatibility
export { JobStatusBadge, PriorityBadge } from "@web/components/ui/status-badge";
