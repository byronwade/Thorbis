"use client";

/**
 * QuickNoteInput - Inline note entry with expandable input
 *
 * Provides quick note adding capability at the bottom of detail pages
 * with real-time save without page reload.
 */

import { Loader2, Plus, Send, StickyNote, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type QuickNoteInputProps = {
	/** Entity ID to attach note to */
	entityId: string;
	/** Entity type */
	entityType: "job" | "invoice" | "estimate" | "contract" | "appointment" | "customer" | "property" | "equipment" | "vendor";
	/** Server action to create note */
	onAddNote: (data: {
		entityId: string;
		entityType: string;
		content: string;
	}) => Promise<{ success: boolean; error?: string; noteId?: string }>;
	/** Placeholder text */
	placeholder?: string;
	/** Additional className */
	className?: string;
};

export function QuickNoteInput({
	entityId,
	entityType,
	onAddNote,
	placeholder = "Add a quick note...",
	className,
}: QuickNoteInputProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [isExpanded, setIsExpanded] = useState(false);
	const [noteContent, setNoteContent] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleExpand = () => {
		setIsExpanded(true);
		// Focus textarea after expanding
		setTimeout(() => {
			textareaRef.current?.focus();
		}, 100);
	};

	const handleCancel = () => {
		setIsExpanded(false);
		setNoteContent("");
	};

	const handleSubmit = () => {
		if (!noteContent.trim()) {
			toast.error("Please enter a note");
			return;
		}

		startTransition(async () => {
			try {
				const result = await onAddNote({
					entityId,
					entityType,
					content: noteContent.trim(),
				});

				if (result.success) {
					toast.success("Note added successfully");
					setNoteContent("");
					setIsExpanded(false);
					router.refresh();
				} else {
					toast.error(result.error || "Failed to add note");
				}
			} catch (error) {
				toast.error("An error occurred while adding note");
				console.error("Note add error:", error);
			}
		});
	};

	// Handle keyboard shortcuts
	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Cmd/Ctrl + Enter to submit
		if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
			e.preventDefault();
			handleSubmit();
		}
		// Escape to cancel
		if (e.key === "Escape") {
			handleCancel();
		}
	};

	if (!isExpanded) {
		return (
			<Button
				className={cn("w-full justify-start gap-2 text-muted-foreground", className)}
				onClick={handleExpand}
				variant="outline"
			>
				<Plus className="size-4" />
				<span>{placeholder}</span>
			</Button>
		);
	}

	return (
		<div className={cn("space-y-2", className)}>
			<div className="relative">
				<Textarea
					className="min-h-[80px] pr-10 resize-none"
					disabled={isPending}
					onChange={(e) => setNoteContent(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					ref={textareaRef}
					value={noteContent}
				/>
				<Button
					className="absolute right-2 top-2"
					onClick={handleCancel}
					size="icon"
					type="button"
					variant="ghost"
				>
					<X className="size-4" />
					<span className="sr-only">Cancel</span>
				</Button>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-xs">
					Press <kbd className="bg-muted rounded px-1.5 py-0.5 text-xs">⌘ Enter</kbd> to save
				</p>
				<div className="flex items-center gap-2">
					<Button
						onClick={handleCancel}
						size="sm"
						type="button"
						variant="ghost"
					>
						Cancel
					</Button>
					<Button
						disabled={isPending || !noteContent.trim()}
						onClick={handleSubmit}
						size="sm"
						type="button"
					>
						{isPending ? (
							<>
								<Loader2 className="mr-2 size-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Send className="mr-2 size-4" />
								Add Note
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}

/**
 * QuickNoteButton - Compact button that opens note dialog
 */
export function QuickNoteButton({
	entityId,
	entityType,
	onAddNote,
	className,
	size = "sm",
}: {
	entityId: string;
	entityType: string;
	onAddNote: (data: {
		entityId: string;
		entityType: string;
		content: string;
	}) => Promise<{ success: boolean; error?: string }>;
	className?: string;
	size?: "sm" | "default" | "lg" | "icon";
}) {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);
	const [noteContent, setNoteContent] = useState("");

	const handleSubmit = () => {
		if (!noteContent.trim()) {
			toast.error("Please enter a note");
			return;
		}

		startTransition(async () => {
			try {
				const result = await onAddNote({
					entityId,
					entityType,
					content: noteContent.trim(),
				});

				if (result.success) {
					toast.success("Note added");
					setNoteContent("");
					setIsOpen(false);
					router.refresh();
				} else {
					toast.error(result.error || "Failed to add note");
				}
			} catch (error) {
				toast.error("An error occurred");
				console.error("Note add error:", error);
			}
		});
	};

	return (
		<>
			<Button
				className={cn("gap-1.5", className)}
				onClick={() => setIsOpen(true)}
				size={size}
				variant="outline"
			>
				<StickyNote className="size-4" />
				<span className="hidden sm:inline">Note</span>
			</Button>

			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
					<div className="bg-background w-full max-w-md rounded-lg p-4 shadow-lg">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="font-semibold">Add Note</h3>
							<Button
								onClick={() => setIsOpen(false)}
								size="icon"
								variant="ghost"
							>
								<X className="size-4" />
							</Button>
						</div>
						<Textarea
							autoFocus
							className="min-h-[100px]"
							disabled={isPending}
							onChange={(e) => setNoteContent(e.target.value)}
							placeholder="Write your note..."
							value={noteContent}
						/>
						<div className="mt-4 flex justify-end gap-2">
							<Button
								onClick={() => setIsOpen(false)}
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								disabled={isPending || !noteContent.trim()}
								onClick={handleSubmit}
							>
								{isPending ? (
									<Loader2 className="mr-2 size-4 animate-spin" />
								) : (
									<Send className="mr-2 size-4" />
								)}
								Add Note
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
