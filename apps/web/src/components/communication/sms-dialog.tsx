/**
 * SMS Dialog - Internal SMS composer using Twilio
 *
 * Features:
 * - Send SMS messages via Twilio
 * - Character counter
 * - Creates communication records
 * - Shows send status
 */

"use client";

import { MessageSquare, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { sendTextMessage } from "@/actions/twilio";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { StandardFormField } from "@/components/ui/standard-form-field";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { CommunicationRecord, CompanyPhone } from "@/types/communication";

type SMSDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	customerName: string;
	customerPhone: string;
	companyId: string;
	customerId?: string;
	companyPhones?: CompanyPhone[];
	jobId?: string;
	propertyId?: string;
	invoiceId?: string;
	estimateId?: string;
	onCommunicationCreated?: (record: CommunicationRecord) => void;
};

export function SMSDialog({
	open,
	onOpenChange,
	customerName,
	customerPhone,
	customerId,
	companyId,
	companyPhones = [],
	jobId,
	propertyId,
	invoiceId,
	estimateId,
	onCommunicationCreated,
}: SMSDialogProps) {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [message, setMessage] = useState("");
	const [selectedPhone, setSelectedPhone] = useState(
		companyPhones[0]?.number || "",
	);

	// SMS segment calculation - no max limit, just show segment count for cost awareness
	const charCount = message.length;
	const SMS_SEGMENT_LENGTH = 160;
	const SMS_CONCAT_LENGTH = 153; // Concatenated messages use 153 chars per segment
	const segmentCount =
		charCount <= SMS_SEGMENT_LENGTH
			? charCount > 0
				? 1
				: 0
			: Math.ceil(charCount / SMS_CONCAT_LENGTH);

	const handleSend = () => {
		if (!message.trim()) {
			toast.error("Please enter a message to send");
			return;
		}

		if (!selectedPhone) {
			toast.error("Please select a company phone number to send from");
			return;
		}

		startTransition(async () => {
			const result = await sendTextMessage({
				to: customerPhone,
				from: selectedPhone,
				text: message,
				companyId,
				customerId,
				jobId,
				propertyId,
				invoiceId,
				estimateId,
			});

			if (result.success && "data" in result && result.data) {
				toast.success(`Text message sent to ${customerName}`);
				onCommunicationCreated?.(result.data as CommunicationRecord);
				setMessage("");
				onOpenChange(false);
			} else {
				toast.error(result.error || "Failed to send text message");
			}
		});
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<MessageSquare className="size-5" />
						Send Text Message
					</DialogTitle>
					<DialogDescription>
						Send an SMS message to {customerName}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Recipient Info */}
					<div className="bg-muted/50 rounded-lg border p-3">
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full text-sm font-semibold">
								{customerName
									.split(" ")
									.map((n) => n[0])
									.join("")
									.toUpperCase()}
							</div>
							<div className="min-w-0 flex-1">
								<div className="text-sm font-medium">{customerName}</div>
								<div className="text-muted-foreground text-xs">
									{customerPhone}
								</div>
							</div>
						</div>
					</div>

					{/* From Phone Selection */}
					{companyPhones.length > 0 ? (
						<StandardFormField label="Send From" htmlFor="sms-from">
							<Select onValueChange={setSelectedPhone} value={selectedPhone}>
								<SelectTrigger id="sms-from">
									<SelectValue placeholder="Select a phone number" />
								</SelectTrigger>
								<SelectContent>
									{companyPhones.map((phone) => (
										<SelectItem key={phone.id} value={phone.number}>
											{phone.label || phone.number}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</StandardFormField>
					) : (
						<div className="border-warning bg-warning dark:border-warning dark:bg-warning rounded-lg border p-4 text-center">
							<p className="text-warning dark:text-warning text-sm">
								No company phone numbers configured.
							</p>
							<p className="text-warning dark:text-warning mt-1 text-xs">
								Purchase or port a phone number from Settings → Phone Numbers
							</p>
						</div>
					)}

					{/* Message Input */}
					<StandardFormField label="Message" htmlFor="sms-message">
						<Textarea
							id="sms-message"
							className="min-h-[120px] resize-y"
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Type your message here..."
							value={message}
						/>
						<div className="text-muted-foreground flex items-center justify-between text-xs">
							<span>{charCount} characters</span>
							<span className={segmentCount > 1 ? "text-amber-500" : ""}>
								{segmentCount} SMS segment{segmentCount !== 1 ? "s" : ""}
							</span>
						</div>
					</StandardFormField>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end gap-2">
					<Button
						disabled={isPending}
						onClick={() => onOpenChange(false)}
						variant="outline"
					>
						Cancel
					</Button>
					<Button
						disabled={
							isPending ||
							!message.trim() ||
							!selectedPhone ||
							companyPhones.length === 0
						}
						onClick={handleSend}
					>
						<Send className="mr-2 size-4" />
						{companyPhones.length === 0 ? "No Phone Numbers" : "Send Message"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
