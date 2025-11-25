"use client";

/**
 * Smart Call Notes Component
 *
 * Enhanced note-taking for CSRs with:
 * - Quick snippet templates
 * - Auto-save functionality
 * - AI-powered summary generation
 * - Keyboard shortcuts
 * - Character count
 * - Timestamp markers
 */

import {
	AlignLeft,
	Check,
	ChevronDown,
	Clock,
	FileText,
	Loader2,
	RotateCcw,
	Save,
	Sparkles,
	Wand2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type NoteTemplate = {
	id: string;
	label: string;
	text: string;
	category: "greeting" | "hold" | "resolution" | "followup" | "general";
};

type SmartCallNotesProps = {
	value: string;
	onChange: (value: string) => void;
	onSave?: (value: string) => void;
	onGenerateSummary?: () => Promise<string>;
	isGenerating?: boolean;
	autoSave?: boolean;
	autoSaveDelay?: number;
	maxLength?: number;
	placeholder?: string;
	className?: string;
};

const defaultTemplates: NoteTemplate[] = [
	// Greetings
	{
		id: "greeting_standard",
		label: "Standard greeting",
		text: "Greeted customer, verified account.",
		category: "greeting",
	},
	{
		id: "greeting_callback",
		label: "Callback greeting",
		text: "Returning customer's call from earlier today.",
		category: "greeting",
	},

	// Hold messages
	{
		id: "hold_checking",
		label: "Checking system",
		text: "Placed on hold to check system/availability.",
		category: "hold",
	},
	{
		id: "hold_supervisor",
		label: "Consulting supervisor",
		text: "Placed on hold to consult with supervisor.",
		category: "hold",
	},
	{
		id: "hold_pricing",
		label: "Checking pricing",
		text: "Placed on hold to verify pricing.",
		category: "hold",
	},

	// Resolutions
	{
		id: "resolution_scheduled",
		label: "Appointment scheduled",
		text: "Scheduled appointment. Customer confirmed date/time.",
		category: "resolution",
	},
	{
		id: "resolution_quote",
		label: "Quote provided",
		text: "Provided quote. Customer will review and call back.",
		category: "resolution",
	},
	{
		id: "resolution_payment",
		label: "Payment processed",
		text: "Payment processed successfully. Confirmation sent.",
		category: "resolution",
	},
	{
		id: "resolution_info",
		label: "Information provided",
		text: "Provided requested information. No further action needed.",
		category: "resolution",
	},

	// Follow-ups
	{
		id: "followup_callback",
		label: "Callback needed",
		text: "Customer requested callback. Follow-up scheduled.",
		category: "followup",
	},
	{
		id: "followup_email",
		label: "Email to send",
		text: "Will send follow-up email with details.",
		category: "followup",
	},
	{
		id: "followup_manager",
		label: "Manager review",
		text: "Escalated to manager for review. Will follow up.",
		category: "followup",
	},

	// General
	{
		id: "general_voicemail",
		label: "Left voicemail",
		text: "Called customer, no answer. Left voicemail.",
		category: "general",
	},
	{
		id: "general_transferred",
		label: "Call transferred",
		text: "Transferred to appropriate department.",
		category: "general",
	},
];

const categoryLabels: Record<string, string> = {
	greeting: "Greetings",
	hold: "Hold Messages",
	resolution: "Resolutions",
	followup: "Follow-ups",
	general: "General",
};

export function SmartCallNotes({
	value,
	onChange,
	onSave,
	onGenerateSummary,
	isGenerating = false,
	autoSave = true,
	autoSaveDelay = 3000,
	maxLength = 2000,
	placeholder = "Add notes about this call...",
	className,
}: SmartCallNotesProps) {
	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Group templates by category
	const groupedTemplates = defaultTemplates.reduce(
		(acc, template) => {
			if (!acc[template.category]) acc[template.category] = [];
			acc[template.category].push(template);
			return acc;
		},
		{} as Record<string, NoteTemplate[]>,
	);

	// Handle save
	const handleSave = useCallback(async () => {
		if (!onSave || !hasUnsavedChanges) return;

		setIsSaving(true);
		try {
			await onSave(value);
			setLastSaved(new Date());
			setHasUnsavedChanges(false);
		} finally {
			setIsSaving(false);
		}
	}, [onSave, value, hasUnsavedChanges]);

	// Auto-save effect
	useEffect(() => {
		if (!autoSave || !hasUnsavedChanges) return;

		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}

		saveTimeoutRef.current = setTimeout(() => {
			handleSave();
		}, autoSaveDelay);

		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, [autoSave, autoSaveDelay, hasUnsavedChanges, handleSave]);

	// Handle change
	const handleChange = (newValue: string) => {
		if (newValue.length <= maxLength) {
			onChange(newValue);
			setHasUnsavedChanges(true);
		}
	};

	// Insert template
	const insertTemplate = (template: NoteTemplate) => {
		const textarea = textareaRef.current;
		if (!textarea) {
			// Just append if no cursor position
			handleChange(value + (value ? "\n" : "") + template.text);
			return;
		}

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const before = value.substring(0, start);
		const after = value.substring(end);

		// Add newline if not at start and previous char isn't newline
		const prefix = start > 0 && !before.endsWith("\n") ? "\n" : "";
		const newValue = before + prefix + template.text + after;

		handleChange(newValue);

		// Set cursor after inserted text
		setTimeout(() => {
			const newPosition = start + prefix.length + template.text.length;
			textarea.setSelectionRange(newPosition, newPosition);
			textarea.focus();
		}, 0);
	};

	// Insert timestamp
	const insertTimestamp = () => {
		const timestamp = new Date().toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		});
		const marker = `[${timestamp}] `;

		const textarea = textareaRef.current;
		if (!textarea) {
			handleChange(value + (value ? "\n" : "") + marker);
			return;
		}

		const start = textarea.selectionStart;
		const before = value.substring(0, start);
		const after = value.substring(start);

		// Add newline if not at start
		const prefix = start > 0 && !before.endsWith("\n") ? "\n" : "";
		const newValue = before + prefix + marker + after;

		handleChange(newValue);

		// Set cursor after marker
		setTimeout(() => {
			const newPosition = start + prefix.length + marker.length;
			textarea.setSelectionRange(newPosition, newPosition);
			textarea.focus();
		}, 0);
	};

	// Generate AI summary
	const handleGenerateSummary = async () => {
		if (!onGenerateSummary) return;

		const summary = await onGenerateSummary();
		if (summary) {
			handleChange(value + (value ? "\n\n" : "") + "--- AI Summary ---\n" + summary);
		}
	};

	// Format last saved time
	const formatLastSaved = (date: Date): string => {
		const now = new Date();
		const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffSeconds < 5) return "Just saved";
		if (diffSeconds < 60) return `Saved ${diffSeconds}s ago`;
		return `Saved at ${date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		})}`;
	};

	return (
		<TooltipProvider delayDuration={300}>
			<div
				className={cn(
					"border-border/60 bg-card overflow-hidden rounded-xl border shadow-sm",
					className,
				)}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b px-4 py-2">
					<div className="flex items-center gap-2">
						<FileText className="text-muted-foreground h-4 w-4" />
						<span className="text-sm font-semibold">Call Notes</span>
						{hasUnsavedChanges && (
							<Badge variant="outline" className="text-[10px] text-warning">
								Unsaved
							</Badge>
						)}
					</div>

					<div className="flex items-center gap-1">
						{/* Templates dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="h-7 gap-1 px-2 text-xs" size="sm" variant="ghost">
									<AlignLeft className="h-3 w-3" />
									Templates
									<ChevronDown className="h-3 w-3" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								{Object.entries(groupedTemplates).map(
									([category, templates], index) => (
										<div key={category}>
											{index > 0 && <DropdownMenuSeparator />}
											<div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
												{categoryLabels[category]}
											</div>
											{templates.map((template) => (
												<DropdownMenuItem
													key={template.id}
													onClick={() => insertTemplate(template)}
												>
													{template.label}
												</DropdownMenuItem>
											))}
										</div>
									),
								)}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Timestamp button */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className="h-7 w-7"
									onClick={insertTimestamp}
									size="icon"
									variant="ghost"
								>
									<Clock className="h-3.5 w-3.5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Insert timestamp</TooltipContent>
						</Tooltip>

						{/* AI Summary button */}
						{onGenerateSummary && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										className="h-7 w-7"
										onClick={handleGenerateSummary}
										size="icon"
										variant="ghost"
										disabled={isGenerating}
									>
										{isGenerating ? (
											<Loader2 className="h-3.5 w-3.5 animate-spin" />
										) : (
											<Wand2 className="h-3.5 w-3.5" />
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>Generate AI summary</TooltipContent>
							</Tooltip>
						)}

						{/* Save button */}
						{onSave && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										className="h-7 w-7"
										onClick={handleSave}
										size="icon"
										variant="ghost"
										disabled={isSaving || !hasUnsavedChanges}
									>
										{isSaving ? (
											<Loader2 className="h-3.5 w-3.5 animate-spin" />
										) : (
											<Save className="h-3.5 w-3.5" />
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>Save notes (Ctrl+S)</TooltipContent>
							</Tooltip>
						)}
					</div>
				</div>

				{/* Textarea */}
				<div className="relative">
					<Textarea
						ref={textareaRef}
						className="min-h-[150px] resize-none rounded-none border-0 focus-visible:ring-0"
						placeholder={placeholder}
						value={value}
						onChange={(e) => handleChange(e.target.value)}
						onKeyDown={(e) => {
							// Save on Ctrl+S
							if ((e.ctrlKey || e.metaKey) && e.key === "s") {
								e.preventDefault();
								handleSave();
							}
						}}
					/>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between border-t px-3 py-1.5">
					<div className="flex items-center gap-2">
						{lastSaved && (
							<span className="text-muted-foreground text-[10px]">
								{formatLastSaved(lastSaved)}
							</span>
						)}
					</div>
					<span
						className={cn(
							"text-[10px]",
							value.length > maxLength * 0.9
								? "text-destructive"
								: "text-muted-foreground",
						)}
					>
						{value.length}/{maxLength}
					</span>
				</div>
			</div>
		</TooltipProvider>
	);
}

/**
 * Floating Quick Notes
 *
 * Minimal note-taking that floats over the call window
 */
type FloatingNotesProps = {
	value: string;
	onChange: (value: string) => void;
	className?: string;
};

export function FloatingNotes({ value, onChange, className }: FloatingNotesProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div
			className={cn(
				"bg-card/95 rounded-xl border shadow-lg backdrop-blur-sm transition-all",
				isExpanded ? "w-80" : "w-auto",
				className,
			)}
		>
			{isExpanded ? (
				<div className="p-3">
					<div className="mb-2 flex items-center justify-between">
						<span className="text-xs font-medium">Quick Notes</span>
						<Button
							className="h-6 w-6"
							onClick={() => setIsExpanded(false)}
							size="icon"
							variant="ghost"
						>
							<ChevronDown className="h-3 w-3" />
						</Button>
					</div>
					<Textarea
						className="min-h-[100px] resize-none text-sm"
						placeholder="Quick notes..."
						value={value}
						onChange={(e) => onChange(e.target.value)}
					/>
				</div>
			) : (
				<Button
					className="gap-2"
					onClick={() => setIsExpanded(true)}
					variant="ghost"
				>
					<FileText className="h-4 w-4" />
					Notes
					{value && (
						<Badge variant="secondary" className="text-[10px]">
							{value.split("\n").length}
						</Badge>
					)}
				</Button>
			)}
		</div>
	);
}
