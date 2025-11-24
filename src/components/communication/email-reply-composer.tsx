"use client";

import { sendCustomerEmailAction } from "@/actions/communications";
import type { CompanyEmail } from "@/actions/email-actions";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
	Bold,
	Calendar,
	ChevronDown,
	ChevronUp,
	Clock,
	ImageIcon,
	Italic,
	Link as LinkIcon,
	List,
	ListOrdered,
	Loader2,
	MoreHorizontal,
	Paperclip,
	Send,
	Sparkles,
	Trash2,
	Underline,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
	extractFullEmailAddress,
	normalizeEmailAddressList,
} from "@/lib/email/address-utils";
import { cn } from "@/lib/utils";
import {
	RecipientAutocomplete,
	type Recipient,
} from "@/components/communication/recipient-autocomplete";

export type EmailReplyMode = "reply" | "reply-all" | "forward";

type EmailAttachment = {
	filename: string;
	content: string; // Base64 encoded
	contentType?: string;
	size: number;
};

const templateDefinitions = [
	{
		id: "follow-up",
		label: "Friendly follow-up",
		body: "Hi there,\n\nJust checking in — let me know if you have any questions or if you'd like to see anything else from my side.\n\nBest,",
	},
	{
		id: "thank-you",
		label: "Thank you note",
		body: "Hi there,\n\nThanks again for your patience while we sorted this out. Let me know if there's anything else I can help with.\n\nWarm regards,",
	},
	{
		id: "next-steps",
		label: "Outline next steps",
		body: "Hi there,\n\nI've outlined the next steps:\n1. Review the details above.\n2. Confirm when you'd like to move forward.\n3. I'll lock everything in once you reply.\n\nLet me know if you want to adjust anything.",
	},
];

const signatureOptions = [
	{ id: "none", label: "No signature", value: "" },
	{ id: "support", label: "Thorbis Support", value: "\n\nThanks,\nThorbis Support Team" },
	{ id: "tech", label: "Technical Lead", value: "\n\nBest regards,\nJordan – Technical Lead" },
];

interface EmailReplyComposerProps {
	mode: EmailReplyMode;
	selectedEmail: CompanyEmail | null;
	companyId: string | null;
	onClose: () => void;
	onSent?: (record: Record<string, unknown>) => void;
	className?: string;
}

