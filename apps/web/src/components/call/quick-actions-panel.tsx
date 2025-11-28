"use client";

/**
 * Quick Actions Panel
 *
 * CSR-specific quick actions for the call window.
 * All actions open as slide-over panels with customer data pre-filled.
 *
 * Actions:
 * - New Job (J)
 * - Schedule Appointment (A)
 * - Send SMS (S)
 * - Send Email (E)
 * - Take Payment
 * - Add Note (N)
 *
 * Each action shows keyboard shortcut hint.
 */

import {
	Briefcase,
	Calendar,
	CreditCard,
	FileText,
	Mail,
	MessageSquare,
	Plus,
	Send,
	Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type QuickAction = {
	id: string;
	label: string;
	shortLabel?: string;
	icon: React.ReactNode;
	shortcut?: string;
	variant?: "default" | "secondary" | "outline" | "ghost";
	onClick: () => void;
	disabled?: boolean;
	badge?: string;
	description?: string;
};

type QuickActionsPanelProps = {
	onCreateJob: () => void;
	onScheduleAppointment: () => void;
	onSendSMS: () => void;
	onSendEmail: () => void;
	onTakePayment?: () => void;
	onAddNote: () => void;
	onAISuggestion?: () => void;
	customerEmail?: string;
	customerPhone?: string;
	hasOutstandingBalance?: boolean;
	outstandingAmount?: number;
	className?: string;
	layout?: "horizontal" | "vertical" | "grid";
};

export function QuickActionsPanel({
	onCreateJob,
	onScheduleAppointment,
	onSendSMS,
	onSendEmail,
	onTakePayment,
	onAddNote,
	onAISuggestion,
	customerEmail,
	customerPhone,
	hasOutstandingBalance,
	outstandingAmount,
	className,
	layout = "grid",
}: QuickActionsPanelProps) {
	const actions: QuickAction[] = [
		{
			id: "job",
			label: "New Job",
			shortLabel: "Job",
			icon: <Briefcase className="h-4 w-4" />,
			shortcut: "J",
			variant: "default",
			onClick: onCreateJob,
			description: "Create a new job for this customer",
		},
		{
			id: "appointment",
			label: "Schedule",
			icon: <Calendar className="h-4 w-4" />,
			shortcut: "A",
			variant: "outline",
			onClick: onScheduleAppointment,
			description: "Schedule an appointment",
		},
		{
			id: "sms",
			label: "SMS",
			icon: <MessageSquare className="h-4 w-4" />,
			shortcut: "S",
			variant: "outline",
			onClick: onSendSMS,
			disabled: !customerPhone,
			description: customerPhone
				? "Send SMS to customer"
				: "No phone number available",
		},
		{
			id: "email",
			label: "Email",
			icon: <Mail className="h-4 w-4" />,
			shortcut: "E",
			variant: "outline",
			onClick: onSendEmail,
			disabled: !customerEmail,
			description: customerEmail
				? "Send email to customer"
				: "No email address available",
		},
		{
			id: "note",
			label: "Note",
			icon: <FileText className="h-4 w-4" />,
			shortcut: "N",
			variant: "outline",
			onClick: onAddNote,
			description: "Add a note to this call",
		},
	];

	// Add payment action if available and has outstanding balance
	if (onTakePayment && hasOutstandingBalance) {
		actions.push({
			id: "payment",
			label: "Payment",
			icon: <CreditCard className="h-4 w-4" />,
			variant: "secondary",
			onClick: onTakePayment,
			badge: outstandingAmount
				? `$${outstandingAmount.toLocaleString()}`
				: "Due",
			description: "Take payment for outstanding balance",
		});
	}

	const layoutClasses = {
		horizontal: "flex flex-wrap items-center gap-2",
		vertical: "flex flex-col gap-2",
		grid: "grid grid-cols-3 gap-2",
	};

	return (
		<TooltipProvider delayDuration={300}>
			<div className={cn("space-y-3", className)}>
				{/* Header */}
				<div className="flex items-center justify-between">
					<h4 className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
						<Plus className="h-3 w-3" />
						Quick Actions
					</h4>
					{onAISuggestion && (
						<Button
							className="h-6 gap-1 px-2 text-xs"
							onClick={onAISuggestion}
							size="sm"
							variant="ghost"
						>
							<Sparkles className="h-3 w-3" />
							AI Suggest
						</Button>
					)}
				</div>

				{/* Actions */}
				<div className={layoutClasses[layout]}>
					{actions.map((action) => (
						<Tooltip key={action.id}>
							<TooltipTrigger asChild>
								<Button
									className={cn(
										"relative h-10 gap-2 text-sm",
										layout === "grid" && "w-full flex-col h-auto py-3",
										layout === "vertical" && "w-full justify-start",
									)}
									disabled={action.disabled}
									onClick={action.onClick}
									size="sm"
									variant={action.variant || "outline"}
								>
									{action.icon}
									<span className={cn(layout === "grid" && "text-xs")}>
										{layout === "horizontal"
											? action.shortLabel || action.label
											: action.label}
									</span>
									{action.badge && (
										<Badge
											className="absolute -top-1 -right-1 h-5 px-1.5 text-[10px]"
											variant="destructive"
										>
											{action.badge}
										</Badge>
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>{action.description || action.label}</p>
								{action.shortcut && (
									<p className="text-muted-foreground text-xs">
										Press {action.shortcut}
									</p>
								)}
							</TooltipContent>
						</Tooltip>
					))}
				</div>

				{/* Keyboard hint */}
				<p className="text-muted-foreground/60 text-center text-[10px]">
					Press ? to see all shortcuts
				</p>
			</div>
		</TooltipProvider>
	);
}

/**
 * Compact Quick Actions Bar
 *
 * Horizontal bar version for tight spaces
 */
type QuickActionsBarProps = Omit<
	QuickActionsPanelProps,
	"layout" | "className"
> & {
	className?: string;
};

function QuickActionsBar(props: QuickActionsBarProps) {
	return <QuickActionsPanel {...props} layout="horizontal" />;
}

/**
 * Floating Quick Actions
 *
 * Positioned absolutely for overlay use
 */
type FloatingQuickActionsProps = QuickActionsPanelProps & {
	position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
};

function FloatingQuickActions({
	position = "bottom-right",
	className,
	...props
}: FloatingQuickActionsProps) {
	const positionClasses = {
		"bottom-left": "bottom-4 left-4",
		"bottom-right": "bottom-4 right-4",
		"top-left": "top-4 left-4",
		"top-right": "top-4 right-4",
	};

	return (
		<div
			className={cn(
				"bg-card/95 fixed z-50 rounded-xl border p-4 shadow-lg backdrop-blur-sm",
				positionClasses[position],
				className,
			)}
		>
			<QuickActionsPanel {...props} layout="vertical" />
		</div>
	);
}
