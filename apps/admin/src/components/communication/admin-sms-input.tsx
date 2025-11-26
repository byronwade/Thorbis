"use client";

/**
 * Admin SMS Message Input Component
 *
 * iPhone-style message input with emoji picker,
 * quick reply templates, and SMS segment counter
 */

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowUp, Loader2, MessageSquareText, Smile } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type SmsTemplate = {
	id: string;
	label: string;
	preview: string;
	text: string;
};

const SMS_TEMPLATES: SmsTemplate[] = [
	{
		id: "follow-up",
		label: "Follow Up",
		preview: "Service follow-up request",
		text: "Hi, just following up on our recent communication. Is there anything else I can help you with?",
	},
	{
		id: "thank-you",
		label: "Thank You",
		preview: "Thank you message",
		text: "Thank you for reaching out! We appreciate your business and are here to help.",
	},
	{
		id: "escalated",
		label: "Escalated",
		preview: "Issue escalation notice",
		text: "I've escalated your issue to our senior support team. Someone will be in touch shortly.",
	},
	{
		id: "resolved",
		label: "Issue Resolved",
		preview: "Resolution confirmation",
		text: "Great news - the issue has been resolved. Please let us know if you experience any further problems.",
	},
];

// SMS segment calculation
const SMS_SEGMENT_LENGTH_GSM = 160;
const SMS_SEGMENT_LENGTH_UNICODE = 70;
const SMS_CONCAT_LENGTH_GSM = 153;
const SMS_CONCAT_LENGTH_UNICODE = 67;

function isGSM7(text: string): boolean {
	const gsm7Regex = /^[@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1B !"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑܧ¿a-zäöñüà]*$/;
	return gsm7Regex.test(text);
}

function calculateSegments(text: string): { segments: number; charsPerSegment: number; isUnicode: boolean } {
	if (!text) return { segments: 0, charsPerSegment: 160, isUnicode: false };

	const isUnicode = !isGSM7(text);
	const singleLimit = isUnicode ? SMS_SEGMENT_LENGTH_UNICODE : SMS_SEGMENT_LENGTH_GSM;
	const concatLimit = isUnicode ? SMS_CONCAT_LENGTH_UNICODE : SMS_CONCAT_LENGTH_GSM;

	if (text.length <= singleLimit) {
		return { segments: 1, charsPerSegment: singleLimit, isUnicode };
	}

	const segments = Math.ceil(text.length / concatLimit);
	return { segments, charsPerSegment: concatLimit, isUnicode };
}

// Common emojis
const EMOJI_CATEGORIES = [
	{
		name: "Frequently Used",
		emojis: ["😀", "😂", "😍", "🥰", "😘", "😊", "😉", "😎", "🤔", "😏", "👍", "👋", "🙏", "❤️", "✅", "🎉"],
	},
	{
		name: "Smileys",
		emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😉", "😊", "😇", "🥰", "😍", "😘", "😗"],
	},
	{
		name: "Gestures",
		emojis: ["👋", "🤚", "🖐", "✋", "👌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👍", "👎", "✊"],
	},
	{
		name: "Symbols",
		emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "✅", "❌", "⭐", "🌟", "💯", "🔥", "💪", "🙌"],
	},
];

type AdminSmsInputProps = {
	value: string;
	onChange: (value: string) => void;
	onSend: () => void;
	sending?: boolean;
	disabled?: boolean;
	placeholder?: string;
};

