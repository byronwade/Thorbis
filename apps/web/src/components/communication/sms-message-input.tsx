/**
 * SMS Message Input Component
 *
 * iPhone-style message input with consolidated attachment menu,
 * inline emoji picker, and SMS segment counter
 */

"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    ArrowUp,
    Camera,
    FileText,
    ImageIcon,
    Loader2,
    MessageSquareText,
    Plus,
    Smile,
    X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// =============================================================================
// QUICK REPLY TEMPLATES - Builder Functions with Smart Defaults
// =============================================================================

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

type SmsTemplate = {
	id: string;
	label: string;
	preview: string;
	build: (ctx: TemplateContext) => string;
};

const SMS_TEMPLATES: SmsTemplate[] = [
	{
		id: "appointment-reminder",
		label: "Appointment Reminder",
		preview: "Reminder about upcoming appointment",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			const dateTime =
				ctx.appointmentDate && ctx.appointmentTime
					? `on ${ctx.appointmentDate} at ${ctx.appointmentTime}`
					: ctx.appointmentDate
						? `on ${ctx.appointmentDate}`
						: "for your upcoming appointment";
			return `Hi ${name}, this is a reminder about your appointment ${dateTime}. Reply CONFIRM to confirm or call us to reschedule.`;
		},
	},
	{
		id: "on-the-way",
		label: "On The Way",
		preview: "Technician en route notification",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			const tech = ctx.technicianName || "Our technician";
			return `Hi ${name}, ${tech} is on the way and should arrive shortly.`;
		},
	},
	{
		id: "running-late",
		label: "Running Late",
		preview: "Apology for delay",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			return `Hi ${name}, we apologize but our technician is running a bit behind schedule. We'll update you when they're on the way.`;
		},
	},
	{
		id: "job-complete",
		label: "Job Complete",
		preview: "Work completed notification",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			const company = ctx.companyName
				? `choosing ${ctx.companyName}`
				: "your business";
			return `Hi ${name}, the work has been completed. If you have any questions, please don't hesitate to reach out. Thank you for ${company}!`;
		},
	},
	{
		id: "payment-reminder",
		label: "Payment Reminder",
		preview: "Friendly payment reminder",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			const invoiceInfo =
				ctx.invoiceNumber && ctx.amount
					? `invoice #${ctx.invoiceNumber} for $${ctx.amount}`
					: ctx.invoiceNumber
						? `invoice #${ctx.invoiceNumber}`
						: "your outstanding invoice";
			return `Hi ${name}, this is a friendly reminder that ${invoiceInfo} is due. Please let us know if you have any questions.`;
		},
	},
	{
		id: "follow-up",
		label: "Follow Up",
		preview: "Service follow-up request",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			return `Hi ${name}, just following up on our recent service. Is everything working well? We'd love to hear your feedback!`;
		},
	},
	{
		id: "thank-you",
		label: "Thank You",
		preview: "Thank you message",
		build: (ctx) => {
			const company = ctx.companyName
				? `choosing ${ctx.companyName}`
				: "your business";
			return `Thank you for ${company}! We appreciate your trust in us. If you have a moment, we'd love a review!`;
		},
	},
	{
		id: "reschedule",
		label: "Reschedule Request",
		preview: "Reschedule appointment request",
		build: (ctx) => {
			const name = ctx.customerFirstName || "there";
			const contact = ctx.companyPhone
				? `, or call us at ${ctx.companyPhone}`
				: "";
			return `Hi ${name}, we need to reschedule your appointment. Please reply with a date and time that works for you${contact}.`;
		},
	},
];

type Attachment = {
	id: string;
	file: File;
	preview?: string;
	type: "image" | "file";
};

