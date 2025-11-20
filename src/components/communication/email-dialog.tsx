/**
 * Email Dialog - Internal email composer
 *
 * Features:
 * - Rich text email composition
 * - Send emails through platform
 * - Creates communication records
 * - Shows send status
 */

"use client";

import { Mail, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { sendCustomerEmailAction } from "@/actions/communications";
import type { CommunicationRecord } from "@/components/communication/communication-page-client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StandardFormField } from "@/components/ui/standard-form-field";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type EmailDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	customerName: string;
	customerEmail: string;
	companyId: string;
	customerId?: string;
	jobId?: string;
	propertyId?: string;
	invoiceId?: string;
	estimateId?: string;
	defaultSubject?: string;
	defaultBody?: string;
	onCommunicationCreated?: (record: CommunicationRecord) => void;
};

export function EmailDialog({
	open,
	onOpenChange,
	customerName,
	customerEmail,
	companyId,
	customerId,
	jobId,
	propertyId,
	invoiceId,
	estimateId,
	defaultSubject = "",
	defaultBody = "",
	onCommunicationCreated,
}: EmailDialogProps) {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [subject, setSubject] = useState(defaultSubject);
	const [body, setBody] = useState(defaultBody);

	const handleSend = () => {
		if (!subject.trim()) {
			toast.error("Please enter a subject for the email");
			return;
		}

		if (!body.trim()) {
			toast.error("Please enter a message to send");
			return;
		}

		startTransition(async () => {
			const result = await sendCustomerEmailAction({
				to: customerEmail,
				subject,
				body,
				customerName,
				companyId,
				customerId,
				jobId,
				propertyId,
				invoiceId,
				estimateId,
			});

			if (result.success) {
				toast.success(`Email sent to ${customerName}`);
				setSubject("");
				setBody("");
				if (result.data) {
					onCommunicationCreated?.(result.data as CommunicationRecord);
				}
				onOpenChange(false);
			} else {
				toast.error(result.error || "Failed to send email");
			}
		});
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Mail className="size-5" />
						Send Email
					</DialogTitle>
					<DialogDescription>
						Compose and send an email to {customerName}
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
									{customerEmail}
								</div>
							</div>
						</div>
					</div>

					{/* Subject */}
					<StandardFormField label="Subject" htmlFor="email-subject">
						<Input
							id="email-subject"
							onChange={(e) => setSubject(e.target.value)}
							placeholder="Email subject"
							value={subject}
						/>
					</StandardFormField>

					{/* Message Body */}
					<StandardFormField label="Message" htmlFor="email-message">
						<Textarea
							id="email-message"
							className="min-h-[200px] resize-none"
							onChange={(e) => setBody(e.target.value)}
							placeholder="Type your message here..."
							value={body}
						/>
						<div className="text-muted-foreground text-xs">
							{body.length} characters
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
						disabled={isPending || !subject.trim() || !body.trim()}
						onClick={handleSend}
					>
						<Send className="mr-2 size-4" />
						Send Email
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