export function AdminSmsInput({ value, onChange, onSend, sending = false, disabled = false, placeholder = "Type a message..." }: AdminSmsInputProps) {
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	// Calculate SMS segments
	const segmentInfo = calculateSegments(value);
	const showCounter = value.length > 0 && (isFocused || value.length > 100);

	// Auto-resize textarea
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = "auto";
			inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
		}
	}, [value]);

	const handleEmojiSelect = useCallback(
		(emoji: string) => {
			const textarea = inputRef.current;
			if (textarea) {
				const start = textarea.selectionStart;
				const end = textarea.selectionEnd;
				const newValue = value.substring(0, start) + emoji + value.substring(end);
				onChange(newValue);
				// Move cursor after emoji
				setTimeout(() => {
					textarea.selectionStart = start + emoji.length;
					textarea.selectionEnd = start + emoji.length;
					textarea.focus();
				}, 0);
			} else {
				onChange(value + emoji);
			}
			setShowEmojiPicker(false);
		},
		[value, onChange]
	);

	const handleTemplateSelect = useCallback(
		(template: SmsTemplate) => {
			onChange(template.text);
			inputRef.current?.focus();
		},
		[onChange]
	);

	const handleSend = useCallback(() => {
		if (!value.trim() || sending || disabled) return;
		onSend();
	}, [value, sending, disabled, onSend]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			// Enter to send, Shift+Enter for new line
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend]
	);

	return (
		<div className="bg-card border-t border-border/50">
			{/* Segment Counter */}
			{showCounter && (
				<div className="flex items-center justify-end gap-2 px-3 pt-2 pb-1">
					<span className="text-[10px] text-muted-foreground">{value.length} chars</span>
					<span className="text-[10px] text-muted-foreground">·</span>
					<span className={cn("text-[10px] font-medium", segmentInfo.segments > 1 ? "text-amber-500" : "text-muted-foreground")}>
						{segmentInfo.segments} segment{segmentInfo.segments !== 1 ? "s" : ""}
					</span>
					{segmentInfo.isUnicode && (
						<>
							<span className="text-[10px] text-muted-foreground">·</span>
							<span className="text-[10px] text-amber-500">Unicode</span>
						</>
					)}
				</div>
			)}

			{/* Input Area */}
			<div className="flex items-end gap-1.5 p-2">
				{/* Templates Button */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button type="button" variant="ghost" size="icon" className="mb-0.5 size-10 md:size-8 shrink-0 rounded-full hover:bg-muted" disabled={disabled} title="Quick replies">
							<MessageSquareText className="size-5 md:size-4 text-muted-foreground" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" side="top" className="w-56">
						<div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Quick Replies</div>
						{SMS_TEMPLATES.map((template) => (
							<DropdownMenuItem key={template.id} onClick={() => handleTemplateSelect(template)} className="flex-col items-start gap-0.5">
								<span className="font-medium">{template.label}</span>
								<span className="line-clamp-1 text-xs text-muted-foreground">{template.preview}</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Text Input with Emoji and Send */}
				<div className="relative min-w-0 flex-1">
					<div
						className={cn(
							"flex w-full items-center overflow-y-auto rounded-[18px] border border-border bg-muted/50 pl-3 pr-1 py-1 transition-colors",
							"min-h-[44px] md:min-h-[36px] max-h-[120px]",
							"focus-within:border-primary/30 focus-within:bg-background focus-within:ring-1 focus-within:ring-primary/20",
							(disabled || sending) && "cursor-not-allowed opacity-50"
						)}
					>
						<textarea
							ref={inputRef}
							value={value}
							onChange={(e) => onChange(e.target.value)}
							onKeyDown={handleKeyDown}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							placeholder={placeholder}
							disabled={disabled || sending}
							rows={1}
							className={cn(
								"w-full min-w-0 resize-none bg-transparent py-1 leading-5 outline-none",
								"text-base md:text-sm",
								"placeholder:text-muted-foreground/60",
								(disabled || sending) && "pointer-events-none"
							)}
						/>

						{/* Right side buttons */}
						<div className="flex shrink-0 items-center gap-0.5 pl-1">
							{/* Emoji Button */}
							<Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
								<PopoverTrigger asChild>
									<button
										type="button"
										className={cn("flex size-9 md:size-7 items-center justify-center rounded-full transition-colors", "hover:bg-muted/80", showEmojiPicker && "bg-muted")}
										disabled={disabled}
										title="Add emoji"
									>
										<Smile className="size-5 md:size-4 text-muted-foreground" />
									</button>
								</PopoverTrigger>
								<PopoverContent side="top" align="end" className="w-[300px] p-0">
									<ScrollArea className="h-[220px]">
										<div className="p-2">
											{EMOJI_CATEGORIES.map((category, idx) => (
												<div key={category.name} className={idx > 0 ? "mt-3" : ""}>
													<h4 className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{category.name}</h4>
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
								disabled={!value.trim() || sending || disabled}
								className={cn(
									"flex size-9 md:size-7 items-center justify-center rounded-full transition-all duration-200",
									value.trim() ? "bg-primary hover:bg-primary/90 scale-100 active:scale-95" : "bg-muted/50 scale-90"
								)}
							>
								{sending ? (
									<Loader2 className={cn("size-5 md:size-4 animate-spin", value.trim() ? "text-primary-foreground" : "text-muted-foreground")} />
								) : (
									<ArrowUp className={cn("size-5 md:size-4", value.trim() ? "text-primary-foreground" : "text-muted-foreground")} />
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
