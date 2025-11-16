import { cn } from "@/lib/utils";

/**
 * StatusIndicator Component
 * Displays a colored dot indicator for user status
 */

export type UserStatus = "online" | "available" | "busy";

type StatusIndicatorProps = {
	status: UserStatus;
	className?: string;
	showLabel?: boolean;
	size?: "sm" | "md" | "lg";
};

const statusConfig = {
	online: {
		color: "bg-green-500",
		label: "Online",
		ring: "ring-green-500/20",
	},
	available: {
		color: "bg-blue-500",
		label: "Available",
		ring: "ring-blue-500/20",
	},
	busy: {
		color: "bg-red-500",
		label: "Busy",
		ring: "ring-red-500/20",
	},
} as const;

const sizeConfig = {
	sm: "size-2",
	md: "size-2.5",
	lg: "size-3",
} as const;

export function StatusIndicator({ status, className, showLabel = false, size = "md" }: StatusIndicatorProps) {
	const config = statusConfig[status];
	const sizeClass = sizeConfig[size];

	if (showLabel) {
		return (
			<div className={cn("flex items-center gap-2", className)}>
				<div className={cn("rounded-full ring-2", config.color, config.ring, sizeClass)} />
				<span className="text-muted-foreground text-sm">{config.label}</span>
			</div>
		);
	}

	return (
		<div className={cn("rounded-full ring-2", config.color, config.ring, sizeClass, className)} title={config.label} />
	);
}
