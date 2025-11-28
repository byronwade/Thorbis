"use client";

/**
 * SMS Quick Replies Bar
 *
 * Compact horizontal scrollable bar of quick SMS reply buttons for the call window.
 * Allows CSRs to quickly send predefined messages during calls.
 *
 * Features:
 * - Horizontal scroll with fade edges
 * - One-click to preview, double-click to send
 * - Smart template filling with customer context
 * - Compact design for call window integration
 */

import { Check, Loader2, MessageSquare, Send, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Template context for smart filling
type TemplateContext = {
	customerFirstName?: string;
	customerName?: string;
	companyName?: string;
	companyPhone?: string;
	technicianName?: string;
	appointmentDate?: string;
	appointmentTime?: string;
	invoiceNumber?: string;
	amount?: string;
};

// Quick reply template definition
type QuickReplyTemplate = {
	id: string;
	label: string;
	shortLabel: string;
	icon: "clock" | "truck" | "check" | "dollar" | "calendar" | "heart" | "alert";
	preview: string;
	build: (ctx: TemplateContext) => string;
};

// Predefined quick reply templates optimized for call window use
const CALL_QUICK_REPLIES: QuickReplyTemplate[] = [
	{
		id: "on-the-way",
		label: "On The Way",
		shortLabel: "OTW",
		icon: "truck",
		preview: "Tech en route notification",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			const tech = ctx.technicianName || "Our technician";
			return `Hi ${name}, ${tech} is on the way and should arrive shortly.`;
		},
	},
	{
		id: "running-late",
		label: "Running Late",
		shortLabel: "Late",
		icon: "clock",
		preview: "Delay notification",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			return `Hi ${name}, we apologize but our technician is running a bit behind schedule. We'll update you when they're on the way.`;
		},
	},
	{
		id: "confirm-appointment",
		label: "Confirm Appt",
		shortLabel: "Confirm",
		icon: "calendar",
		preview: "Appointment confirmation",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			const dateTime =
				ctx.appointmentDate && ctx.appointmentTime
					? `for ${ctx.appointmentDate} at ${ctx.appointmentTime}`
					: "for your scheduled time";
			return `Hi ${name}, this is a confirmation of your appointment ${dateTime}. Reply YES to confirm.`;
		},
	},
	{
		id: "job-complete",
		label: "Job Complete",
		shortLabel: "Done",
		icon: "check",
		preview: "Work completed",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			const company = ctx.companyName
				? `choosing ${ctx.companyName}`
				: "your business";
			return `Hi ${name}, the work has been completed. Thank you for ${company}!`;
		},
	},
	{
		id: "payment-link",
		label: "Payment Link",
		shortLabel: "Pay",
		icon: "dollar",
		preview: "Send payment reminder",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			const amountInfo = ctx.amount ? ` for $${ctx.amount}` : "";
			return `Hi ${name}, your invoice${amountInfo} is ready. Pay securely here: [PAYMENT_LINK]`;
		},
	},
	{
		id: "thank-you",
		label: "Thank You",
		shortLabel: "Thanks",
		icon: "heart",
		preview: "Thank you message",
		build: (ctx) => {
			const company = ctx.companyName
				? `choosing ${ctx.companyName}`
				: "your business";
			return `Thank you for ${company}! We appreciate your trust in us.`;
		},
	},
];

// Icon mapping
const iconMap = {
	clock: "⏱️",
	truck: "🚚",
	check: "✅",
	dollar: "💵",
	calendar: "📅",
	heart: "❤️",
	alert: "⚠️",
};

type SmsQuickRepliesBarProps = {
	customerPhone?: string;
	customerFirstName?: string;
	customerName?: string;
	companyName?: string;
	companyPhone?: string;
	technicianName?: string;
	appointmentDate?: string;
	appointmentTime?: string;
	invoiceNumber?: string;
	amount?: string;
	onSendSms?: (message: string, phoneNumber: string) => Promise<void>;
	disabled?: boolean;
	className?: string;
};

