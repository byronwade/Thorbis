"use client";

/**
 * Call Wrap-Up Dialog
 *
 * Shown when CSR clicks "End Call" to ensure proper call completion.
 * Requires:
 * - Call disposition (mandatory)
 * - Notes (mandatory if call > 2 minutes)
 * - Optional follow-up scheduling
 * - Optional email confirmation
 *
 * This prevents CSRs from ending calls without documenting the outcome.
 */

import {
	AlertTriangle,
	Calendar,
	CheckCircle2,
	Clock,
	FileText,
	Loader2,
	Mail,
	MessageSquare,
	Phone,
	PhoneOff,
	Plus,
	Send,
	X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type CallDisposition =
	| "resolved"
	| "callback_scheduled"
	| "escalated"
	| "voicemail_left"
	| "wrong_number"
	| "spam"
	| "customer_hung_up"
	| "transferred"
	| "appointment_booked"
	| "quote_provided"
	| "payment_taken"
	| "other";

type FollowUpType = "callback" | "email" | "sms" | "appointment";

type CallWrapUpData = {
	disposition: CallDisposition;
	notes: string;
	followUp: {
		enabled: boolean;
		type: FollowUpType;
		date?: Date;
		notes?: string;
	};
	sendConfirmation: boolean;
	createJob: boolean;
};

type CallWrapUpDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onComplete: (data: CallWrapUpData) => void;
	onCancel: () => void;
	callDuration: number; // in seconds
	customerName: string;
	customerEmail?: string;
	existingNotes?: string;
	isSubmitting?: boolean;
};

const dispositionOptions: Array<{
	value: CallDisposition;
	label: string;
	icon: React.ReactNode;
	color: string;
}> = [
	{
		value: "resolved",
		label: "Issue Resolved",
		icon: <CheckCircle2 className="h-4 w-4" />,
		color: "text-success",
	},
	{
		value: "appointment_booked",
		label: "Appointment Booked",
		icon: <Calendar className="h-4 w-4" />,
		color: "text-primary",
	},
	{
		value: "quote_provided",
		label: "Quote Provided",
		icon: <FileText className="h-4 w-4" />,
		color: "text-primary",
	},
	{
		value: "payment_taken",
		label: "Payment Taken",
		icon: <CheckCircle2 className="h-4 w-4" />,
		color: "text-success",
	},
	{
		value: "callback_scheduled",
		label: "Callback Scheduled",
		icon: <Phone className="h-4 w-4" />,
		color: "text-warning",
	},
	{
		value: "escalated",
		label: "Escalated to Manager",
		icon: <AlertTriangle className="h-4 w-4" />,
		color: "text-orange-500",
	},
	{
		value: "transferred",
		label: "Transferred",
		icon: <Phone className="h-4 w-4" />,
		color: "text-muted-foreground",
	},
	{
		value: "voicemail_left",
		label: "Left Voicemail",
		icon: <MessageSquare className="h-4 w-4" />,
		color: "text-muted-foreground",
	},
	{
		value: "customer_hung_up",
		label: "Customer Hung Up",
		icon: <PhoneOff className="h-4 w-4" />,
		color: "text-muted-foreground",
	},
	{
		value: "wrong_number",
		label: "Wrong Number",
		icon: <X className="h-4 w-4" />,
		color: "text-muted-foreground",
	},
	{
		value: "spam",
		label: "Spam/Unwanted",
		icon: <AlertTriangle className="h-4 w-4" />,
		color: "text-destructive",
	},
	{
		value: "other",
		label: "Other",
		icon: <FileText className="h-4 w-4" />,
		color: "text-muted-foreground",
	},
];

const followUpOptions: Array<{
	value: FollowUpType;
	label: string;
	icon: React.ReactNode;
}> = [
	{
		value: "callback",
		label: "Callback",
		icon: <Phone className="h-4 w-4" />,
	},
	{
		value: "email",
		label: "Email",
		icon: <Mail className="h-4 w-4" />,
	},
	{
		value: "sms",
		label: "SMS",
		icon: <MessageSquare className="h-4 w-4" />,
	},
	{
		value: "appointment",
		label: "Appointment",
		icon: <Calendar className="h-4 w-4" />,
	},
];