export function EmailReplyComposer({
	mode,
	selectedEmail,
	companyId,
	onClose,
	onSent,
	className,
}: EmailReplyComposerProps) {
	const { toast: toastApi } = useToast();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [body, setBody] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [signatureId, setSignatureId] = useState("support");
	const [showQuote, setShowQuote] = useState(false);
	const [recipients, setRecipients] = useState<Recipient[]>([]);
	const [ccRecipients, setCcRecipients] = useState<Recipient[]>([]);
	const [bccRecipients, setBccRecipients] = useState<Recipient[]>([]);
	const [showCc, setShowCc] = useState(false);
	const [showBcc, setShowBcc] = useState(false);
	const [subject, setSubject] = useState("");
	const [attachments, setAttachments] = useState<EmailAttachment[]>([]);

	// Schedule send state
	const [scheduleOpen, setScheduleOpen] = useState(false);
	const [scheduledDate, setScheduledDate] = useState<string>("");
	const [scheduledTime, setScheduledTime] = useState<string>("");

	// Undo send state - 5 second delay before actually sending
	const UNDO_SEND_DELAY = 5000; // 5 seconds
	const [isPendingSend, setIsPendingSend] = useState(false);
	const [undoCountdown, setUndoCountdown] = useState(5);
	const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const pendingEmailDataRef = useRef<{
		to: string[];
		subject: string;
		body: string;
		customerName: string;
		companyId: string;
		customerId?: string;
		cc?: string[];
		bcc?: string[];
		attachments?: { filename: string; content: string; contentType?: string }[];
	} | null>(null);

	const signature = useMemo(
		() => signatureOptions.find((opt) => opt.id === signatureId) ?? signatureOptions[0],
		[signatureId],
	);

	// Build all thread recipients (for suggestions)
	const threadRecipients = useMemo<Recipient[]>(() => {
		if (!selectedEmail) return [];

		const all: Recipient[] = [];
		const seen = new Set<string>();

		const add = (email: string, name?: string, type: Recipient["type"] = "custom") => {
			const lower = email.toLowerCase();
			if (email && email !== "Unknown" && !seen.has(lower)) {
				seen.add(lower);
				all.push({
					id: `thread-${email}`,
					type,
					name: name || email,
					email,
				});
			}
		};

		// From address
		const fromAddress = extractFullEmailAddress(
			selectedEmail.from_address,
			selectedEmail.provider_metadata,
			"from",
		);
		add(
			fromAddress,
			selectedEmail.customer?.display_name || selectedEmail.from_name || fromAddress,
			selectedEmail.customer_id ? "customer" : "custom"
		);

		// To addresses
		const toAddresses = normalizeEmailAddressList(selectedEmail.to_address);
		toAddresses.forEach((addr) => add(addr));

		// CC addresses if available
		if (selectedEmail.cc_address) {
			const ccAddresses = normalizeEmailAddressList(selectedEmail.cc_address);
			ccAddresses.forEach((addr) => add(addr));
		}

		return all;
	}, [selectedEmail]);

	// Build default subject and initial recipients based on mode
	useEffect(() => {
		if (!selectedEmail) return;

		// Subject
		const base = selectedEmail.subject?.trim() || "No subject";
		const prefix = mode === "forward" ? "Fwd:" : "Re:";
		const newSubject = base.toLowerCase().startsWith(prefix.toLowerCase())
			? base
			: `${prefix} ${base}`;
		setSubject(newSubject);

		// Recipients - based on reply mode
		const fromAddress = extractFullEmailAddress(
			selectedEmail.from_address,
			selectedEmail.provider_metadata,
			"from",
		);
		const toAddresses = normalizeEmailAddressList(selectedEmail.to_address);
		const recipientMap = new Map<string, Recipient>();

		const addRecipient = (email: string, name?: string, type: Recipient["type"] = "custom") => {
			if (email && email !== "Unknown" && !recipientMap.has(email.toLowerCase())) {
				recipientMap.set(email.toLowerCase(), {
					id: `initial-${email}`,
					type,
					name: name || email,
					email,
				});
			}
		};

		if (mode === "reply") {
			// Reply: only to sender
			addRecipient(
				fromAddress,
				selectedEmail.customer?.display_name || selectedEmail.from_name || fromAddress,
				selectedEmail.customer_id ? "customer" : "custom"
			);
		} else if (mode === "reply-all") {
			// Reply All: sender + all To + all CC
			addRecipient(
				fromAddress,
				selectedEmail.customer?.display_name || selectedEmail.from_name || fromAddress,
				selectedEmail.customer_id ? "customer" : "custom"
			);
			toAddresses.forEach((addr) => addRecipient(addr));
			if (selectedEmail.cc_address) {
				const ccAddresses = normalizeEmailAddressList(selectedEmail.cc_address);
				ccAddresses.forEach((addr) => addRecipient(addr));
			}
		}
		// Forward: no initial recipients

		setRecipients(Array.from(recipientMap.values()));
	}, [mode, selectedEmail]);

	// Auto-resize textarea
	const handleInput = useCallback(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
		}
	}, []);

	useEffect(() => {
		handleInput();
	}, [body, handleInput]);

	// Focus textarea on mount
	useEffect(() => {
		setTimeout(() => textareaRef.current?.focus(), 100);
	}, []);

	const applyTemplate = (templateId: string) => {
		const template = templateDefinitions.find((t) => t.id === templateId);
		if (template) {
			setBody(template.body);
		}
	};

	// Actually send the email (called after undo timeout expires)
	const executeSend = useCallback(async () => {
		const emailData = pendingEmailDataRef.current;
		if (!emailData) return;

		setIsSending(true);
		setIsPendingSend(false);

		try {
			const result = await sendCustomerEmailAction(emailData);

			if (result.success) {
				toastApi.success("Email sent successfully");
				onSent?.(result.data ?? {});
				onClose();
			} else {
				toastApi.error(result.error || "Failed to send");
			}
		} catch (error) {
			console.error("Send failed:", error);
			toastApi.error(error instanceof Error ? error.message : "Failed to send");
		} finally {
			setIsSending(false);
			pendingEmailDataRef.current = null;
		}
	}, [toastApi, onSent, onClose]);

	// Cancel the pending send
	const cancelSend = useCallback(() => {
		if (sendTimeoutRef.current) {
			clearTimeout(sendTimeoutRef.current);
			sendTimeoutRef.current = null;
		}
		if (countdownIntervalRef.current) {
			clearInterval(countdownIntervalRef.current);
			countdownIntervalRef.current = null;
		}
		setIsPendingSend(false);
		setUndoCountdown(5);
		pendingEmailDataRef.current = null;
		toastApi.success("Email cancelled - not sent");
	}, [toastApi]);

	// Cleanup timeouts on unmount
	useEffect(() => {
		return () => {
			if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
			if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
		};
	}, []);

	// Schedule send presets
	const getSchedulePreset = (preset: "tomorrow_morning" | "tomorrow_afternoon" | "monday_morning") => {
		const now = new Date();
		let date: Date;

		switch (preset) {
			case "tomorrow_morning":
				date = new Date(now);
				date.setDate(date.getDate() + 1);
				date.setHours(8, 0, 0, 0);
				break;
			case "tomorrow_afternoon":
				date = new Date(now);
				date.setDate(date.getDate() + 1);
				date.setHours(13, 0, 0, 0);
				break;
			case "monday_morning":
				date = new Date(now);
				const dayOfWeek = date.getDay();
				const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
				date.setDate(date.getDate() + daysUntilMonday);
				date.setHours(8, 0, 0, 0);
				break;
		}

		return date;
	};

	// Handle schedule send
	const handleScheduleSend = async (scheduledFor: Date) => {
		if (!selectedEmail || !companyId) {
			toastApi.error("Unable to schedule - missing context");
			return;
		}

		const recipientList = recipients.map((r) => r.email).filter(Boolean);

		if (recipientList.length === 0) {
			toastApi.error("Add at least one recipient");
			return;
		}

		if (!body.trim()) {
			toastApi.error("Please write a message");
			return;
		}

		// Validate scheduled time is in the future
		if (scheduledFor <= new Date()) {
			toastApi.error("Schedule time must be in the future");
			return;
		}

		const finalBody = body + (signature?.value || "");
		const firstCustomerRecipient = recipients.find((r) => r.type === "customer");
		const ccList = ccRecipients.map((r) => r.email).filter(Boolean);
		const bccList = bccRecipients.map((r) => r.email).filter(Boolean);

		setIsSending(true);

		try {
			const result = await sendCustomerEmailAction({
				to: recipientList,
				subject,
				body: finalBody,
				customerName:
					firstCustomerRecipient?.name ||
					selectedEmail.customer?.display_name ||
					selectedEmail.customer?.first_name ||
					selectedEmail.from_name ||
					selectedEmail.from_address ||
					"Customer",
				companyId,
				customerId: selectedEmail.customer_id ?? undefined,
				cc: ccList.length > 0 ? ccList : undefined,
				bcc: bccList.length > 0 ? bccList : undefined,
				attachments: attachments.length > 0 ? attachments.map(a => ({
					filename: a.filename,
					content: a.content,
					contentType: a.contentType,
				})) : undefined,
				scheduledFor: scheduledFor.toISOString(),
			});

			if (result.success) {
				const formattedTime = scheduledFor.toLocaleString("en-US", {
					weekday: "short",
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit",
				});
				toastApi.success(`Email scheduled for ${formattedTime}`);
				onSent?.(result.data ?? {});
				onClose();
			} else {
				toastApi.error(result.error || "Failed to schedule email");
			}
		} catch (error) {
			console.error("Schedule failed:", error);
			toastApi.error(error instanceof Error ? error.message : "Failed to schedule");
		} finally {
			setIsSending(false);
			setScheduleOpen(false);
		}
	};

	// Handle custom schedule
	const handleCustomSchedule = () => {
		if (!scheduledDate || !scheduledTime) {
			toastApi.error("Please select both date and time");
			return;
		}

		const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);
		handleScheduleSend(scheduledFor);
	};

	const handleSend = async () => {
		if (!selectedEmail || !companyId) {
			toastApi.error("Unable to send - missing context");
			return;
		}

		// Extract email addresses from recipients
		const recipientList = recipients.map((r) => r.email).filter(Boolean);

		if (recipientList.length === 0) {
			toastApi.error("Add at least one recipient");
			return;
		}

		if (!body.trim()) {
			toastApi.error("Please write a message");
			return;
		}

		const finalBody = body + (signature?.value || "");

		// Get customer info from first recipient if it's a customer
		const firstCustomerRecipient = recipients.find((r) => r.type === "customer");

		// Extract CC/BCC email addresses
		const ccList = ccRecipients.map((r) => r.email).filter(Boolean);
		const bccList = bccRecipients.map((r) => r.email).filter(Boolean);

		// Store email data for delayed send
		pendingEmailDataRef.current = {
			to: recipientList,
			subject,
			body: finalBody,
			customerName:
				firstCustomerRecipient?.name ||
				selectedEmail.customer?.display_name ||
				selectedEmail.customer?.first_name ||
				selectedEmail.from_name ||
				selectedEmail.from_address ||
				"Customer",
			companyId,
			customerId: selectedEmail.customer_id ?? undefined,
			cc: ccList.length > 0 ? ccList : undefined,
			bcc: bccList.length > 0 ? bccList : undefined,
			attachments: attachments.length > 0 ? attachments.map(a => ({
				filename: a.filename,
				content: a.content,
				contentType: a.contentType,
			})) : undefined,
		};

		// Start undo countdown
		setIsPendingSend(true);
		setUndoCountdown(5);

		// Show toast with undo button
		toastApi.info(
			<div className="flex items-center justify-between gap-4 w-full">
				<span>Sending email in {5}s...</span>
				<button
					className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
					onClick={() => cancelSend()}
				>
					Undo
				</button>
			</div>,
			{ duration: UNDO_SEND_DELAY + 500 }
		);

		// Start countdown interval for UI feedback
		let countdown = 5;
		countdownIntervalRef.current = setInterval(() => {
			countdown--;
			setUndoCountdown(countdown);
			if (countdown <= 0) {
				if (countdownIntervalRef.current) {
					clearInterval(countdownIntervalRef.current);
					countdownIntervalRef.current = null;
				}
			}
		}, 1000);

		// Schedule actual send after delay
		sendTimeoutRef.current = setTimeout(() => {
			if (countdownIntervalRef.current) {
				clearInterval(countdownIntervalRef.current);
				countdownIntervalRef.current = null;
			}
			executeSend();
		}, UNDO_SEND_DELAY);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Cmd/Ctrl + Enter to send
		if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const maxSize = 10 * 1024 * 1024; // 10MB per file
		const newAttachments: EmailAttachment[] = [];

		for (const file of Array.from(files)) {
			if (file.size > maxSize) {
				toastApi.error(`File "${file.name}" is too large (max 10MB)`);
				continue;
			}

			try {
				const content = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => {
						const base64 = (reader.result as string).split(",")[1];
						resolve(base64);
					};
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});

				newAttachments.push({
					filename: file.name,
					content,
					contentType: file.type,
					size: file.size,
				});
			} catch (error) {
				toastApi.error(`Failed to read file "${file.name}"`);
			}
		}

		if (newAttachments.length > 0) {
			setAttachments((prev) => [...prev, ...newAttachments]);
		}

		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [toastApi]);

	const removeAttachment = useCallback((filename: string) => {
		setAttachments((prev) => prev.filter((a) => a.filename !== filename));
	}, []);

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const quoteText = useMemo(() => {
		if (!selectedEmail) return "";
		const fromName =
			selectedEmail.customer?.display_name ||
			selectedEmail.from_name ||
			selectedEmail.from_address ||
			"Unknown";
		const date = new Date(selectedEmail.created_at).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		});
		return `On ${date}, ${fromName} wrote:\n${selectedEmail.body || ""}`;
	}, [selectedEmail]);

	// Smart reply suggestions based on email content
	const smartReplies = useMemo(() => {
		if (!selectedEmail?.body && !selectedEmail?.subject) return [];

		const emailContent = `${selectedEmail.subject || ""} ${selectedEmail.body || ""}`.toLowerCase();
		const suggestions: string[] = [];

		// Questions - suggest answers
		if (emailContent.includes("?") || emailContent.includes("when") || emailContent.includes("can you")) {
			if (emailContent.includes("schedule") || emailContent.includes("appointment") || emailContent.includes("when")) {
				suggestions.push("Yes, I can schedule that. What time works best for you?");
				suggestions.push("Let me check our availability and get back to you shortly.");
			}
			if (emailContent.includes("price") || emailContent.includes("cost") || emailContent.includes("quote")) {
				suggestions.push("I'll prepare a quote for you and send it over shortly.");
				suggestions.push("The pricing depends on a few factors. Could you provide more details?");
			}
			if (emailContent.includes("available") || emailContent.includes("free")) {
				suggestions.push("Yes, I'm available. When would you like to meet?");
				suggestions.push("Let me check my schedule and get back to you.");
			}
		}

		// Thank you messages
		if (emailContent.includes("thank") || emailContent.includes("thanks") || emailContent.includes("appreciate")) {
			suggestions.push("You're welcome! Let me know if you need anything else.");
			suggestions.push("Happy to help! Don't hesitate to reach out.");
		}

		// Confirmation requests
		if (emailContent.includes("confirm") || emailContent.includes("let me know")) {
			suggestions.push("Confirmed! I'll proceed as discussed.");
			suggestions.push("Got it, thanks for confirming.");
		}

		// Urgent / ASAP
		if (emailContent.includes("urgent") || emailContent.includes("asap") || emailContent.includes("emergency")) {
			suggestions.push("I understand the urgency. I'm on it right now.");
			suggestions.push("I'll prioritize this and get back to you shortly.");
		}

		// Invoice / Payment related
		if (emailContent.includes("invoice") || emailContent.includes("payment") || emailContent.includes("bill")) {
			suggestions.push("I'll send the invoice right away.");
			suggestions.push("Thank you for the payment confirmation.");
		}

		// Default fallbacks if no specific matches
		if (suggestions.length === 0) {
			suggestions.push("Thanks for reaching out. I'll get back to you shortly.");
			suggestions.push("Got it, thanks for the update.");
			suggestions.push("I'll look into this and follow up.");
		}

		// Return max 3 suggestions
		return suggestions.slice(0, 3);
	}, [selectedEmail]);

	// Apply smart reply to body
	const applySmartReply = (suggestion: string) => {
		setBody(suggestion);
		textareaRef.current?.focus();
	};

	if (!selectedEmail) return null;

	return (
		<TooltipProvider>
			<div
				className={cn(
					"w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all duration-200",
					"focus-within:border-primary/50 focus-within:shadow-md",
					className,
				)}
			>
				{/* Collapsed Header - Click to expand recipients/subject */}
				<button
					type="button"
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-muted/50 transition-colors"
				>
					<div className="flex items-center gap-2 min-w-0 flex-1">
						<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0">
							{mode === "forward" ? "Forward" : "Reply"}
						</span>
						<span className="text-sm text-foreground truncate">
							{recipients.length > 0
								? recipients.map((r) => r.name).join(", ")
								: "Add recipients..."}
						</span>
					</div>
					{isExpanded ? (
						<ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
					) : (
						<ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
					)}
				</button>

				{/* Expanded Recipients/Subject */}
				{isExpanded && (
					<div className="border-t border-border/50 px-3 py-2 space-y-2 bg-muted/30">
						<div className="flex items-start gap-2">
							<span className="text-xs font-medium text-muted-foreground w-12 pt-2">To:</span>
							<RecipientAutocomplete
								value={recipients}
								onChange={setRecipients}
								placeholder="Search customers, vendors, or type email..."
								recentRecipients={threadRecipients}
								className="flex-1"
							/>
							<div className="flex items-center gap-1 pt-1.5">
								{!showCc && (
									<button
										type="button"
										onClick={() => setShowCc(true)}
										className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted transition-colors"
									>
										Cc
									</button>
								)}
								{!showBcc && (
									<button
										type="button"
										onClick={() => setShowBcc(true)}
										className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted transition-colors"
									>
										Bcc
									</button>
								)}
							</div>
						</div>
						{showCc && (
							<div className="flex items-start gap-2">
								<span className="text-xs font-medium text-muted-foreground w-12 pt-2">Cc:</span>
								<RecipientAutocomplete
									value={ccRecipients}
									onChange={setCcRecipients}
									placeholder="Add Cc recipients..."
									recentRecipients={threadRecipients}
									className="flex-1"
								/>
								<button
									type="button"
									onClick={() => {
										setShowCc(false);
										setCcRecipients([]);
									}}
									className="text-xs text-muted-foreground hover:text-destructive pt-2"
								>
									×
								</button>
							</div>
						)}
						{showBcc && (
							<div className="flex items-start gap-2">
								<span className="text-xs font-medium text-muted-foreground w-12 pt-2">Bcc:</span>
								<RecipientAutocomplete
									value={bccRecipients}
									onChange={setBccRecipients}
									placeholder="Add Bcc recipients..."
									recentRecipients={threadRecipients}
									className="flex-1"
								/>
								<button
									type="button"
									onClick={() => {
										setShowBcc(false);
										setBccRecipients([]);
									}}
									className="text-xs text-muted-foreground hover:text-destructive pt-2"
								>
									×
								</button>
							</div>
						)}
						<div className="flex items-center gap-2">
							<span className="text-xs font-medium text-muted-foreground w-12">Subject:</span>
							<input
								type="text"
								value={subject}
								onChange={(e) => setSubject(e.target.value)}
								placeholder="Subject"
								className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
							/>
						</div>
					</div>
				)}

				{/* Smart Reply Suggestions */}
				{smartReplies.length > 0 && !body && (
					<div className="px-3 py-2 border-b border-border/50">
						<div className="flex items-center gap-1.5 flex-wrap">
							<Sparkles className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
							{smartReplies.map((suggestion, index) => (
								<button
									key={index}
									type="button"
									onClick={() => applySmartReply(suggestion)}
									className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/50 hover:bg-muted hover:border-primary/50 transition-colors truncate max-w-[200px]"
									title={suggestion}
								>
									{suggestion.length > 40 ? `${suggestion.slice(0, 40)}...` : suggestion}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Message Body */}
				<div className="px-3 py-2">
					<textarea
						ref={textareaRef}
						value={body}
						onChange={(e) => setBody(e.target.value)}
						onInput={handleInput}
						onKeyDown={handleKeyDown}
						placeholder="Write your reply..."
						className={cn(
							"w-full resize-none bg-transparent text-sm outline-none",
							"placeholder:text-muted-foreground",
							"min-h-[80px] max-h-[200px]",
						)}
						rows={3}
					/>

					{/* Signature Preview - Always visible */}
					{signature.value && (
						<div className="mt-2 pt-2 border-t border-dashed border-border/50">
							<div className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
								<span>Signature</span>
								<button
									type="button"
									onClick={() => setSignatureId("none")}
									className="text-[10px] hover:text-foreground transition-colors"
								>
									Remove
								</button>
							</div>
							<div className="text-sm text-muted-foreground whitespace-pre-wrap">
								{signature.value.trim()}
							</div>
						</div>
					)}
				</div>

				{/* Quoted Text Toggle */}
				{selectedEmail.body && (
					<div className="px-3 pb-2">
						<button
							type="button"
							onClick={() => setShowQuote(!showQuote)}
							className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
						>
							<MoreHorizontal className="h-3 w-3" />
							{showQuote ? "Hide" : "Show"} quoted text
						</button>
						{showQuote && (
							<div className="mt-2 pl-3 border-l-2 border-muted text-xs text-muted-foreground whitespace-pre-wrap max-h-[100px] overflow-y-auto">
								{quoteText}
							</div>
						)}
					</div>
				)}

				{/* Attachments Display */}
				{attachments.length > 0 && (
					<div className="px-3 py-2 border-t border-border/50 bg-muted/20">
						<div className="flex flex-wrap gap-2">
							{attachments.map((attachment) => (
								<div
									key={attachment.filename}
									className="flex items-center gap-1.5 px-2 py-1 bg-background border rounded-md text-xs"
								>
									<Paperclip className="h-3 w-3 text-muted-foreground" />
									<span className="max-w-[120px] truncate">{attachment.filename}</span>
									<span className="text-muted-foreground">({formatFileSize(attachment.size)})</span>
									<button
										type="button"
										onClick={() => removeAttachment(attachment.filename)}
										className="ml-1 text-muted-foreground hover:text-destructive"
									>
										×
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Hidden file input */}
				<input
					ref={fileInputRef}
					type="file"
					multiple
					className="hidden"
					onChange={handleFileSelect}
					accept="*/*"
				/>

				{/* Footer Toolbar */}
				<div className="flex items-center justify-between gap-1 border-t border-border/50 px-2 py-1.5 bg-muted/30">
					<div className="flex items-center gap-0.5">
						{/* Attachments */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-7 w-7 p-0"
									onClick={() => fileInputRef.current?.click()}
								>
									<Paperclip className="h-4 w-4 text-muted-foreground" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">Attach file</TooltipContent>
						</Tooltip>

						{/* Image */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0">
									<ImageIcon className="h-4 w-4 text-muted-foreground" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">Insert image</TooltipContent>
						</Tooltip>

						{/* Link */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0">
									<LinkIcon className="h-4 w-4 text-muted-foreground" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">Insert link</TooltipContent>
						</Tooltip>

						<div className="w-px h-4 bg-border mx-1" />

						{/* Formatting Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
									<Bold className="h-3.5 w-3.5 text-muted-foreground" />
									<ChevronDown className="h-3 w-3 text-muted-foreground" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-40">
								<DropdownMenuItem>
									<Bold className="h-4 w-4 mr-2" /> Bold
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Italic className="h-4 w-4 mr-2" /> Italic
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Underline className="h-4 w-4 mr-2" /> Underline
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<List className="h-4 w-4 mr-2" /> Bullet list
								</DropdownMenuItem>
								<DropdownMenuItem>
									<ListOrdered className="h-4 w-4 mr-2" /> Numbered list
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Templates & More */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
									<Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
									<span className="text-xs text-muted-foreground hidden sm:inline">Templates</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-48">
								{templateDefinitions.map((template) => (
									<DropdownMenuItem
										key={template.id}
										onClick={() => applyTemplate(template.id)}
									>
										{template.label}
									</DropdownMenuItem>
								))}
								<DropdownMenuSeparator />
								<DropdownMenuItem className="text-muted-foreground text-xs">
									Signature: {signature.label}
								</DropdownMenuItem>
								{signatureOptions.map((opt) => (
									<DropdownMenuItem
										key={opt.id}
										onClick={() => setSignatureId(opt.id)}
										className={cn(
											"pl-6",
											signatureId === opt.id && "font-medium text-primary",
										)}
									>
										{opt.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex items-center gap-1">
						{/* Discard */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
									onClick={onClose}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">Discard</TooltipContent>
						</Tooltip>

						{/* Send Button with Schedule Option */}
						{isPendingSend ? (
							<Button
								size="sm"
								className="h-7 px-3 gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600"
								onClick={cancelSend}
							>
								<span className="text-xs font-medium">Undo ({undoCountdown}s)</span>
							</Button>
						) : (
							<div className="flex items-center">
								<Button
									size="sm"
									className="h-7 px-3 gap-1.5 rounded-l-full rounded-r-none"
									onClick={handleSend}
									disabled={isSending || !body.trim()}
								>
									{isSending ? (
										<Loader2 className="h-3.5 w-3.5 animate-spin" />
									) : (
										<Send className="h-3.5 w-3.5" />
									)}
									<span className="text-xs font-medium">Send</span>
								</Button>
								<Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
									<PopoverTrigger asChild>
										<Button
											size="sm"
											className="h-7 px-1.5 rounded-l-none rounded-r-full border-l border-primary-foreground/20"
											disabled={isSending || !body.trim()}
										>
											<ChevronDown className="h-3.5 w-3.5" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-72 p-2" align="end">
										<div className="space-y-2">
											<p className="text-xs font-medium text-muted-foreground px-2 py-1">
												Schedule send
											</p>
											<div className="space-y-1">
												<Button
													variant="ghost"
													size="sm"
													className="w-full justify-start h-8 text-xs"
													onClick={() => handleScheduleSend(getSchedulePreset("tomorrow_morning"))}
												>
													<Clock className="h-3.5 w-3.5 mr-2" />
													Tomorrow morning (8:00 AM)
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="w-full justify-start h-8 text-xs"
													onClick={() => handleScheduleSend(getSchedulePreset("tomorrow_afternoon"))}
												>
													<Clock className="h-3.5 w-3.5 mr-2" />
													Tomorrow afternoon (1:00 PM)
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="w-full justify-start h-8 text-xs"
													onClick={() => handleScheduleSend(getSchedulePreset("monday_morning"))}
												>
													<Calendar className="h-3.5 w-3.5 mr-2" />
													Monday morning (8:00 AM)
												</Button>
											</div>
											<div className="border-t border-border pt-2">
												<p className="text-xs font-medium text-muted-foreground px-2 py-1">
													Pick date & time
												</p>
												<div className="flex gap-2 px-2">
													<div className="flex-1">
														<Label htmlFor="schedule-date" className="sr-only">Date</Label>
														<Input
															id="schedule-date"
															type="date"
															value={scheduledDate}
															onChange={(e) => setScheduledDate(e.target.value)}
															min={new Date().toISOString().split("T")[0]}
															className="h-8 text-xs"
														/>
													</div>
													<div className="flex-1">
														<Label htmlFor="schedule-time" className="sr-only">Time</Label>
														<Input
															id="schedule-time"
															type="time"
															value={scheduledTime}
															onChange={(e) => setScheduledTime(e.target.value)}
															className="h-8 text-xs"
														/>
													</div>
												</div>
												<Button
													size="sm"
													className="w-full mt-2 h-8 text-xs"
													onClick={handleCustomSchedule}
													disabled={!scheduledDate || !scheduledTime}
												>
													<Clock className="h-3.5 w-3.5 mr-2" />
													Schedule
												</Button>
											</div>
										</div>
									</PopoverContent>
								</Popover>
							</div>
						)}
					</div>
				</div>

				{/* Keyboard shortcut hint */}
				<div className="px-3 pb-1.5 text-[10px] text-muted-foreground/60 text-right">
					⌘ + Enter to send
				</div>
			</div>
		</TooltipProvider>
	);
}
