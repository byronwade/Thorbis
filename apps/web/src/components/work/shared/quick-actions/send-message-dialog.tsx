"use client";

/**
 * SendMessageDialog - Quick communication dialog for email/SMS
 *
 * Enables sending emails or SMS directly from detail pages with
 * pre-filled customer info and entity linking.
 */

import { Loader2, Mail, MessageSquare, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * Entity context for linking communications
 */
export type MessageEntityContext = {
	entityType: "job" | "invoice" | "estimate" | "contract" | "appointment" | "customer" | "property";
	entityId: string;
	entityLabel?: string; // e.g., "Invoice #1234"
};

/**
 * Customer/recipient info
 */
export type RecipientInfo = {
	id: string;
	name: string;
	email?: string | null;
	phone?: string | null;
};

/**
 * Email template options
 */
export type EmailTemplate = {
	id: string;
	name: string;
	subject: string;
	body: string;
};

/**
 * Default email templates
 */
const DEFAULT_TEMPLATES: EmailTemplate[] = [
	{
		id: "custom",
		name: "Custom Message",
		subject: "",
		body: "",
	},
	{
		id: "follow-up",
		name: "Follow Up",
		subject: "Following up on your recent service",
		body: "Hi {customer_name},\n\nI wanted to follow up on your recent service with us. Please let me know if you have any questions or concerns.\n\nBest regards",
	},
	{
		id: "reminder",
		name: "Appointment Reminder",
		subject: "Reminder: Upcoming Appointment",
		body: "Hi {customer_name},\n\nThis is a friendly reminder about your upcoming appointment. Please let us know if you need to reschedule.\n\nSee you soon!",
	},
	{
		id: "thank-you",
		name: "Thank You",
		subject: "Thank you for your business!",
		body: "Hi {customer_name},\n\nThank you for choosing our services. We truly appreciate your business!\n\nIf you have any questions or need assistance in the future, please don't hesitate to reach out.\n\nBest regards",
	},
];

type SendMessageDialogProps = {
	/** Recipient information */
	recipient: RecipientInfo;
	/** Entity context for linking */
	entityContext?: MessageEntityContext;
	/** Server action to send email */
	onSendEmail?: (data: {
		to: string;
		subject: string;
		body: string;
		entityContext?: MessageEntityContext;
	}) => Promise<{ success: boolean; error?: string }>;
	/** Server action to send SMS */
	onSendSms?: (data: {
		to: string;
		message: string;
		entityContext?: MessageEntityContext;
	}) => Promise<{ success: boolean; error?: string }>;
	/** Custom email templates */
	templates?: EmailTemplate[];
	/** Trigger button variant */
	triggerVariant?: "default" | "outline" | "ghost" | "secondary";
	/** Trigger button size */
	triggerSize?: "sm" | "default" | "lg" | "icon";
	/** Trigger button text (optional, shows icon only if not provided) */
	triggerText?: string;
	/** Additional className for trigger */
	className?: string;
	/** Disable the dialog */
	disabled?: boolean;
};

export function SendMessageDialog({
	recipient,
	entityContext,
	onSendEmail,
	onSendSms,
	templates = DEFAULT_TEMPLATES,
	triggerVariant = "outline",
	triggerSize = "sm",
	triggerText,
	className,
	disabled = false,
}: SendMessageDialogProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"email" | "sms">(
		recipient.email ? "email" : recipient.phone ? "sms" : "email"
	);

	// Email state
	const [selectedTemplate, setSelectedTemplate] = useState<string>("custom");
	const [emailSubject, setEmailSubject] = useState("");
	const [emailBody, setEmailBody] = useState("");
	const [emailTo, setEmailTo] = useState(recipient.email || "");

	// SMS state
	const [smsMessage, setSmsMessage] = useState("");
	const [smsTo, setSmsTo] = useState(recipient.phone || "");

	const canSendEmail = !!onSendEmail && !!recipient.email;
	const canSendSms = !!onSendSms && !!recipient.phone;

	const handleTemplateChange = (templateId: string) => {
		setSelectedTemplate(templateId);
		const template = templates.find((t) => t.id === templateId);
		if (template) {
			// Replace placeholders with actual values
			const subject = template.subject.replace("{customer_name}", recipient.name);
			const body = template.body.replace(/{customer_name}/g, recipient.name);
			setEmailSubject(subject);
			setEmailBody(body);
		}
	};

	const handleSendEmail = () => {
		if (!onSendEmail || !emailTo || !emailSubject || !emailBody) {
			toast.error("Please fill in all email fields");
			return;
		}

		startTransition(async () => {
			try {
				const result = await onSendEmail({
					to: emailTo,
					subject: emailSubject,
					body: emailBody,
					entityContext,
				});

				if (result.success) {
					toast.success("Email sent successfully");
					setIsOpen(false);
					resetForm();
					router.refresh();
				} else {
					toast.error(result.error || "Failed to send email");
				}
			} catch (error) {
				toast.error("An error occurred while sending email");
				console.error("Email send error:", error);
			}
		});
	};

	const handleSendSms = () => {
		if (!onSendSms || !smsTo || !smsMessage) {
			toast.error("Please fill in all SMS fields");
			return;
		}

		startTransition(async () => {
			try {
				const result = await onSendSms({
					to: smsTo,
					message: smsMessage,
					entityContext,
				});

				if (result.success) {
					toast.success("SMS sent successfully");
					setIsOpen(false);
					resetForm();
					router.refresh();
				} else {
					toast.error(result.error || "Failed to send SMS");
				}
			} catch (error) {
				toast.error("An error occurred while sending SMS");
				console.error("SMS send error:", error);
			}
		});
	};

	const resetForm = () => {
		setSelectedTemplate("custom");
		setEmailSubject("");
		setEmailBody("");
		setSmsMessage("");
	};

	// Only show if we can send at least one type of message
	if (!canSendEmail && !canSendSms) {
		return null;
	}

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>
				<Button
					className={cn("gap-1.5", className)}
					disabled={disabled}
					size={triggerSize}
					variant={triggerVariant}
				>
					<Mail className="size-4" />
					{triggerText && <span>{triggerText}</span>}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Send Message to {recipient.name}</DialogTitle>
					<DialogDescription>
						{entityContext?.entityLabel
							? `Linked to ${entityContext.entityLabel}`
							: "Send an email or SMS to the customer"}
					</DialogDescription>
				</DialogHeader>

				<Tabs
					className="w-full"
					onValueChange={(v) => setActiveTab(v as "email" | "sms")}
					value={activeTab}
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger disabled={!canSendEmail} value="email">
							<Mail className="mr-2 size-4" />
							Email
						</TabsTrigger>
						<TabsTrigger disabled={!canSendSms} value="sms">
							<MessageSquare className="mr-2 size-4" />
							SMS
						</TabsTrigger>
					</TabsList>

					<TabsContent className="mt-4 space-y-4" value="email">
						<div className="space-y-2">
							<Label htmlFor="email-to">To</Label>
							<Input
								id="email-to"
								onChange={(e) => setEmailTo(e.target.value)}
								placeholder="customer@email.com"
								type="email"
								value={emailTo}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="template">Template</Label>
							<Select onValueChange={handleTemplateChange} value={selectedTemplate}>
								<SelectTrigger>
									<SelectValue placeholder="Select a template" />
								</SelectTrigger>
								<SelectContent>
									{templates.map((template) => (
										<SelectItem key={template.id} value={template.id}>
											{template.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subject">Subject</Label>
							<Input
								id="subject"
								onChange={(e) => setEmailSubject(e.target.value)}
								placeholder="Enter email subject"
								value={emailSubject}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="body">Message</Label>
							<Textarea
								className="min-h-[150px]"
								id="body"
								onChange={(e) => setEmailBody(e.target.value)}
								placeholder="Write your message..."
								value={emailBody}
							/>
						</div>
					</TabsContent>

					<TabsContent className="mt-4 space-y-4" value="sms">
						<div className="space-y-2">
							<Label htmlFor="sms-to">Phone Number</Label>
							<Input
								id="sms-to"
								onChange={(e) => setSmsTo(e.target.value)}
								placeholder="+1 (555) 123-4567"
								type="tel"
								value={smsTo}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="sms-message">Message</Label>
							<Textarea
								className="min-h-[100px]"
								id="sms-message"
								maxLength={160}
								onChange={(e) => setSmsMessage(e.target.value)}
								placeholder="Write your SMS message..."
								value={smsMessage}
							/>
							<p className="text-muted-foreground text-xs">
								{smsMessage.length}/160 characters
							</p>
						</div>
					</TabsContent>
				</Tabs>

				<DialogFooter>
					<Button
						onClick={() => setIsOpen(false)}
						type="button"
						variant="outline"
					>
						Cancel
					</Button>
					<Button
						disabled={isPending}
						onClick={activeTab === "email" ? handleSendEmail : handleSendSms}
						type="button"
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Sending...
							</>
						) : (
							<>
								<Send className="mr-2 size-4" />
								Send {activeTab === "email" ? "Email" : "SMS"}
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/**
 * QuickEmailButton - Simplified email button that opens compose in new tab
 */
export function QuickEmailButton({
	email,
	subject,
	body,
	className,
	size = "sm",
}: {
	email: string;
	subject?: string;
	body?: string;
	className?: string;
	size?: "sm" | "default" | "lg" | "icon";
}) {
	const handleClick = () => {
		const mailtoUrl = new URL(`mailto:${email}`);
		if (subject) mailtoUrl.searchParams.set("subject", subject);
		if (body) mailtoUrl.searchParams.set("body", body);
		window.open(mailtoUrl.toString(), "_blank");
	};

	return (
		<Button
			className={cn("gap-1.5", className)}
			onClick={handleClick}
			size={size}
			variant="outline"
		>
			<Mail className="size-4" />
			<span className="hidden sm:inline">Email</span>
		</Button>
	);
}

/**
 * QuickSmsButton - Simplified SMS button that opens phone app
 */
export function QuickSmsButton({
	phone,
	message,
	className,
	size = "sm",
}: {
	phone: string;
	message?: string;
	className?: string;
	size?: "sm" | "default" | "lg" | "icon";
}) {
	const handleClick = () => {
		const smsUrl = message ? `sms:${phone}?body=${encodeURIComponent(message)}` : `sms:${phone}`;
		window.open(smsUrl);
	};

	return (
		<Button
			className={cn("gap-1.5", className)}
			onClick={handleClick}
			size={size}
			variant="outline"
		>
			<MessageSquare className="size-4" />
			<span className="hidden sm:inline">SMS</span>
		</Button>
	);
}
