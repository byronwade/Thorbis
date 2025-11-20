"use client";

/**
 * Message Input V2 - Using Vercel AI MultimodalInput component
 *
 * Features:
 * - Vercel AI SDK integration
 * - Auto-resizing textarea
 * - File attachments
 * - Template picker
 * - Keyboard shortcuts
 */

import { AlertCircle, X, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { MultimodalInput } from "@/components/chat/multimodal-input";
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

// Telnyx MMS hard limits
const MAX_FILES = 10;
const MAX_TOTAL_SIZE_MB = 1;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

interface MessageInputV2Props {
	threadId: string;
	onSend: (text: string, attachments: File[]) => Promise<void>;
	disabled?: boolean;
	placeholder?: string;
}

export function MessageInputV2({
	threadId,
	onSend,
	disabled = false,
	placeholder = "Type a message...",
}: MessageInputV2Props) {
	const [isSending, setIsSending] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [isDragging, setIsDragging] = useState(false);

	// Get draft from store
	const draft = useMessageInputStore((state) => state.loadDraft(threadId));
	const saveDraft = useMessageInputStore((state) => state.saveDraft);
	const clearDraft = useMessageInputStore((state) => state.clearDraft);

	const [text, setText] = useState(draft?.text || "");

	// Calculate current file stats
	const totalFileSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
	const totalFileSizeMB = (totalFileSize / 1024 / 1024).toFixed(2);
	const isNearSizeLimit = totalFileSize > MAX_TOTAL_SIZE_BYTES * 0.8;
	const isNearCountLimit = selectedFiles.length >= MAX_FILES * 0.8;

	const handleSubmit = async (message: string) => {
		if (
			(!message.trim() && selectedFiles.length === 0) ||
			disabled ||
			isSending
		) {
			return;
		}

		setIsSending(true);

		try {
			await onSend(message.trim(), selectedFiles);

			// Clear draft, input, and files
			setText("");
			setSelectedFiles([]);
			clearDraft(threadId);
		} catch (error) {
			console.error("Failed to send message:", error);
		} finally {
			setIsSending(false);
		}
	};

	const handleChange = (value: string) => {
		setText(value);
		if (value) {
			saveDraft(threadId, value);
		}
	};

	const handleFilesSelected = (fileList: FileList | null) => {
		if (!fileList || fileList.length === 0) return;

		const newFiles = Array.from(fileList);
		const currentFiles = selectedFiles;

		// Check file count limit
		if (currentFiles.length + newFiles.length > MAX_FILES) {
			const remaining = MAX_FILES - currentFiles.length;
			toast.error(
				`Telnyx MMS limit: Maximum ${MAX_FILES} files allowed. You can add ${remaining} more file${remaining === 1 ? "" : "s"}.`,
			);

			// Take only what fits within the limit
			if (remaining > 0) {
				const filesToAdd = newFiles.slice(0, remaining);
				const totalSize = [...currentFiles, ...filesToAdd].reduce(
					(sum, f) => sum + f.size,
					0,
				);

				if (totalSize > MAX_TOTAL_SIZE_BYTES) {
					toast.error(
						`Telnyx MMS limit: Total file size must be under ${MAX_TOTAL_SIZE_MB} MB.`,
					);
					return;
				}

				setSelectedFiles((prev) => [...prev, ...filesToAdd]);
			}
			return;
		}

		// Check total size limit
		const totalSize = [...currentFiles, ...newFiles].reduce(
			(sum, f) => sum + f.size,
			0,
		);

		if (totalSize > MAX_TOTAL_SIZE_BYTES) {
			const currentSizeMB = (
				currentFiles.reduce((sum, f) => sum + f.size, 0) /
				1024 /
				1024
			).toFixed(2);
			toast.error(
				`Telnyx MMS limit: Total file size must be under ${MAX_TOTAL_SIZE_MB} MB. Current size: ${currentSizeMB} MB.`,
			);
			return;
		}

		setSelectedFiles((prev) => [...prev, ...newFiles]);
	};

	const handleRemoveFile = (index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const insertTemplate = (template: string) => {
		setText(template);
		saveDraft(threadId, template);
	};

	// Drag and drop handlers
	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
			setIsDragging(true);
		}
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const droppedFiles = Array.from(e.dataTransfer.files);
		if (droppedFiles.length === 0) return;

		const currentFiles = selectedFiles;

		// Check file count limit
		if (currentFiles.length + droppedFiles.length > MAX_FILES) {
			const remaining = MAX_FILES - currentFiles.length;
			toast.error(
				`Telnyx MMS limit: Maximum ${MAX_FILES} files allowed. You can add ${remaining} more file${remaining === 1 ? "" : "s"}.`,
			);

			// Take only what fits within the limit
			if (remaining > 0) {
				const filesToAdd = droppedFiles.slice(0, remaining);
				const totalSize = [...currentFiles, ...filesToAdd].reduce(
					(sum, f) => sum + f.size,
					0,
				);

				if (totalSize > MAX_TOTAL_SIZE_BYTES) {
					toast.error(
						`Telnyx MMS limit: Total file size must be under ${MAX_TOTAL_SIZE_MB} MB.`,
					);
					return;
				}

				setSelectedFiles((prev) => [...prev, ...filesToAdd]);
			}
			return;
		}

		// Check total size limit
		const totalSize = [...currentFiles, ...droppedFiles].reduce(
			(sum, f) => sum + f.size,
			0,
		);

		if (totalSize > MAX_TOTAL_SIZE_BYTES) {
			const currentSizeMB = (
				currentFiles.reduce((sum, f) => sum + f.size, 0) /
				1024 /
				1024
			).toFixed(2);
			toast.error(
				`Telnyx MMS limit: Total file size must be under ${MAX_TOTAL_SIZE_MB} MB. Current size: ${currentSizeMB} MB.`,
			);
			return;
		}

		setSelectedFiles((prev) => [...prev, ...droppedFiles]);
	};

	return (
		<div
			className="bg-background relative"
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			{/* Drag overlay */}
			{isDragging && (
				<div className="bg-primary/10 border-primary absolute inset-0 z-50 flex items-center justify-center rounded-lg border-2 border-dashed">
					<div className="text-center">
						<p className="text-primary text-lg font-semibold">
							Drop files here
						</p>
						<p className="text-muted-foreground text-sm">
							Images, videos, and PDFs supported
						</p>
						<p className="text-muted-foreground mt-2 text-xs">
							Max {MAX_FILES} files • {MAX_TOTAL_SIZE_MB} MB total
							{selectedFiles.length > 0 &&
								` • ${MAX_FILES - selectedFiles.length} slots remaining`}
						</p>
					</div>
				</div>
			)}

			{/* Attachment previews */}
			{selectedFiles.length > 0 && (
				<div className="border-t px-4 pt-3 pb-2">
					{/* Warning banner if near limits */}
					{(isNearSizeLimit || isNearCountLimit) && (
						<div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-2">
							<AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
							<div className="flex-1 text-xs">
								<p className="font-medium text-amber-700 dark:text-amber-400">
									Approaching Telnyx MMS limits
								</p>
								<p className="mt-0.5 text-amber-600/80 dark:text-amber-500/80">
									{isNearCountLimit &&
										`${selectedFiles.length}/${MAX_FILES} files`}
									{isNearCountLimit && isNearSizeLimit && " • "}
									{isNearSizeLimit &&
										`${totalFileSizeMB}/${MAX_TOTAL_SIZE_MB} MB`}
								</p>
							</div>
						</div>
					)}

					<div className="flex flex-wrap gap-2">
						{selectedFiles.map((file, index) => (
							<div
								key={index}
								className="group bg-muted relative rounded-lg border p-2 pr-8"
							>
								<div className="flex items-center gap-2">
									{file.type.startsWith("image/") ? (
										<img
											src={URL.createObjectURL(file)}
											alt={file.name}
											className="h-12 w-12 rounded object-cover"
										/>
									) : (
										<div className="bg-background flex h-12 w-12 items-center justify-center rounded">
											<span className="text-xs font-medium">
												{file.name.split(".").pop()?.toUpperCase()}
											</span>
										</div>
									)}
									<div className="min-w-0">
										<p className="max-w-[150px] truncate text-sm font-medium">
											{file.name}
										</p>
										<p className="text-muted-foreground text-xs">
											{(file.size / 1024).toFixed(1)} KB
										</p>
									</div>
								</div>
								<button
									onClick={() => handleRemoveFile(index)}
									className="bg-destructive text-destructive-foreground absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
								>
									<X className="h-3 w-3" />
								</button>
							</div>
						))}
					</div>

					{/* File count and size indicator */}
					<div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
						<span>
							{selectedFiles.length} file{selectedFiles.length === 1 ? "" : "s"}{" "}
							• {totalFileSizeMB} MB
						</span>
						<span className="text-xxs">
							Limit: {MAX_FILES} files, {MAX_TOTAL_SIZE_MB} MB total
						</span>
					</div>
				</div>
			)}

			{/* Template picker toolbar */}
			<div className="flex items-center justify-between gap-2 border-t px-4 py-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 gap-1.5"
							disabled={disabled}
						>
							<Zap className="h-4 w-4" />
							Templates
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-80">
						<DropdownMenuLabel>Quick replies</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() =>
								insertTemplate("Thank you for contacting us! How can we help?")
							}
						>
							<div>
								<div className="font-medium">Greeting</div>
								<div className="text-muted-foreground text-xs">
									Thank you for contacting us! How can we help?
								</div>
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								insertTemplate(
									"We'll get back to you within 24 hours with more information.",
								)
							}
						>
							<div>
								<div className="font-medium">Follow-up</div>
								<div className="text-muted-foreground text-xs">
									We'll get back to you within 24 hours...
								</div>
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								insertTemplate(
									"Your appointment has been scheduled. We'll send you a confirmation shortly.",
								)
							}
						>
							<div>
								<div className="font-medium">Appointment confirmation</div>
								<div className="text-muted-foreground text-xs">
									Your appointment has been scheduled...
								</div>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<div className="text-muted-foreground hidden text-xs sm:block">
					<kbd className="bg-muted rounded px-1.5 py-0.5 text-xxs">Enter</kbd>{" "}
					to send •{" "}
					<kbd className="bg-muted rounded px-1.5 py-0.5 text-xxs">
						Shift+Enter
					</kbd>{" "}
					for new line
				</div>
			</div>

			{/* Multimodal input - no extra padding needed */}
			<MultimodalInput
				value={text}
				onChange={handleChange}
				onSubmit={handleSubmit}
				isLoading={isSending}
				disabled={disabled}
				placeholder={placeholder}
				allowAttachments={true}
				attachmentAccept="image/*,video/*,application/pdf"
				onAttachmentsSelected={handleFilesSelected}
			/>
		</div>
	);
}