type SmsMessageInputProps = {
	value?: string;
	onChange?: (value: string) => void;
	onSend: (text: string, attachments: Attachment[]) => void;
	onAttach?: (files: File[]) => void;
	sending?: boolean;
	disabled?: boolean;
	placeholder?: string;
	showSegmentCounter?: boolean;
	// Customer context (required for templates/merge fields to show)
	customerName?: string;
	customerFirstName?: string;
	customerId?: string;
	// Additional context for templates/AI
	jobType?: string;
	companyName?: string;
	companyPhone?: string;
	technicianName?: string;
	appointmentDate?: string;
	appointmentTime?: string;
	invoiceNumber?: string;
	amount?: string;
	// AI autocomplete
	enableAiSuggestions?: boolean;
};

// SMS segment calculation (GSM-7 vs Unicode)
const SMS_SEGMENT_LENGTH_GSM = 160;
const SMS_SEGMENT_LENGTH_UNICODE = 70;
const SMS_CONCAT_LENGTH_GSM = 153; // When concatenated, headers take space
const SMS_CONCAT_LENGTH_UNICODE = 67;

function isGSM7(text: string): boolean {
	// GSM-7 character set (basic Latin, numbers, common symbols)
	const gsm7Regex =
		/^[@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1B !"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑܧ¿a-zäöñüà]*$/;
	return gsm7Regex.test(text);
}

function calculateSegments(text: string): {
	segments: number;
	charsPerSegment: number;
	isUnicode: boolean;
} {
	if (!text) return { segments: 0, charsPerSegment: 160, isUnicode: false };

	const isUnicode = !isGSM7(text);
	const singleLimit = isUnicode
		? SMS_SEGMENT_LENGTH_UNICODE
		: SMS_SEGMENT_LENGTH_GSM;
	const concatLimit = isUnicode
		? SMS_CONCAT_LENGTH_UNICODE
		: SMS_CONCAT_LENGTH_GSM;

	if (text.length <= singleLimit) {
		return { segments: 1, charsPerSegment: singleLimit, isUnicode };
	}

	const segments = Math.ceil(text.length / concatLimit);
	return { segments, charsPerSegment: concatLimit, isUnicode };
}

// Common emojis (iPhone Messages style)
const EMOJI_CATEGORIES = [
	{
		name: "Frequently Used",
		emojis: [
			"😀",
			"😂",
			"😍",
			"🥰",
			"😘",
			"😊",
			"😉",
			"😎",
			"🤔",
			"😏",
			"😒",
			"🙄",
			"😮",
			"🤗",
			"😴",
			"😋",
			"😝",
			"🤤",
			"😪",
			"😵",
		],
	},
	{
		name: "Smileys & People",
		emojis: [
			"😀",
			"😃",
			"😄",
			"😁",
			"😆",
			"😅",
			"🤣",
			"😂",
			"🙂",
			"🙃",
			"😉",
			"😊",
			"😇",
			"🥰",
			"😍",
			"🤩",
			"😘",
			"😗",
			"😚",
			"😙",
			"😋",
			"😛",
			"😜",
			"🤪",
			"😝",
			"🤑",
			"🤗",
			"🤭",
			"🤫",
			"🤔",
		],
	},
	{
		name: "Gestures",
		emojis: [
			"👋",
			"🤚",
			"🖐",
			"✋",
			"🖖",
			"👌",
			"🤌",
			"🤏",
			"✌️",
			"🤞",
			"🤟",
			"🤘",
			"🤙",
			"👈",
			"👉",
			"👆",
			"🖕",
			"👇",
			"☝️",
			"👍",
		],
	},
	{
		name: "Objects",
		emojis: [
			"📱",
			"💻",
			"⌚",
			"🖥",
			"⌨️",
			"🖱",
			"🖲",
			"🕹",
			"🗜",
			"💾",
			"💿",
			"📀",
			"📷",
			"📸",
			"📹",
			"🎥",
			"📽",
			"🎞",
			"📞",
			"☎️",
		],
	},
	{
		name: "Symbols",
		emojis: [
			"❤️",
			"🧡",
			"💛",
			"💚",
			"💙",
			"💜",
			"🖤",
			"🤍",
			"🤎",
			"💔",
			"❣️",
			"💕",
			"💞",
			"💓",
			"💗",
			"💖",
			"💘",
			"💝",
			"💟",
			"☮️",
		],
	},
];

export function SmsMessageInput({
	value: controlledValue,
	onChange,
	onSend,
	onAttach,
	sending = false,
	disabled = false,
	placeholder = "Text Message",
	showSegmentCounter = true,
	customerName,
	customerFirstName,
	customerId: _customerId, // Available for future AI context
	jobType,
	companyName,
	companyPhone,
	technicianName,
	appointmentDate,
	appointmentTime,
	invoiceNumber,
	amount,
	enableAiSuggestions = false,
}: SmsMessageInputProps) {
	const [internalValue, setInternalValue] = useState("");
	const isControlled = controlledValue !== undefined;
	const value = isControlled ? controlledValue : internalValue;

	const handleChange = useCallback((newValue: string) => {
		if (onChange) {
			onChange(newValue);
		} else {
			setInternalValue(newValue);
		}
	}, [onChange]);

	const [attachments, setAttachments] = useState<Attachment[]>([]);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [aiSuggestion, setAiSuggestion] = useState<string>("");
	const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
	const inputRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);
	const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Calculate SMS segments
	const segmentInfo = calculateSegments(value);
	const showCounter =
		showSegmentCounter && value.length > 0 && (isFocused || value.length > 100);

	// Fetch AI suggestion (debounced)
	const fetchAiSuggestion = useCallback(
		async (text: string) => {
			if (!enableAiSuggestions || text.length < 3) {
				setAiSuggestion("");
				return;
			}

			setIsLoadingSuggestion(true);
			try {
				const response = await fetch("/api/ai/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						messages: [
							{
								role: "system",
								content: `You are an SMS autocomplete assistant for a field service company. Complete the user's SMS message naturally and professionally.
Context: ${customerName ? `Customer: ${customerName}` : ""} ${jobType ? `Job type: ${jobType}` : ""} ${companyName ? `Company: ${companyName}` : ""}
IMPORTANT: Only return the completion text (what comes AFTER what the user typed). Keep it short (under 100 chars). No quotes or explanations.`,
							},
							{
								role: "user",
								content: `Complete this SMS message: "${text}"`,
							},
						],
						model: "claude-3-5-haiku-20241022",
						maxTokens: 100,
					}),
				});

				if (response.ok) {
					const data = await response.json();
					const suggestion = data.content || data.message || "";
					// Only show suggestion if it's a reasonable completion
					if (suggestion && suggestion.length > 0 && suggestion.length < 150) {
						setAiSuggestion(suggestion.trim());
					} else {
						setAiSuggestion("");
					}
				}
			} catch (error) {
				console.error("AI suggestion error:", error);
				setAiSuggestion("");
			} finally {
				setIsLoadingSuggestion(false);
			}
		},
		[enableAiSuggestions, customerName, jobType, companyName],
	);

	// Debounced AI suggestion effect
	useEffect(() => {
		// Clear any pending timeout
		if (suggestionTimeoutRef.current) {
			clearTimeout(suggestionTimeoutRef.current);
		}

		// Clear suggestion if value changed (user is typing)
		setAiSuggestion("");

		// Don't fetch if disabled or text is too short
		if (!enableAiSuggestions || value.length < 5 || !isFocused) {
			return;
		}

		// Debounce the API call (500ms)
		suggestionTimeoutRef.current = setTimeout(() => {
			fetchAiSuggestion(value);
		}, 500);

		return () => {
			if (suggestionTimeoutRef.current) {
				clearTimeout(suggestionTimeoutRef.current);
			}
		};
	}, [value, enableAiSuggestions, isFocused, fetchAiSuggestion]);

	// Sync contenteditable with value prop (for external updates like clearing after send)
	useEffect(() => {
		if (inputRef.current && inputRef.current.textContent !== value) {
			inputRef.current.textContent = value;
		}
	}, [value]);

	const handleEmojiSelect = useCallback(
		(emoji: string) => {
			const emojiWithSpace = emoji + " ";
			const input = inputRef.current;
			if (input) {
				// Insert emoji at cursor position or append
				const selection = window.getSelection();
				if (selection && selection.rangeCount > 0) {
					const range = selection.getRangeAt(0);
					if (input.contains(range.commonAncestorContainer)) {
						range.deleteContents();
						const textNode = document.createTextNode(emojiWithSpace);
						range.insertNode(textNode);

						// Move cursor to end of inserted text
						const newRange = document.createRange();
						newRange.setStartAfter(textNode);
						newRange.setEndAfter(textNode);
						selection.removeAllRanges();
						selection.addRange(newRange);

						selection.addRange(newRange);
 
						handleChange(input.textContent || "");
					} else {
						handleChange(value + emojiWithSpace);
						// Move cursor to end after state update
						requestAnimationFrame(() => {
							if (input) {
								input.focus();
								const range = document.createRange();
								range.selectNodeContents(input);
								range.collapse(false);
								const sel = window.getSelection();
								sel?.removeAllRanges();
								sel?.addRange(range);
							}
						});
					}
				} else {
					handleChange(value + emojiWithSpace);
					requestAnimationFrame(() => {
						if (input) {
							input.focus();
							const range = document.createRange();
							range.selectNodeContents(input);
							range.collapse(false);
							const sel = window.getSelection();
							sel?.removeAllRanges();
							sel?.addRange(range);
						}
					});
				}
				input.focus();
			} else {
				handleChange(value + emojiWithSpace);
			}
			setShowEmojiPicker(false);
		},
		[value, onChange],
	);

	const handleFileSelect = useCallback(
		(files: FileList | null) => {
			if (!files || files.length === 0) return;

			const newAttachments: Attachment[] = Array.from(files).map((file) => {
				const attachment: Attachment = {
					id: `${Date.now()}-${Math.random()}`,
					file,
					type: file.type.startsWith("image/") ? "image" : "file",
				};

				// Create preview for images
				if (attachment.type === "image") {
					attachment.preview = URL.createObjectURL(file);
				}

				return attachment;
			});

			setAttachments((prev) => [...prev, ...newAttachments]);
			if (onAttach) {
				onAttach(Array.from(files));
			}
		},
		[onAttach],
	);

	const handleRemoveAttachment = useCallback((id: string) => {
		setAttachments((prev) => {
			const attachment = prev.find((a) => a.id === id);
			if (attachment?.preview) {
				URL.revokeObjectURL(attachment.preview);
			}
			return prev.filter((a) => a.id !== id);
		});
	}, []);

	const handleSend = useCallback(() => {
		if ((!value.trim() && attachments.length === 0) || sending || disabled)
			return;
		onSend(value, attachments);
		
		if (!isControlled) {
			setInternalValue("");
		}
		
		// Clear attachments after sending
		attachments.forEach((att) => {
			if (att.preview) {
				URL.revokeObjectURL(att.preview);
			}
		});
		setAttachments([]);
	}, [value, attachments, sending, disabled, onSend]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			// Tab to accept AI suggestion
			if (e.key === "Tab" && aiSuggestion) {
				e.preventDefault();
				handleChange(value + aiSuggestion);
				setAiSuggestion("");
				// Update the contenteditable
				if (inputRef.current) {
					inputRef.current.textContent = value + aiSuggestion;
					// Move cursor to end
					requestAnimationFrame(() => {
						if (inputRef.current) {
							inputRef.current.focus();
							const range = document.createRange();
							range.selectNodeContents(inputRef.current);
							range.collapse(false);
							const sel = window.getSelection();
							sel?.removeAllRanges();
							sel?.addRange(range);
						}
					});
				}
				return;
			}
			// Escape to dismiss suggestion
			if (e.key === "Escape" && aiSuggestion) {
				e.preventDefault();
				setAiSuggestion("");
				return;
			}
			// Enter to send, Shift+Enter for new line
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
			// Cmd/Ctrl+Enter also sends
			if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend, aiSuggestion, value, handleChange],
	);

	// Handle paste - strip formatting and insert plain text
	const handlePaste = useCallback(
		(e: React.ClipboardEvent<HTMLDivElement>) => {
			e.preventDefault();
			const text = e.clipboardData.getData("text/plain");
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				range.deleteContents();
				const textNode = document.createTextNode(text);
				range.insertNode(textNode);

				// Move cursor to end of pasted text
				const newRange = document.createRange();
				newRange.setStartAfter(textNode);
				newRange.setEndAfter(textNode);
				selection.removeAllRanges();
				selection.addRange(newRange);

				selection.addRange(newRange);
 
				handleChange(inputRef.current?.textContent || "");
			}
		},
		[handleChange],
	);

	// Insert text at cursor position (for templates and merge fields)
	const insertText = useCallback(
		(text: string, replace: boolean = false) => {
			const input = inputRef.current;
			if (!input) {
				handleChange(replace ? text : value + text);
				return;
			}

			if (replace) {
				// Replace entire content
				handleChange(text);
				input.textContent = text;
				// Move cursor to end
				requestAnimationFrame(() => {
					input.focus();
					const range = document.createRange();
					range.selectNodeContents(input);
					range.collapse(false);
					const sel = window.getSelection();
					sel?.removeAllRanges();
					sel?.addRange(range);
				});
			} else {
				// Insert at cursor position
				const selection = window.getSelection();
				if (selection && selection.rangeCount > 0) {
					const range = selection.getRangeAt(0);
					if (input.contains(range.commonAncestorContainer)) {
						range.deleteContents();
						const textNode = document.createTextNode(text);
						range.insertNode(textNode);

						const newRange = document.createRange();
						newRange.setStartAfter(textNode);
						newRange.setEndAfter(textNode);
						selection.removeAllRanges();
						selection.addRange(newRange);

						selection.addRange(newRange);
 
						handleChange(input.textContent || "");
					} else {
						handleChange(value + text);
					}
				} else {
					handleChange(value + text);
				}
				input.focus();
			}
		},
		[value, onChange],
	);

	// Apply template with smart defaults - no more brackets!
	const handleTemplateSelect = useCallback(
		(template: SmsTemplate) => {
			// Build template context from available props
			const ctx: TemplateContext = {
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

			// Build the message with smart defaults
			const text = template.build(ctx);
			insertText(text, true);
		},
		[
			insertText,
			customerFirstName,
			customerName,
			companyName,
			companyPhone,
			technicianName,
			appointmentDate,
			appointmentTime,
			invoiceNumber,
			amount,
		],
	);

	return (
		<div className="bg-card border-t border-border/50">
			{/* Segment Counter - Shows when typing */}
			{showCounter && (
				<div className="flex items-center justify-end gap-2 px-3 pt-2 pb-1">
					<span className="text-[10px] text-muted-foreground">
						{value.length} chars
					</span>
					<span className="text-[10px] text-muted-foreground">·</span>
					<span
						className={cn(
							"text-[10px] font-medium",
							segmentInfo.segments > 1
								? "text-amber-500"
								: "text-muted-foreground",
						)}
					>
						{segmentInfo.segments} segment
						{segmentInfo.segments !== 1 ? "s" : ""}
					</span>
					{segmentInfo.isUnicode && (
						<>
							<span className="text-[10px] text-muted-foreground">·</span>
							<span className="text-[10px] text-amber-500">Unicode</span>
						</>
					)}
				</div>
			)}

			{/* Attachment Previews */}
			{attachments.length > 0 && (
				<div className="px-3 pt-2">
					<ScrollArea className="w-full">
						<div className="flex gap-2">
							{attachments.map((attachment) => (
								<div key={attachment.id} className="group relative shrink-0">
									{attachment.type === "image" && attachment.preview ? (
										<div className="relative size-16 overflow-hidden rounded-xl border border-border">
											<img
												src={attachment.preview}
												alt={attachment.file.name}
												className="size-full object-cover"
											/>
											<Button
												variant="ghost"
												size="sm"
												className="absolute right-0.5 top-0.5 size-5 rounded-full bg-black/60 p-0 opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
												onClick={() => handleRemoveAttachment(attachment.id)}
											>
												<X className="size-3 text-white" />
											</Button>
										</div>
									) : (
										<div className="relative flex size-16 items-center justify-center rounded-xl border border-border bg-muted">
											<FileText className="size-5 text-muted-foreground" />
											<Button
												variant="ghost"
												size="sm"
												className="absolute right-0.5 top-0.5 size-5 rounded-full bg-black/60 p-0 opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
												onClick={() => handleRemoveAttachment(attachment.id)}
											>
												<X className="size-3 text-white" />
											</Button>
											<span className="absolute bottom-1 left-1 right-1 truncate text-[8px] text-muted-foreground">
												{attachment.file.name}
											</span>
										</div>
									)}
								</div>
							))}
						</div>
					</ScrollArea>
				</div>
			)}

			{/* Input Area - iPhone style */}
			<div className="flex items-end gap-1.5 p-2 pb-safe">
				{/* Plus Button - Attachment Menu */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="mb-0.5 size-10 md:size-8 shrink-0 rounded-full hover:bg-muted"
							disabled={disabled}
							title="Add attachment"
						>
							<Plus className="size-6 md:size-5 text-muted-foreground" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" side="top" className="w-48">
						<DropdownMenuItem
							onClick={() => imageInputRef.current?.click()}
							className="gap-2"
						>
							<Camera className="size-4" />
							<span>Camera</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								// Create temp input for photos only
								const input = document.createElement("input");
								input.type = "file";
								input.accept = "image/*";
								input.multiple = true;
								input.onchange = (e) =>
									handleFileSelect((e.target as HTMLInputElement).files);
								input.click();
							}}
							className="gap-2"
						>
							<ImageIcon className="size-4" />
							<span>Photo Library</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => fileInputRef.current?.click()}
							className="gap-2"
						>
							<FileText className="size-4" />
							<span>Document</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Templates Button - Always available, auto-fills with smart defaults */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="mb-0.5 size-10 md:size-8 shrink-0 rounded-full hover:bg-muted"
							disabled={disabled}
							title="Quick replies"
						>
							<MessageSquareText className="size-5 md:size-4 text-muted-foreground" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" side="top" className="w-56">
						<div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
							Quick Replies
						</div>
						{SMS_TEMPLATES.map((template) => (
							<DropdownMenuItem
								key={template.id}
								onClick={() => handleTemplateSelect(template)}
								className="flex-col items-start gap-0.5"
							>
								<span className="font-medium">{template.label}</span>
								<span className="line-clamp-1 text-xs text-muted-foreground">
									{template.preview}
								</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Hidden file inputs */}
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept="*/*"
					className="hidden"
					onChange={(e) => handleFileSelect(e.target.files)}
				/>
				<input
					ref={imageInputRef}
					type="file"
					accept="image/*"
					capture="environment"
					className="hidden"
					onChange={(e) => handleFileSelect(e.target.files)}
				/>

				{/* Text Input with Emoji and Send inside - iPhone style */}
				<div className="relative min-w-0 flex-1">
					<div
						className={cn(
							"flex w-full items-center overflow-y-auto rounded-[18px] border border-border bg-muted/50 pl-3 pr-1 py-1 transition-colors",
							"min-h-[44px] md:min-h-[36px] max-h-[120px]", // Taller on mobile for touch targets
							"focus-within:border-primary/30 focus-within:bg-background focus-within:ring-1 focus-within:ring-primary/20",
							(disabled || sending) && "cursor-not-allowed opacity-50",
						)}
						onClick={() => inputRef.current?.focus()}
					>
						{/* Input with ghost text suggestion */}
						<div className="relative min-w-0 flex-1">
							<div
								ref={inputRef}
								contentEditable={!disabled && !sending}
								suppressContentEditableWarning
								spellCheck
								onInput={(e) => {
									const text = e.currentTarget.textContent || "";
									if (onChange) {
										onChange(text);
									}
								}}
								onKeyDown={handleKeyDown}
								onPaste={handlePaste}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								data-placeholder={placeholder}
								className={cn(
									"w-full min-w-0 whitespace-pre-wrap break-words py-1 leading-5 outline-none",
									"text-base md:text-sm", // 16px on mobile to prevent iOS zoom
									"empty:before:pointer-events-none empty:before:text-muted-foreground/60 empty:before:content-[attr(data-placeholder)]",
									(disabled || sending) && "pointer-events-none",
								)}
							/>
							{/* AI Ghost Text Suggestion */}
							{aiSuggestion && value && (
								<div
									className="pointer-events-none absolute inset-0 flex items-center overflow-hidden py-1 text-sm leading-5"
									aria-hidden="true"
								>
									{/* Invisible text to match position */}
									<span className="invisible whitespace-pre-wrap">{value}</span>
									{/* Ghost suggestion */}
									<span className="text-muted-foreground/40">
										{aiSuggestion}
									</span>
								</div>
							)}
							{/* Tab hint */}
							{aiSuggestion && (
								<div className="absolute -top-5 right-0 flex items-center gap-1 text-[10px] text-muted-foreground">
									<kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[9px]">
										Tab
									</kbd>
									<span>to accept</span>
								</div>
							)}
						</div>

						{/* Right side buttons container */}
						<div className="flex shrink-0 items-center gap-0.5 pl-1">
							{/* Emoji Button */}
							<Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
								<PopoverTrigger asChild>
									<button
										type="button"
										className={cn(
											"flex size-9 md:size-7 items-center justify-center rounded-full transition-colors",
											"hover:bg-muted/80",
											showEmojiPicker && "bg-muted",
										)}
										disabled={disabled}
										title="Add emoji"
									>
										<Smile className="size-5 md:size-4 text-muted-foreground" />
									</button>
								</PopoverTrigger>
								<PopoverContent
									side="top"
									align="end"
									className="w-[300px] p-0"
								>
									<ScrollArea className="h-[280px]">
										<div className="p-2">
											{EMOJI_CATEGORIES.map((category, idx) => (
												<div
													key={category.name}
													className={idx > 0 ? "mt-3" : ""}
												>
													<h4 className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
														{category.name}
													</h4>
													<div className="grid grid-cols-8 gap-0.5">
														{category.emojis.map((emoji, emojiIdx) => (
															<button
																key={`${emoji}-${emojiIdx}`}
																type="button"
																className="flex size-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-muted"
																onClick={() => handleEmojiSelect(emoji)}
															>
																{emoji}
															</button>
														))}
													</div>
												</div>
											))}
										</div>
									</ScrollArea>
								</PopoverContent>
							</Popover>

							{/* Send Button */}
							<button
								type="button"
								onClick={handleSend}
								disabled={
									(!value.trim() && attachments.length === 0) ||
									sending ||
									disabled
								}
								className={cn(
									"flex size-9 md:size-7 items-center justify-center rounded-full transition-all duration-200",
									value.trim() || attachments.length > 0
										? "bg-primary hover:bg-primary/90 scale-100 active:scale-95"
										: "bg-muted/50 scale-90",
								)}
							>
								{sending ? (
									<Loader2
										className={cn(
											"size-5 md:size-4 animate-spin",
											value.trim() || attachments.length > 0
												? "text-primary-foreground"
												: "text-muted-foreground",
										)}
									/>
								) : (
									<ArrowUp
										className={cn(
											"size-5 md:size-4",
											value.trim() || attachments.length > 0
												? "text-primary-foreground"
												: "text-muted-foreground",
										)}
									/>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
