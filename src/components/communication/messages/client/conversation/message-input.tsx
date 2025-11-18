"use client";

/**
 * Message Input - Composer with templates and attachments
 *
 * Features:
 * - Auto-resizing textarea
 * - Template picker
 * - Emoji picker
 * - File attachments
 * - Keyboard shortcuts
 */

import { Paperclip, Send, Smile, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMessageInputStore } from "@/lib/stores/message-input-store";
import { useTeamPresenceStore } from "@/lib/stores/team-presence-store";
import { cn } from "@/lib/utils";

interface MessageInputProps {
	threadId: string;
	onSend: (text: string, attachments: File[]) => Promise<void>;
	disabled?: boolean;
	placeholder?: string;
}

export function MessageInput({
	threadId,
	onSend,
	disabled = false,
	placeholder = "Type a message...",
}: MessageInputProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [isSending, setIsSending] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	// Get draft from store
	const draft = useMessageInputStore((state) => state.loadDraft(threadId));
	const saveDraft = useMessageInputStore((state) => state.saveDraft);
	const clearDraft = useMessageInputStore((state) => state.clearDraft);
	const addAttachment = useMessageInputStore((state) => state.addAttachment);
	const removeAttachment = useMessageInputStore(
		(state) => state.removeAttachment,
	);

	// Team presence for typing indicators
	const setUserTyping = useTeamPresenceStore((state) => state.setUserTyping);
	const clearUserTyping = useTeamPresenceStore(
		(state) => state.clearUserTyping,
	);
	const currentUserId = useTeamPresenceStore((state) => state.currentUserId);

	const [text, setText] = useState(draft?.text || "");
	const attachments = draft?.attachments || [];

	// Save draft on text change
	useEffect(() => {
		if (text) {
			saveDraft(threadId, text);
		}
	}, [text, threadId, saveDraft]);

	// Typing indicator
	useEffect(() => {
		if (text && currentUserId && !isTyping) {
			setIsTyping(true);
			setUserTyping(currentUserId, "Current User", threadId);
		} else if (!text && isTyping && currentUserId) {
			setIsTyping(false);
			clearUserTyping(currentUserId, threadId);
		}

		// Cleanup
		return () => {
			if (currentUserId) {
				clearUserTyping(currentUserId, threadId);
			}
		};
	}, [text, currentUserId, threadId, isTyping, setUserTyping, clearUserTyping]);

	const handleSend = async () => {
		if ((!text.trim() && attachments.length === 0) || disabled || isSending) {
			return;
		}

		setIsSending(true);

		try {
			// Extract files from attachment previews
			const files = attachments.map((a) => a.file);

			await onSend(text.trim(), files);

			// Clear draft and input
			setText("");
			clearDraft(threadId);

			// Stop typing indicator
			if (currentUserId) {
				clearUserTyping(currentUserId, threadId);
				setIsTyping(false);
			}

			// Focus back to input
			textareaRef.current?.focus();
		} catch (error) {
			console.error("Failed to send message:", error);
		} finally {
			setIsSending(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Send on Enter (without Shift)
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);

		files.forEach((file) => {
			const attachment = {
				id: Math.random().toString(36).substring(7),
				file,
				type: file.type.startsWith("image/")
					? "image"
					: file.type.startsWith("video/")
						? "video"
						: file.type.startsWith("audio/")
							? "audio"
							: "document",
				size: file.size,
				name: file.name,
				preview: file.type.startsWith("image/")
					? URL.createObjectURL(file)
					: undefined,
			} as any;

			addAttachment(threadId, attachment);
		});

		// Reset input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="border-t bg-background p-4">
			{/* Attachment previews */}
			{attachments.length > 0 && (
				<div className="flex gap-2 mb-3 flex-wrap">
					{attachments.map((attachment) => (
						<div
							key={attachment.id}
							className="relative group rounded-lg border p-2 bg-muted"
						>
							{attachment.type === "image" && attachment.preview ? (
								<img
									src={attachment.preview}
									alt={attachment.name}
									className="h-16 w-16 object-cover rounded"
								/>
							) : (
								<div className="h-16 w-16 flex items-center justify-center">
									<Paperclip className="h-6 w-6 text-muted-foreground" />
								</div>
							)}
							<button
								onClick={() => removeAttachment(threadId, attachment.id)}
								className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
							>
								×
							</button>
						</div>
					))}
				</div>
			)}

			{/* Input area */}
			<div className="flex items-end gap-2">
				{/* Template picker */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-9 w-9 p-0 flex-shrink-0"
							disabled={disabled}
						>
							<Zap className="h-4 w-4" />
							<span className="sr-only">Insert template</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-64">
						<DropdownMenuLabel>Quick replies</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() =>
								setText("Thank you for contacting us! How can we help?")
							}
						>
							<span className="text-xs font-medium">Greeting</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								setText(
									"We'll get back to you within 24 hours with more information.",
								)
							}
						>
							<span className="text-xs font-medium">Follow-up</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								setText(
									"Your appointment has been scheduled. We'll send you a confirmation shortly.",
								)
							}
						>
							<span className="text-xs font-medium">
								Appointment confirmation
							</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* File attachment */}
				<Button
					variant="ghost"
					size="sm"
					className="h-9 w-9 p-0 flex-shrink-0"
					onClick={() => fileInputRef.current?.click()}
					disabled={disabled}
				>
					<Paperclip className="h-4 w-4" />
					<span className="sr-only">Attach file</span>
				</Button>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept="image/*,video/*,application/pdf"
					className="hidden"
					onChange={handleFileSelect}
				/>

				{/* Textarea */}
				<div className="flex-1 relative">
					<TextareaAutosize
						ref={textareaRef}
						value={text}
						onChange={(e) => setText(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						disabled={disabled || isSending}
						minRows={1}
						maxRows={6}
						className={cn(
							"w-full resize-none rounded-lg border bg-background px-4 py-2.5 text-sm",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							"disabled:cursor-not-allowed disabled:opacity-50",
						)}
						aria-label="Message input"
					/>
				</div>

				{/* Emoji picker (placeholder) */}
				<Button
					variant="ghost"
					size="sm"
					className="h-9 w-9 p-0 flex-shrink-0"
					disabled={disabled}
				>
					<Smile className="h-4 w-4" />
					<span className="sr-only">Add emoji</span>
				</Button>

				{/* Send button */}
				<Button
					onClick={handleSend}
					disabled={
						(!text.trim() && attachments.length === 0) || disabled || isSending
					}
					size="sm"
					className="h-9 gap-1.5"
				>
					<Send className="h-4 w-4" />
					<span className="hidden sm:inline">Send</span>
				</Button>
			</div>

			{/* Helper text */}
			<p className="text-xs text-muted-foreground mt-2">
				Press{" "}
				<kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">Enter</kbd>{" "}
				to send,{" "}
				<kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">Shift</kbd>{" "}
				+{" "}
				<kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">Enter</kbd>{" "}
				for new line
			</p>
		</div>
	);
}