export function SmsQuickRepliesBar({
	customerPhone,
	customerFirstName,
	customerName,
	companyName,
	companyPhone,
	technicianName,
	appointmentDate,
	appointmentTime,
	invoiceNumber,
	amount,
	onSendSms,
	disabled = false,
	className,
}: SmsQuickRepliesBarProps) {
	const [selectedTemplate, setSelectedTemplate] =
		useState<QuickReplyTemplate | null>(null);
	const [editedMessage, setEditedMessage] = useState("");
	const [sending, setSending] = useState(false);
	const [lastSent, setLastSent] = useState<string | null>(null);

	// Build template context from props
	const templateContext: TemplateContext = {
		customerFirstName: customerFirstName || customerName?.split(" ")[0],
		customerName,
		companyName,
		companyPhone,
		technicianName,
		appointmentDate,
		appointmentTime,
		invoiceNumber,
		amount,
	};

	// Handle template selection - opens preview dialog
	const handleTemplateClick = useCallback(
		(template: QuickReplyTemplate) => {
			const message = template.build(templateContext);
			setSelectedTemplate(template);
			setEditedMessage(message);
		},
		[templateContext],
	);

	// Handle send
	const handleSend = useCallback(async () => {
		if (!editedMessage.trim() || !customerPhone || !onSendSms) return;

		setSending(true);
		try {
			await onSendSms(editedMessage, customerPhone);
			setLastSent(selectedTemplate?.id || null);
			setSelectedTemplate(null);
			setEditedMessage("");

			// Clear success indicator after 3 seconds
			setTimeout(() => setLastSent(null), 3000);
		} catch (error) {
			console.error("Failed to send SMS:", error);
		} finally {
			setSending(false);
		}
	}, [editedMessage, customerPhone, onSendSms, selectedTemplate]);

	// Close dialog
	const handleClose = useCallback(() => {
		setSelectedTemplate(null);
		setEditedMessage("");
	}, []);

	if (!customerPhone) {
		return null;
	}

	return (
		<TooltipProvider>
			<div className={cn("space-y-2", className)}>
				{/* Header */}
				<div className="flex items-center justify-between">
					<h4 className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
						<MessageSquare className="h-3 w-3" />
						Quick SMS
					</h4>
					<span className="text-muted-foreground/60 text-[10px]">
						Click to preview
					</span>
				</div>

				{/* Scrollable Quick Reply Buttons */}
				<ScrollArea className="w-full whitespace-nowrap">
					<div className="flex gap-1.5 pb-2">
						{CALL_QUICK_REPLIES.map((template) => {
							const isJustSent = lastSent === template.id;

							return (
								<Tooltip key={template.id}>
									<TooltipTrigger asChild>
										<Button
											variant={isJustSent ? "default" : "outline"}
											size="sm"
											className={cn(
												"h-8 shrink-0 gap-1.5 px-3 text-xs transition-all",
												isJustSent && "bg-green-500 hover:bg-green-500",
											)}
											onClick={() => handleTemplateClick(template)}
											disabled={disabled || sending}
										>
											<span className="text-sm">
												{isJustSent ? "✓" : iconMap[template.icon]}
											</span>
											<span>{template.shortLabel}</span>
										</Button>
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p className="font-medium">{template.label}</p>
										<p className="text-muted-foreground text-xs">
											{template.preview}
										</p>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
					<ScrollBar orientation="horizontal" className="h-1.5" />
				</ScrollArea>

				{/* Preview/Edit Dialog */}
				<Dialog open={!!selectedTemplate} onOpenChange={handleClose}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<span className="text-lg">
									{selectedTemplate ? iconMap[selectedTemplate.icon] : ""}
								</span>
								{selectedTemplate?.label}
							</DialogTitle>
							<DialogDescription>
								Review and edit the message before sending
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4">
							{/* Recipient */}
							<div className="flex items-center gap-2">
								<Badge variant="secondary" className="text-xs">
									To: {customerName || customerPhone}
								</Badge>
								<span className="text-muted-foreground text-xs">
									{customerPhone}
								</span>
							</div>

							{/* Editable Message */}
							<Textarea
								value={editedMessage}
								onChange={(e) => setEditedMessage(e.target.value)}
								rows={4}
								className="resize-none"
								placeholder="Type your message..."
							/>

							{/* Character count */}
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-xs">
									{editedMessage.length} characters
								</span>
								<span
									className={cn(
										"text-xs",
										editedMessage.length > 160
											? "text-amber-500"
											: "text-muted-foreground",
									)}
								>
									{Math.ceil(editedMessage.length / 160) || 1} SMS segment
									{editedMessage.length > 160 ? "s" : ""}
								</span>
							</div>
						</div>

						<DialogFooter className="gap-2 sm:gap-0">
							<Button variant="outline" onClick={handleClose}>
								<X className="mr-2 h-4 w-4" />
								Cancel
							</Button>
							<Button
								onClick={handleSend}
								disabled={!editedMessage.trim() || sending}
							>
								{sending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Sending...
									</>
								) : (
									<>
										<Send className="mr-2 h-4 w-4" />
										Send SMS
									</>
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</TooltipProvider>
	);
}

/**
 * Compact inline version for tighter spaces
 */
type InlineQuickRepliesProps = {
	customerPhone?: string;
	templateContext?: TemplateContext;
	onSelectTemplate?: (message: string) => void;
	disabled?: boolean;
	className?: string;
};

function InlineQuickReplies({
	customerPhone,
	templateContext = {},
	onSelectTemplate,
	disabled = false,
	className,
}: InlineQuickRepliesProps) {
	if (!customerPhone) return null;

	return (
		<div className={cn("flex flex-wrap gap-1", className)}>
			{CALL_QUICK_REPLIES.slice(0, 4).map((template) => (
				<button
					key={template.id}
					type="button"
					className={cn(
						"inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium transition-colors",
						"bg-muted hover:bg-muted/80 text-foreground",
						disabled && "cursor-not-allowed opacity-50",
					)}
					onClick={() => onSelectTemplate?.(template.build(templateContext))}
					disabled={disabled}
					title={template.preview}
				>
					<span>{iconMap[template.icon]}</span>
					{template.shortLabel}
				</button>
			))}
		</div>
	);
}

// Export templates for use in other components
{ CALL_QUICK_REPLIES };
export type { QuickReplyTemplate, TemplateContext };
