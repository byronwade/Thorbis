"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import type { AdminCommunication } from "@/types/entities";
import { cn } from "@/lib/utils";
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
	X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type EmailReplyMode = "reply" | "reply-all" | "forward";

type EmailAttachment = {
	filename: string;
	content: string;
	contentType?: string;
	size: number;
};

type Recipient = {
	id: string;
	name: string;
	email: string;
	type: "company" | "user" | "custom";
};

const templateDefinitions = [
	{
		id: "follow-up",
		label: "Friendly follow-up",
		body: "Hi there,\n\nJust checking in - let me know if you have any questions or if you'd like to see anything else from my side.\n\nBest,",
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
		id: "resolution",
		label: "Issue resolved",
		body: "Hi there,\n\nI wanted to let you know that we've resolved the issue you reported. Here's a summary of what was done:\n\n[Summary]\n\nPlease let us know if you experience any further issues.\n\nBest regards,",
	},
];

const signatureOptions = [
	{ id: "none", label: "No signature", value: "" },
	{ id: "support", label: "Stratos Support", value: "\n\nThanks,\nStratos Support Team" },
	{ id: "admin", label: "Admin Team", value: "\n\nBest regards,\nStratos Admin" },
];

interface AdminEmailReplyComposerProps {
	mode: EmailReplyMode;
	selectedMessage: AdminCommunication | null;
	onClose: () => void;
	onSent?: (data: Record<string, unknown>) => void;
	className?: string;
}

