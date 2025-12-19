"use client";

/**
 * StatusUpdateDropdown - Inline status change with server action
 *
 * Replaces static status badges with interactive dropdowns that update
 * the entity status via server actions with optimistic UI updates.
 */

import {
	AlertCircle,
	Ban,
	Check,
	CheckCircle,
	ChevronDown,
	Circle,
	Clock,
	FileCheck,
	Loader2,
	Pause,
	Play,
	Send,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * Entity types that support status updates
 */
export type StatusEntityType =
	| "job"
	| "invoice"
	| "estimate"
	| "contract"
	| "appointment"
	| "payment"
	| "purchase-order";

/**
 * Status option configuration
 */
export type StatusOption = {
	value: string;
	label: string;
	icon?: React.ReactNode;
	variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
	description?: string;
	confirmRequired?: boolean;
};

/**
 * Status configurations for each entity type
 */
const STATUS_CONFIGS: Record<StatusEntityType, StatusOption[]> = {
	job: [
		{ value: "quoted", label: "Quoted", icon: <FileCheck className="size-4" />, variant: "outline" },
		{ value: "scheduled", label: "Scheduled", icon: <Clock className="size-4" />, variant: "secondary" },
		{ value: "in_progress", label: "In Progress", icon: <Play className="size-4" />, variant: "default" },
		{ value: "on_hold", label: "On Hold", icon: <Pause className="size-4" />, variant: "warning" },
		{ value: "completed", label: "Completed", icon: <CheckCircle className="size-4" />, variant: "success" },
		{ value: "invoiced", label: "Invoiced", icon: <Send className="size-4" />, variant: "secondary" },
		{ value: "paid", label: "Paid", icon: <Check className="size-4" />, variant: "success" },
		{ value: "cancelled", label: "Cancelled", icon: <XCircle className="size-4" />, variant: "destructive", confirmRequired: true },
	],
	invoice: [
		{ value: "draft", label: "Draft", icon: <Circle className="size-4" />, variant: "outline" },
		{ value: "sent", label: "Sent", icon: <Send className="size-4" />, variant: "secondary" },
		{ value: "viewed", label: "Viewed", icon: <Check className="size-4" />, variant: "default" },
		{ value: "partial", label: "Partially Paid", icon: <Clock className="size-4" />, variant: "warning" },
		{ value: "paid", label: "Paid", icon: <CheckCircle className="size-4" />, variant: "success" },
		{ value: "overdue", label: "Overdue", icon: <AlertCircle className="size-4" />, variant: "destructive" },
		{ value: "void", label: "Void", icon: <Ban className="size-4" />, variant: "destructive", confirmRequired: true },
	],
	estimate: [
		{ value: "draft", label: "Draft", icon: <Circle className="size-4" />, variant: "outline" },
		{ value: "sent", label: "Sent", icon: <Send className="size-4" />, variant: "secondary" },
		{ value: "viewed", label: "Viewed", icon: <Check className="size-4" />, variant: "default" },
		{ value: "accepted", label: "Accepted", icon: <CheckCircle className="size-4" />, variant: "success" },
		{ value: "rejected", label: "Rejected", icon: <XCircle className="size-4" />, variant: "destructive" },
		{ value: "expired", label: "Expired", icon: <Clock className="size-4" />, variant: "warning" },
	],
	contract: [
		{ value: "draft", label: "Draft", icon: <Circle className="size-4" />, variant: "outline" },
		{ value: "sent", label: "Sent", icon: <Send className="size-4" />, variant: "secondary" },
		{ value: "viewed", label: "Viewed", icon: <Check className="size-4" />, variant: "default" },
		{ value: "signed", label: "Signed", icon: <CheckCircle className="size-4" />, variant: "success" },
		{ value: "rejected", label: "Rejected", icon: <XCircle className="size-4" />, variant: "destructive" },
		{ value: "expired", label: "Expired", icon: <Clock className="size-4" />, variant: "warning" },
	],
	appointment: [
		{ value: "scheduled", label: "Scheduled", icon: <Clock className="size-4" />, variant: "outline" },
		{ value: "confirmed", label: "Confirmed", icon: <Check className="size-4" />, variant: "secondary" },
		{ value: "in_progress", label: "In Progress", icon: <Play className="size-4" />, variant: "default" },
		{ value: "completed", label: "Completed", icon: <CheckCircle className="size-4" />, variant: "success" },
		{ value: "cancelled", label: "Cancelled", icon: <XCircle className="size-4" />, variant: "destructive", confirmRequired: true },
		{ value: "no_show", label: "No Show", icon: <AlertCircle className="size-4" />, variant: "warning" },
	],
	payment: [
		{ value: "pending", label: "Pending", icon: <Clock className="size-4" />, variant: "outline" },
		{ value: "processing", label: "Processing", icon: <Loader2 className="size-4 animate-spin" />, variant: "secondary" },
		{ value: "completed", label: "Completed", icon: <CheckCircle className="size-4" />, variant: "success" },
		{ value: "failed", label: "Failed", icon: <XCircle className="size-4" />, variant: "destructive" },
		{ value: "refunded", label: "Refunded", icon: <Ban className="size-4" />, variant: "warning" },
	],
	"purchase-order": [
		{ value: "draft", label: "Draft", icon: <Circle className="size-4" />, variant: "outline" },
		{ value: "submitted", label: "Submitted", icon: <Send className="size-4" />, variant: "secondary" },
		{ value: "approved", label: "Approved", icon: <Check className="size-4" />, variant: "default" },
		{ value: "ordered", label: "Ordered", icon: <Clock className="size-4" />, variant: "secondary" },
		{ value: "received", label: "Received", icon: <CheckCircle className="size-4" />, variant: "success" },
		{ value: "cancelled", label: "Cancelled", icon: <XCircle className="size-4" />, variant: "destructive", confirmRequired: true },
	],
};

/**
 * Badge variant mapping
 */
const BADGE_VARIANTS: Record<string, string> = {
	default: "bg-primary text-primary-foreground",
	secondary: "bg-secondary text-secondary-foreground",
	destructive: "bg-destructive text-destructive-foreground",
	outline: "border border-input bg-background",
	success: "bg-green-500/90 text-white",
	warning: "bg-amber-500/90 text-white",
};

type StatusUpdateDropdownProps = {
	/** Entity type for status options */
	entityType: StatusEntityType;
	/** Current status value */
	currentStatus: string;
	/** Entity ID for the update action */
	entityId: string;
	/** Server action to update status */
	onStatusChange: (entityId: string, newStatus: string) => Promise<{ success: boolean; error?: string }>;
	/** Optional callback after successful update */
	onSuccess?: () => void;
	/** Disable the dropdown */
	disabled?: boolean;
	/** Size variant */
	size?: "sm" | "md" | "lg";
	/** Additional className */
	className?: string;
};

export function StatusUpdateDropdown({
	entityType,
	currentStatus,
	entityId,
	onStatusChange,
	onSuccess,
	disabled = false,
	size = "md",
	className,
}: StatusUpdateDropdownProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [pendingStatus, setPendingStatus] = useState<string | null>(null);

	const statusOptions = STATUS_CONFIGS[entityType] || [];
	const currentOption = statusOptions.find((opt) => opt.value === currentStatus) || {
		value: currentStatus,
		label: currentStatus.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
		variant: "outline" as const,
	};

	const executeStatusChange = async (newStatus: string) => {
		const option = statusOptions.find((opt) => opt.value === newStatus);
		setIsOpen(false);

		startTransition(async () => {
			try {
				const result = await onStatusChange(entityId, newStatus);

				if (result.success) {
					toast.success(`Status updated to ${option?.label || newStatus}`);
					router.refresh();
					onSuccess?.();
				} else {
					toast.error(result.error || "Failed to update status");
				}
			} catch (error) {
				toast.error("An error occurred while updating status");
				console.error("Status update error:", error);
			}
		});
	};

	const handleStatusChange = async (newStatus: string) => {
		const option = statusOptions.find((opt) => opt.value === newStatus);

		if (option?.confirmRequired) {
			setPendingStatus(newStatus);
			setConfirmDialogOpen(true);
			return;
		}

		executeStatusChange(newStatus);
	};

	const handleConfirmStatusChange = () => {
		if (pendingStatus) {
			executeStatusChange(pendingStatus);
			setPendingStatus(null);
		}
		setConfirmDialogOpen(false);
	};

	const pendingOption = pendingStatus ? statusOptions.find((opt) => opt.value === pendingStatus) : null;

	const sizeClasses = {
		sm: "h-6 text-xs px-2",
		md: "h-8 text-sm px-3",
		lg: "h-10 text-base px-4",
	};

	return (
		<>
			<DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
				<DropdownMenuTrigger asChild disabled={disabled || isPending}>
					<Button
						className={cn(
							"gap-1.5 font-medium",
							sizeClasses[size],
							BADGE_VARIANTS[currentOption.variant || "outline"],
							isPending && "opacity-70",
							className
						)}
						disabled={disabled || isPending}
						size="sm"
						variant="outline"
					>
						{isPending ? (
							<Loader2 className="size-3.5 animate-spin" />
						) : (
							currentOption.icon
						)}
						<span>{currentOption.label}</span>
						<ChevronDown className="size-3" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-48">
					{statusOptions.map((option, index) => (
						<div key={option.value}>
							{option.confirmRequired && index > 0 && <DropdownMenuSeparator />}
							<DropdownMenuItem
								className={cn(
									"flex items-center gap-2 cursor-pointer",
									option.value === currentStatus && "bg-muted"
								)}
								disabled={option.value === currentStatus}
								onClick={() => handleStatusChange(option.value)}
							>
								{option.icon}
								<span>{option.label}</span>
								{option.value === currentStatus && (
									<Check className="ml-auto size-4 text-primary" />
								)}
							</DropdownMenuItem>
						</div>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Confirmation Dialog for destructive status changes */}
			<AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to change the status to "{pendingOption?.label}"?
							This action may have consequences and cannot be easily undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setPendingStatus(null)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={handleConfirmStatusChange}
						>
							Change Status
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

/**
 * StatusBadge - Non-interactive status display
 * Use when status changes are not allowed or for read-only views
 */
export function StatusBadge({
	entityType,
	status,
	size = "md",
	className,
}: {
	entityType: StatusEntityType;
	status: string;
	size?: "sm" | "md" | "lg";
	className?: string;
}) {
	const statusOptions = STATUS_CONFIGS[entityType] || [];
	const option = statusOptions.find((opt) => opt.value === status) || {
		value: status,
		label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
		variant: "outline" as const,
	};

	const sizeClasses = {
		sm: "text-xs px-2 py-0.5",
		md: "text-sm px-2.5 py-1",
		lg: "text-base px-3 py-1.5",
	};

	return (
		<Badge
			className={cn(
				"gap-1.5 font-medium",
				sizeClasses[size],
				className
			)}
			variant={option.variant === "success" || option.variant === "warning" ? "outline" : option.variant}
		>
			{option.icon}
			<span>{option.label}</span>
		</Badge>
	);
}