export function CallWrapUpDialog({
	open,
	onOpenChange,
	onComplete,
	onCancel,
	callDuration,
	customerName,
	customerEmail,
	existingNotes = "",
	isSubmitting = false,
}: CallWrapUpDialogProps) {
	// Form state
	const [disposition, setDisposition] = useState<CallDisposition | "">("");
	const [notes, setNotes] = useState(existingNotes);
	const [followUpEnabled, setFollowUpEnabled] = useState(false);
	const [followUpType, setFollowUpType] = useState<FollowUpType>("callback");
	const [sendConfirmation, setSendConfirmation] = useState(false);
	const [createJob, setCreateJob] = useState(false);

	// Validation
	const notesRequired = callDuration > 120; // 2 minutes
	const isValid =
		disposition !== "" && (!notesRequired || notes.trim().length > 0);

	// Format call duration
	const formatDuration = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Handle completion
	const handleComplete = useCallback(() => {
		if (!isValid || !disposition) return;

		onComplete({
			disposition,
			notes: notes.trim(),
			followUp: {
				enabled: followUpEnabled,
				type: followUpType,
			},
			sendConfirmation,
			createJob,
		});
	}, [
		isValid,
		disposition,
		notes,
		followUpEnabled,
		followUpType,
		sendConfirmation,
		createJob,
		onComplete,
	]);

	// Reset form when dialog opens
	useEffect(() => {
		if (open) {
			setDisposition("");
			setNotes(existingNotes);
			setFollowUpEnabled(false);
			setFollowUpType("callback");
			setSendConfirmation(false);
			setCreateJob(false);
		}
	}, [open, existingNotes]);

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!open) return;

			if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && isValid) {
				e.preventDefault();
				handleComplete();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, isValid, handleComplete]);

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<PhoneOff className="text-destructive h-5 w-5" />
						Wrap Up Call
					</DialogTitle>
					<DialogDescription className="flex items-center gap-4">
						<span>Complete this form before ending the call with</span>
						<Badge variant="outline">{customerName}</Badge>
					</DialogDescription>
				</DialogHeader>

				{/* Call Duration */}
				<div className="bg-muted/50 flex items-center justify-between rounded-lg border p-3">
					<div className="flex items-center gap-2">
						<Clock className="text-muted-foreground h-4 w-4" />
						<span className="text-sm font-medium">Call Duration</span>
					</div>
					<Badge variant="secondary" className="font-mono">
						{formatDuration(callDuration)}
					</Badge>
				</div>

				{/* Disposition (Required) */}
				<div className="space-y-2">
					<Label className="flex items-center gap-1">
						Call Disposition
						<span className="text-destructive">*</span>
					</Label>
					<Select
						value={disposition}
						onValueChange={(value) => setDisposition(value as CallDisposition)}
					>
						<SelectTrigger
							className={cn(
								!disposition && "border-destructive/50",
							)}
						>
							<SelectValue placeholder="Select outcome..." />
						</SelectTrigger>
						<SelectContent>
							{dispositionOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									<div className="flex items-center gap-2">
										<span className={option.color}>{option.icon}</span>
										<span>{option.label}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Notes */}
				<div className="space-y-2">
					<Label className="flex items-center gap-1">
						Call Notes
						{notesRequired && <span className="text-destructive">*</span>}
						{!notesRequired && (
							<span className="text-muted-foreground text-xs ml-1">
								(optional for short calls)
							</span>
						)}
					</Label>
					<Textarea
						className={cn(
							"min-h-[100px] resize-none",
							notesRequired && !notes.trim() && "border-destructive/50",
						)}
						placeholder="Summarize the call, customer's issue, and resolution..."
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
					/>
					{notesRequired && !notes.trim() && (
						<p className="text-destructive text-xs flex items-center gap-1">
							<AlertTriangle className="h-3 w-3" />
							Notes required for calls over 2 minutes
						</p>
					)}
				</div>

				{/* Follow-up Options */}
				<div className="space-y-3 rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Checkbox
								id="followUp"
								checked={followUpEnabled}
								onCheckedChange={(checked) =>
									setFollowUpEnabled(checked as boolean)
								}
							/>
							<Label
								htmlFor="followUp"
								className="text-sm font-medium cursor-pointer"
							>
								Schedule Follow-up
							</Label>
						</div>
						{followUpEnabled && (
							<Select
								value={followUpType}
								onValueChange={(value) =>
									setFollowUpType(value as FollowUpType)
								}
							>
								<SelectTrigger className="w-[140px] h-8">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{followUpOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div className="flex items-center gap-2">
												{option.icon}
												<span>{option.label}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</div>

					{/* Email Confirmation */}
					{customerEmail && (
						<div className="flex items-center gap-2">
							<Checkbox
								id="sendConfirmation"
								checked={sendConfirmation}
								onCheckedChange={(checked) =>
									setSendConfirmation(checked as boolean)
								}
							/>
							<Label
								htmlFor="sendConfirmation"
								className="text-sm cursor-pointer flex items-center gap-1"
							>
								<Mail className="h-3.5 w-3.5" />
								Send confirmation email
							</Label>
						</div>
					)}

					{/* Create Job */}
					<div className="flex items-center gap-2">
						<Checkbox
							id="createJob"
							checked={createJob}
							onCheckedChange={(checked) => setCreateJob(checked as boolean)}
						/>
						<Label
							htmlFor="createJob"
							className="text-sm cursor-pointer flex items-center gap-1"
						>
							<Plus className="h-3.5 w-3.5" />
							Create job from this call
						</Label>
					</div>
				</div>

				<DialogFooter className="gap-2 sm:gap-0">
					<Button
						variant="outline"
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Continue Call
					</Button>
					<Button
						variant="destructive"
						onClick={handleComplete}
						disabled={!isValid || isSubmitting}
						className="gap-2"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<PhoneOff className="h-4 w-4" />
								End Call
							</>
						)}
					</Button>
				</DialogFooter>

				{/* Keyboard hint */}
				<p className="text-muted-foreground text-center text-xs">
					Press{" "}
					<kbd className="bg-muted rounded px-1.5 py-0.5 font-mono">
						Ctrl+Enter
					</kbd>{" "}
					to complete
				</p>
			</DialogContent>
		</Dialog>
	);
}