export function AdminEmailReplyComposer({ mode, selectedMessage, onClose, onSent, className }: AdminEmailReplyComposerProps) {
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
	const [newRecipientEmail, setNewRecipientEmail] = useState("");

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

	const signature = useMemo(() => signatureOptions.find((opt) => opt.id === signatureId) ?? signatureOptions[0], [signatureId]);

	// Build default subject and initial recipients
	useEffect(() => {
		if (!selectedMessage) return;

		const base = selectedMessage.subject?.trim() || "No subject";
		const prefix = mode === "forward" ? "Fwd:" : "Re:";
		const newSubject = base.toLowerCase().startsWith(prefix.toLowerCase()) ? base : `${prefix} ${base}`;
		setSubject(newSubject);

		// Set default recipient based on mode
		if (mode !== "forward" && selectedMessage.from) {
			const recipient: Recipient = {
				id: `recipient-${selectedMessage.from}`,
				name: selectedMessage.userName || selectedMessage.companyName || selectedMessage.from,
				email: selectedMessage.from,
				type: selectedMessage.companyId ? "company" : "custom",
			};
			setRecipients([recipient]);
		}
	}, [mode, selectedMessage]);

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

	useEffect(() => {
		setTimeout(() => textareaRef.current?.focus(), 100);
	}, []);

	const applyTemplate = (templateId: string) => {
		const template = templateDefinitions.find((t) => t.id === templateId);
		if (template) {
			setBody(template.body);
		}
	};

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
		toastApi.info("Email cancelled");
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
				const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
				date.setDate(date.getDate() + daysUntilMonday);
				date.setHours(8, 0, 0, 0);
				break;
		}

		return date;
	};

	const handleScheduleSend = async (scheduledFor: Date) => {
		if (!selectedMessage) {
			toastApi.error("Missing context");
			return;
		}

		if (recipients.length === 0) {
			toastApi.error("Add at least one recipient");
			return;
		}

		if (!body.trim()) {
			toastApi.error("Please write a message");
			return;
		}

		if (scheduledFor <= new Date()) {
			toastApi.error("Schedule time must be in the future");
			return;
		}

		setIsSending(true);

		// Simulate scheduling
		setTimeout(() => {
			const formattedTime = scheduledFor.toLocaleString("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
			});
			toastApi.success(`Email scheduled - Will be sent ${formattedTime}`);
			onSent?.({});
			onClose();
			setIsSending(false);
			setScheduleOpen(false);
		}, 1000);
	};

	const handleCustomSchedule = () => {
		if (!scheduledDate || !scheduledTime) {
			toastApi.error("Please select both date and time");
			return;
		}

		const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);
		handleScheduleSend(scheduledFor);
	};

	const handleSend = async () => {
		if (!selectedMessage) {
			toastApi.error("Missing context");
			return;
		}

		if (recipients.length === 0) {
			toastApi.error("Add at least one recipient");
			return;
		}

		if (!body.trim()) {
			toastApi.error("Please write a message");
			return;
		}

		// Start undo countdown
		setIsPendingSend(true);
		setUndoCountdown(5);

		toastApi.loading("Sending email...");

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

		sendTimeoutRef.current = setTimeout(() => {
			if (countdownIntervalRef.current) {
				clearInterval(countdownIntervalRef.current);
				countdownIntervalRef.current = null;
			}
			// Execute send
			setIsSending(true);
			setIsPendingSend(false);

			// Simulate sending
			setTimeout(() => {
				toastApi.success("Email sent successfully");
				onSent?.({});
				onClose();
				setIsSending(false);
			}, 500);
		}, UNDO_SEND_DELAY);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleFileSelect = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
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
		},
		[toastApi]
	);

	const removeAttachment = useCallback((filename: string) => {
		setAttachments((prev) => prev.filter((a) => a.filename !== filename));
	}, []);

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const addRecipient = (email: string) => {
		if (!email || !email.includes("@")) return;
		if (recipients.some((r) => r.email.toLowerCase() === email.toLowerCase())) return;

		setRecipients((prev) => [
			...prev,
			{
				id: `custom-${email}`,
				name: email,
				email,
				type: "custom",
			},
		]);
		setNewRecipientEmail("");
	};

	const removeRecipient = (email: string) => {
		setRecipients((prev) => prev.filter((r) => r.email !== email));
	};

	const quoteText = useMemo(() => {
		if (!selectedMessage) return "";
		const fromName = selectedMessage.userName || selectedMessage.companyName || selectedMessage.from || "Unknown";
		const date = new Date(selectedMessage.createdAt).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		});
		return `On ${date}, ${fromName} wrote:\n${selectedMessage.preview || ""}`;
	}, [selectedMessage]);

	// Smart reply suggestions
	const smartReplies = useMemo(() => {
		if (!selectedMessage?.preview && !selectedMessage?.subject) return [];

		const content = `${selectedMessage.subject || ""} ${selectedMessage.preview || ""}`.toLowerCase();
		const suggestions: string[] = [];

		if (content.includes("?") || content.includes("when") || content.includes("can you")) {
			if (content.includes("schedule") || content.includes("appointment") || content.includes("when")) {
				suggestions.push("Yes, I can schedule that. What time works best for you?");
			}
			if (content.includes("price") || content.includes("cost") || content.includes("quote")) {
				suggestions.push("I'll prepare a quote and send it over shortly.");
			}
		}

		if (content.includes("thank") || content.includes("thanks")) {
			suggestions.push("You're welcome! Let me know if you need anything else.");
		}

		if (content.includes("urgent") || content.includes("asap")) {
			suggestions.push("I understand the urgency. I'm on it right now.");
		}

		if (content.includes("issue") || content.includes("problem") || content.includes("error")) {
			suggestions.push("I'll look into this and get back to you shortly.");
			suggestions.push("Can you provide more details about the issue?");
		}

		if (suggestions.length === 0) {
			suggestions.push("Thanks for reaching out. I'll get back to you shortly.");
			suggestions.push("Got it, thanks for the update.");
		}

		return suggestions.slice(0, 3);
	}, [selectedMessage]);

	const applySmartReply = (suggestion: string) => {
		setBody(suggestion);
		textareaRef.current?.focus();
	};

	if (!selectedMessage) return null;

	return (
		<TooltipProvider>
			<div
				className={cn(
					"w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all duration-200",
					"focus-within:border-primary/50 focus-within:shadow-md",
					className
				)}
			>
				{/* Collapsed Header */}
				<button
					type="button"
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-muted/50 transition-colors"
				>
					<div className="flex items-center gap-2 min-w-0 flex-1">
						<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0">
							{mode === "forward" ? "Forward" : mode === "reply-all" ? "Reply All" : "Reply"}
						</span>
						<span className="text-sm text-foreground truncate">
							{recipients.length > 0 ? recipients.map((r) => r.name).join(", ") : "Add recipients..."}
						</span>
					</div>
					{isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
				</button>

				{/* Expanded Recipients/Subject */}
				{isExpanded && (
					<div className="border-t border-border/50 px-3 py-2 space-y-2 bg-muted/30">
						<div className="flex items-start gap-2">
							<span className="text-xs font-medium text-muted-foreground w-12 pt-2">To:</span>
							<div className="flex-1 flex flex-wrap gap-1 items-center">
								{recipients.map((r) => (
									<span key={r.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
										{r.name}
										<button type="button" onClick={() => removeRecipient(r.email)} className="hover:text-destructive">
											<X className="h-3 w-3" />
										</button>
									</span>
								))}
								<input
									type="email"
									value={newRecipientEmail}
									onChange={(e) => setNewRecipientEmail(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === ",") {
											e.preventDefault();
											addRecipient(newRecipientEmail.trim());
										}
									}}
									onBlur={() => addRecipient(newRecipientEmail.trim())}
									placeholder="Add email..."
									className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
								/>
							</div>
							<div className="flex items-center gap-1 pt-1.5">
								{!showCc && (
									<button type="button" onClick={() => setShowCc(true)} className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted transition-colors">
										Cc
									</button>
								)}
								{!showBcc && (
									<button type="button" onClick={() => setShowBcc(true)} className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted transition-colors">
										Bcc
									</button>
								)}
							</div>
						</div>
						{showCc && (
							<div className="flex items-center gap-2">
								<span className="text-xs font-medium text-muted-foreground w-12">Cc:</span>
								<input type="email" placeholder="Add Cc recipients..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
								<button
									type="button"
									onClick={() => {
										setShowCc(false);
										setCcRecipients([]);
									}}
									className="text-xs text-muted-foreground hover:text-destructive"
								>
									<X className="h-3 w-3" />
								</button>
							</div>
						)}
						{showBcc && (
							<div className="flex items-center gap-2">
								<span className="text-xs font-medium text-muted-foreground w-12">Bcc:</span>
								<input type="email" placeholder="Add Bcc recipients..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
								<button
									type="button"
									onClick={() => {
										setShowBcc(false);
										setBccRecipients([]);
									}}
									className="text-xs text-muted-foreground hover:text-destructive"
								>
									<X className="h-3 w-3" />
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
						className={cn("w-full resize-none bg-transparent outline-none", "text-sm", "placeholder:text-muted-foreground", "min-h-[80px] max-h-[200px]")}
						rows={3}
					/>

					{signature.value && (
						<div className="mt-2 pt-2 border-t border-dashed border-border/50">
							<div className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
								<span>Signature</span>
								<button type="button" onClick={() => setSignatureId("none")} className="text-[10px] hover:text-foreground transition-colors">
									Remove
								</button>
							</div>
							<div className="text-sm text-muted-foreground whitespace-pre-wrap">{signature.value.trim()}</div>
						</div>
					)}
				</div>

				{/* Quoted Text Toggle */}
				{selectedMessage.preview && (
					<div className="px-3 pb-2">
						<button type="button" onClick={() => setShowQuote(!showQuote)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
							<MoreHorizontal className="h-3 w-3" />
							{showQuote ? "Hide" : "Show"} quoted text
						</button>
						{showQuote && <div className="mt-2 pl-3 border-l-2 border-muted text-xs text-muted-foreground whitespace-pre-wrap max-h-[100px] overflow-y-auto">{quoteText}</div>}
					</div>
				)}

				{/* Attachments Display */}
				{attachments.length > 0 && (
					<div className="px-3 py-2 border-t border-border/50 bg-muted/20">
						<div className="flex flex-wrap gap-2">
							{attachments.map((attachment) => (
								<div key={attachment.filename} className="flex items-center gap-1.5 px-2 py-1 bg-background border rounded-md text-xs">
									<Paperclip className="h-3 w-3 text-muted-foreground" />
									<span className="max-w-[120px] truncate">{attachment.filename}</span>
									<span className="text-muted-foreground">({formatFileSize(attachment.size)})</span>
									<button type="button" onClick={() => removeAttachment(attachment.filename)} className="ml-1 text-muted-foreground hover:text-destructive">
										<X className="h-3 w-3" />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				<input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} accept="*/*" />

				{/* Footer Toolbar */}
				<div className="flex items-center justify-between gap-1 border-t border-border/50 px-2 py-1.5 bg-muted/30">
					<div className="flex items-center gap-0.5">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => fileInputRef.current?.click()}>
									<Paperclip className="h-4 w-4 text-muted-foreground" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">Attach file</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0">
									<ImageIcon className="h-4 w-4 text-muted-foreground" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">Insert image</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0">
									<LinkIcon className="h-4 w-4 text-muted-foreground" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">Insert link</TooltipContent>
						</Tooltip>

						<div className="w-px h-4 bg-border mx-1" />

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

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
									<Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
									<span className="text-xs text-muted-foreground hidden sm:inline">Templates</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-48">
								{templateDefinitions.map((template) => (
									<DropdownMenuItem key={template.id} onClick={() => applyTemplate(template.id)}>
										{template.label}
									</DropdownMenuItem>
								))}
								<DropdownMenuSeparator />
								<DropdownMenuItem className="text-muted-foreground text-xs">Signature: {signature.label}</DropdownMenuItem>
								{signatureOptions.map((opt) => (
									<DropdownMenuItem key={opt.id} onClick={() => setSignatureId(opt.id)} className={cn("pl-6", signatureId === opt.id && "font-medium text-primary")}>
										{opt.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex items-center gap-1">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={onClose}>
									<Trash2 className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="top">Discard</TooltipContent>
						</Tooltip>

						{isPendingSend ? (
							<Button size="sm" className="h-7 px-3 gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600" onClick={cancelSend}>
								<span className="text-xs font-medium">Undo ({undoCountdown}s)</span>
							</Button>
						) : (
							<div className="flex items-center">
								<Button size="sm" className="h-7 px-3 gap-1.5 rounded-l-full rounded-r-none" onClick={handleSend} disabled={isSending || !body.trim()}>
									{isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
									<span className="text-xs font-medium">Send</span>
								</Button>
								<Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
									<PopoverTrigger asChild>
										<Button size="sm" className="h-7 px-1.5 rounded-l-none rounded-r-full border-l border-primary-foreground/20" disabled={isSending || !body.trim()}>
											<ChevronDown className="h-3.5 w-3.5" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-72 p-2" align="end">
										<div className="space-y-2">
											<p className="text-xs font-medium text-muted-foreground px-2 py-1">Schedule send</p>
											<div className="space-y-1">
												<Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs" onClick={() => handleScheduleSend(getSchedulePreset("tomorrow_morning"))}>
													<Clock className="h-3.5 w-3.5 mr-2" />
													Tomorrow morning (8:00 AM)
												</Button>
												<Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs" onClick={() => handleScheduleSend(getSchedulePreset("tomorrow_afternoon"))}>
													<Clock className="h-3.5 w-3.5 mr-2" />
													Tomorrow afternoon (1:00 PM)
												</Button>
												<Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs" onClick={() => handleScheduleSend(getSchedulePreset("monday_morning"))}>
													<Calendar className="h-3.5 w-3.5 mr-2" />
													Monday morning (8:00 AM)
												</Button>
											</div>
											<div className="border-t border-border pt-2">
												<p className="text-xs font-medium text-muted-foreground px-2 py-1">Pick date & time</p>
												<div className="flex gap-2 px-2">
													<div className="flex-1">
														<Label htmlFor="schedule-date" className="sr-only">
															Date
														</Label>
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
														<Label htmlFor="schedule-time" className="sr-only">
															Time
														</Label>
														<Input id="schedule-time" type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="h-8 text-xs" />
													</div>
												</div>
												<Button size="sm" className="w-full mt-2 h-8 text-xs" onClick={handleCustomSchedule} disabled={!scheduledDate || !scheduledTime}>
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

				<div className="px-3 pb-1.5 text-[10px] text-muted-foreground/60 text-right">Cmd/Ctrl + Enter to send</div>
			</div>
		</TooltipProvider>
	);
}
