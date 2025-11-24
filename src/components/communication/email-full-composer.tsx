"use client";

import { sendCustomerEmailAction } from "@/actions/communications";
import { saveDraftAction, deleteDraftAction } from "@/actions/email-actions";
import { Button } from "@/components/ui/button";
import { toast as sonnerToast } from "sonner";
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
	Clock,
	Italic,
	Link as LinkIcon,
	List,
	ListOrdered,
	Loader2,
	Paperclip,
	Send,
	Sparkles,
	Trash2,
	Underline,
	X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
	RecipientAutocomplete,
	type Recipient,
} from "@/components/communication/recipient-autocomplete";
import { CustomerContextCard } from "@/components/communication/customer-context-card";

type EmailAttachment = {
	filename: string;
	content: string;
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
	{
		id: "introduction",
		label: "Introduction",
		body: "Hi there,\n\nI wanted to reach out and introduce myself. I'm looking forward to working with you.\n\nPlease let me know if you have any questions.\n\nBest regards,",
	},
];

const signatureOptions = [
	{ id: "none", label: "No signature", value: "" },
	{ id: "support", label: "Thorbis Support", value: "\n\nThanks,\nThorbis Support Team" },
	{ id: "tech", label: "Technical Lead", value: "\n\nBest regards,\nJordan – Technical Lead" },
];

interface EmailFullComposerProps {
	companyId: string | null;
	onClose: () => void;
	onSent?: (record: Record<string, unknown>) => void;
	initialRecipient?: Recipient;
	className?: string;
}

export function EmailFullComposer({
	companyId,
	onClose,
	onSent,
	initialRecipient,
	className,
}: EmailFullComposerProps) {
	const { toast: toastApi } = useToast();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Form state
	const [body, setBody] = useState("");
	const [subject, setSubject] = useState("");
	const [recipients, setRecipients] = useState<Recipient[]>(initialRecipient ? [initialRecipient] : []);
	const [ccRecipients, setCcRecipients] = useState<Recipient[]>([]);
	const [bccRecipients, setBccRecipients] = useState<Recipient[]>([]);
	const [showCc, setShowCc] = useState(false);
	const [showBcc, setShowBcc] = useState(false);
	const [attachments, setAttachments] = useState<EmailAttachment[]>([]);
	const [signatureId, setSignatureId] = useState("support");

	// UI state
	const [isSending, setIsSending] = useState(false);
	const [isDirty, setIsDirty] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const [draftId, setDraftId] = useState<string | null>(null);
	const [isSavingDraft, setIsSavingDraft] = useState(false);

	// Schedule send state
	const [scheduleOpen, setScheduleOpen] = useState(false);
	const [scheduledDate, setScheduledDate] = useState<string>("");
	const [scheduledTime, setScheduledTime] = useState<string>("");

	// Undo send state
	const UNDO_SEND_DELAY = 5000;
	const [isPendingSend, setIsPendingSend] = useState(false);
	const [undoCountdown, setUndoCountdown] = useState(5);
	const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const countdownToastIdRef = useRef<string | number | null>(null);
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

	// Extract first customer recipient for context card
	const customerRecipient = useMemo(
		() => recipients.find((r) => r.type === "customer" && r.id),
		[recipients],
	);

	// Mark as dirty when content changes
	useEffect(() => {
		if (body || subject || recipients.length > 0) {
			setIsDirty(true);
		}
	}, [body, subject, recipients]);

	// Save draft function
	const saveDraft = useCallback(async () => {
		// Don't save if there's nothing to save or if we're already saving
		if (isSavingDraft || (!body && !subject && recipients.length === 0)) {
			return;
		}

		setIsSavingDraft(true);
		try {
			const firstCustomerRecipient = recipients.find((r) => r.type === "customer");
			const result = await saveDraftAction({
				id: draftId || undefined,
				to: recipients.map((r) => r.email).filter(Boolean),
				cc: ccRecipients.map((r) => r.email).filter(Boolean),
				bcc: bccRecipients.map((r) => r.email).filter(Boolean),
				subject,
				body,
				customerId: firstCustomerRecipient?.id,
				attachments: attachments.length > 0 ? attachments.map(a => ({
					filename: a.filename,
					content: a.content,
					contentType: a.contentType,
				})) : undefined,
			});

			if (result.success && result.draftId) {
				setDraftId(result.draftId);
				setLastSaved(new Date());
				setIsDirty(false);
			} else {
				console.error("Failed to save draft:", result.error);
			}
		} catch (error) {
			console.error("Error saving draft:", error);
		} finally {
			setIsSavingDraft(false);
		}
	}, [body, subject, recipients, ccRecipients, bccRecipients, attachments, draftId, isSavingDraft]);

	// Auto-save draft every 30 seconds when dirty
	useEffect(() => {
		if (!isDirty) return;

		autoSaveTimeoutRef.current = setTimeout(() => {
			saveDraft();
		}, 30000);

		return () => {
			if (autoSaveTimeoutRef.current) {
				clearTimeout(autoSaveTimeoutRef.current);
			}
		};
	}, [isDirty, saveDraft]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current);
			if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
			if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
		};
	}, []);

	// Auto-resize textarea as user types - grows to fill available space
	const handleTextareaInput = useCallback(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			// Reset height to auto to get the correct scrollHeight
			textarea.style.height = "auto";
			// Let it grow to its natural height - parent container handles overflow
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}, []);

	// Trigger resize when body changes
	useEffect(() => {
		handleTextareaInput();
	}, [body, handleTextareaInput]);

	// Focus textarea on mount
	useEffect(() => {
		setTimeout(() => textareaRef.current?.focus(), 100);
	}, []);

	const cancelSend = useCallback(() => {
		if (sendTimeoutRef.current) {
			clearTimeout(sendTimeoutRef.current);
			sendTimeoutRef.current = null;
		}
		if (countdownIntervalRef.current) {
			clearInterval(countdownIntervalRef.current);
			countdownIntervalRef.current = null;
		}
		if (countdownToastIdRef.current !== null) {
			sonnerToast.dismiss(countdownToastIdRef.current);
			countdownToastIdRef.current = null;
		}
		setIsPendingSend(false);
		setUndoCountdown(5);
		pendingEmailDataRef.current = null;
		toastApi.success("Send cancelled");
	}, [toastApi]);

	const executeSend = useCallback(async () => {
		const emailData = pendingEmailDataRef.current;
		if (!emailData) return;

		// Dismiss countdown toast
		if (countdownToastIdRef.current !== null) {
			sonnerToast.dismiss(countdownToastIdRef.current);
			countdownToastIdRef.current = null;
		}

		setIsSending(true);
		try {
			const result = await sendCustomerEmailAction(emailData);
			if (result.success) {
				// Delete the draft if it was saved
				if (draftId) {
					try {
						await deleteDraftAction(draftId);
					} catch (error) {
						console.error("Failed to delete draft after send:", error);
					}
				}
				toastApi.success("Email sent successfully");
				onSent?.(result.data ?? {});
				onClose();
			} else {
				toastApi.error(result.error || "Failed to send email");
			}
		} catch (error) {
			console.error("Send failed:", error);
			toastApi.error(error instanceof Error ? error.message : "Failed to send");
		} finally {
			setIsSending(false);
			setIsPendingSend(false);
			pendingEmailDataRef.current = null;
		}
	}, [toastApi, onSent, onClose, draftId]);

	const handleSend = async () => {
		if (!companyId) {
			toastApi.error("Unable to send - missing company context");
			return;
		}

		const recipientList = recipients.map((r) => r.email).filter(Boolean);

		if (recipientList.length === 0) {
			toastApi.error("Add at least one recipient");
			return;
		}

		if (!subject.trim()) {
			toastApi.error("Please add a subject");
			return;
		}

		if (!body.trim()) {
			toastApi.error("Please write a message");
			return;
		}

		const finalBody = body + (signature?.value || "");
		const firstCustomerRecipient = recipients.find((r) => r.type === "customer");
		const ccList = ccRecipients.map((r) => r.email).filter(Boolean);
		const bccList = bccRecipients.map((r) => r.email).filter(Boolean);

		pendingEmailDataRef.current = {
			to: recipientList,
			subject,
			body: finalBody,
			customerName: firstCustomerRecipient?.name || "Customer",
			companyId,
			customerId: firstCustomerRecipient?.id,
			cc: ccList.length > 0 ? ccList : undefined,
			bcc: bccList.length > 0 ? bccList : undefined,
			attachments: attachments.length > 0 ? attachments.map(a => ({
				filename: a.filename,
				content: a.content,
				contentType: a.contentType,
			})) : undefined,
		};

		setIsPendingSend(true);
		setUndoCountdown(5);

		// Create initial toast and store ID
		let countdown = 5;
		countdownToastIdRef.current = sonnerToast.info(
			<div className="flex items-center justify-between gap-4 w-full">
				<span>Sending email in {countdown}s...</span>
				<button
					className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
					onClick={() => cancelSend()}
				>
					Undo
				</button>
			</div>,
			{ duration: UNDO_SEND_DELAY + 500 }
		);

		// Update toast every second with new countdown
		countdownIntervalRef.current = setInterval(() => {
			countdown--;
			setUndoCountdown(countdown);

			// Update the toast with new countdown
			if (countdownToastIdRef.current !== null && countdown > 0) {
				sonnerToast.info(
					<div className="flex items-center justify-between gap-4 w-full">
						<span>Sending email in {countdown}s...</span>
						<button
							className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
							onClick={() => cancelSend()}
						>
							Undo
						</button>
					</div>,
					{
						id: countdownToastIdRef.current,
						duration: UNDO_SEND_DELAY + 500
					}
				);
			}

			if (countdown <= 0 && countdownIntervalRef.current) {
				clearInterval(countdownIntervalRef.current);
				countdownIntervalRef.current = null;
			}
		}, 1000);

		sendTimeoutRef.current = setTimeout(() => {
			if (countdownIntervalRef.current) {
				clearInterval(countdownIntervalRef.current);
				countdownIntervalRef.current = null;
			}
			executeSend();
		}, UNDO_SEND_DELAY);
	};

	const handleScheduleSend = async (scheduledFor: Date) => {
		if (!companyId) {
			toastApi.error("Unable to send - missing company context");
			return;
		}

		const recipientList = recipients.map((r) => r.email).filter(Boolean);
		if (recipientList.length === 0) {
			toastApi.error("Add at least one recipient");
			return;
		}

		if (!subject.trim()) {
			toastApi.error("Please add a subject");
			return;
		}

		setIsSending(true);
		try {
			const finalBody = body + (signature?.value || "");
			const firstCustomerRecipient = recipients.find((r) => r.type === "customer");
			const ccList = ccRecipients.map((r) => r.email).filter(Boolean);
			const bccList = bccRecipients.map((r) => r.email).filter(Boolean);

			const result = await sendCustomerEmailAction({
				to: recipientList,
				subject,
				body: finalBody,
				customerName: firstCustomerRecipient?.name || "Customer",
				companyId,
				customerId: firstCustomerRecipient?.id,
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

	const getSchedulePreset = (preset: string): Date => {
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setDate(tomorrow.getDate() + 1);

		switch (preset) {
			case "tomorrow_morning":
				tomorrow.setHours(9, 0, 0, 0);
				return tomorrow;
			case "tomorrow_afternoon":
				tomorrow.setHours(14, 0, 0, 0);
				return tomorrow;
			case "monday_morning": {
				const monday = new Date(now);
				const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
				monday.setDate(monday.getDate() + daysUntilMonday);
				monday.setHours(9, 0, 0, 0);
				return monday;
			}
			default:
				return tomorrow;
		}
	};

	const handleCustomSchedule = () => {
		if (!scheduledDate || !scheduledTime) {
			toastApi.error("Please select both date and time");
			return;
		}
		handleScheduleSend(new Date(`${scheduledDate}T${scheduledTime}`));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const maxSize = 10 * 1024 * 1024;
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
			} catch {
				toastApi.error(`Failed to read file "${file.name}"`);
			}
		}

		if (newAttachments.length > 0) {
			setAttachments((prev) => [...prev, ...newAttachments]);
		}

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

	// Save draft and close (X button behavior)
	const handleClose = useCallback(async () => {
		// Save the draft before closing if there's content
		if (isDirty && (body || subject || recipients.length > 0)) {
			await saveDraft();
		}
		onClose();
	}, [isDirty, body, subject, recipients, saveDraft, onClose]);

	// Delete draft and close (trash button behavior)
	const handleDiscard = useCallback(async () => {
		// If there's a saved draft, delete it
		if (draftId) {
			try {
				await deleteDraftAction(draftId);
			} catch (error) {
				console.error("Failed to delete draft:", error);
			}
		}
		onClose();
	}, [draftId, onClose]);

	const applyTemplate = (templateId: string) => {
		const template = templateDefinitions.find((t) => t.id === templateId);
		if (template) {
			setBody(template.body);
		}
	};

	return (
		<TooltipProvider>
			<div className={cn(
				"flex flex-col h-full overflow-hidden bg-card",
				className
			)}>
				{/* Header - Clean minimal design */}
				<div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
					<div className="flex items-center gap-2">
						<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							New Message
						</span>
						{isSavingDraft ? (
							<span className="text-[10px] text-muted-foreground/60">
								· Saving draft...
							</span>
						) : lastSaved ? (
							<span className="text-[10px] text-muted-foreground/60">
								· Draft saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
							</span>
						) : null}
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
						onClick={handleClose}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Recipients Section - Clean layout matching reply composer */}
				<div className="px-3 py-2 space-y-2 border-b border-border/50">
					{/* To Field */}
					<div className="flex items-start gap-2">
						<span className="text-xs font-medium text-muted-foreground w-12 pt-2">To:</span>
						<RecipientAutocomplete
							value={recipients}
							onChange={setRecipients}
							placeholder="Search customers, vendors, or type email..."
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

					{/* CC Field */}
					{showCc && (
						<div className="flex items-start gap-2">
							<span className="text-xs font-medium text-muted-foreground w-12 pt-2">Cc:</span>
							<RecipientAutocomplete
								value={ccRecipients}
								onChange={setCcRecipients}
								placeholder="Add Cc recipients..."
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

					{/* BCC Field */}
					{showBcc && (
						<div className="flex items-start gap-2">
							<span className="text-xs font-medium text-muted-foreground w-12 pt-2">Bcc:</span>
							<RecipientAutocomplete
								value={bccRecipients}
								onChange={setBccRecipients}
								placeholder="Add Bcc recipients..."
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

					{/* Subject Field */}
					<div className="flex items-center gap-2">
						<span className="text-xs font-medium text-muted-foreground w-12">Subject:</span>
						<input
							type="text"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							placeholder="Subject"
							className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
							autoComplete="off"
							autoCorrect="off"
							autoCapitalize="off"
							spellCheck="true"
							name="email-subject"
						/>
					</div>
				</div>

				{/* Customer Context Card */}
				{customerRecipient?.id && (
					<div className="px-3 py-2 border-b border-border/50">
						<CustomerContextCard customerId={customerRecipient.id} />
					</div>
				)}

				{/* Message Body */}
				<div className="flex-1 flex flex-col min-h-0 overflow-hidden">
					<div className="px-3 py-2 flex-1 overflow-y-auto">
						<textarea
							ref={textareaRef}
							value={body}
							onChange={(e) => setBody(e.target.value)}
							onInput={handleTextareaInput}
							onKeyDown={handleKeyDown}
							placeholder="Write your message..."
							className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground min-h-[80px]"
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

					{/* Attachments */}
					{attachments.length > 0 && (
						<div className="px-3 py-2 border-t border-border/50">
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
				</div>

				{/* Hidden file input */}
				<input
					ref={fileInputRef}
					type="file"
					multiple
					className="hidden"
					onChange={handleFileSelect}
					accept="*/*"
				/>

				{/* Footer Toolbar - Clean design matching reply composer */}
				<div className="flex items-center justify-between gap-1 border-t border-border/50 px-2 py-1.5">
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

						{/* Templates & Signatures */}
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
									onClick={handleDiscard}
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
									disabled={isSending || !body.trim() || recipients.length === 0}
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
											disabled={isSending || !body.trim() || recipients.length === 0}
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
													Tomorrow morning (9:00 AM)
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="w-full justify-start h-8 text-xs"
													onClick={() => handleScheduleSend(getSchedulePreset("tomorrow_afternoon"))}
												>
													<Clock className="h-3.5 w-3.5 mr-2" />
													Tomorrow afternoon (2:00 PM)
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="w-full justify-start h-8 text-xs"
													onClick={() => handleScheduleSend(getSchedulePreset("monday_morning"))}
												>
													<Calendar className="h-3.5 w-3.5 mr-2" />
													Monday morning (9:00 AM)
												</Button>
											</div>
											<div className="border-t border-border pt-2">
												<p className="text-xs font-medium text-muted-foreground px-2 py-1">
													Pick date & time
												</p>
												<div className="flex gap-2 px-2">
													<div className="flex-1">
														<Input
															type="date"
															value={scheduledDate}
															onChange={(e) => setScheduledDate(e.target.value)}
															min={new Date().toISOString().split("T")[0]}
															className="h-8 text-xs"
														/>
													</div>
													<div className="flex-1">
														<Input
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
