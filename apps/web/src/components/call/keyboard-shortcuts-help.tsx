"use client";

/**
 * Keyboard Shortcuts Help Panel
 *
 * Floating help panel showing all available keyboard shortcuts
 * for the call window. CSRs need to be fast during calls, and
 * keyboard shortcuts are essential for efficiency.
 *
 * Triggered by pressing "?" or clicking the shortcuts icon.
 */

import {
	Calendar,
	FileText,
	Keyboard,
	Mic,
	MicOff,
	Pause,
	Phone,
	PhoneOff,
	Play,
	Plus,
	Square,
	X,
} from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ShortcutCategory = {
	title: string;
	shortcuts: Shortcut[];
};

type Shortcut = {
	keys: string[];
	description: string;
	icon?: React.ReactNode;
	destructive?: boolean;
};

const shortcutCategories: ShortcutCategory[] = [
	{
		title: "Call Controls",
		shortcuts: [
			{
				keys: ["M"],
				description: "Toggle mute/unmute",
				icon: <Mic className="h-3.5 w-3.5" />,
			},
			{
				keys: ["H"],
				description: "Toggle hold/resume",
				icon: <Pause className="h-3.5 w-3.5" />,
			},
			{
				keys: ["R"],
				description: "Toggle recording",
				icon: <Square className="h-3.5 w-3.5" />,
			},
			{
				keys: ["T"],
				description: "Transfer call",
				icon: <Phone className="h-3.5 w-3.5" />,
			},
			{
				keys: ["Shift", "E"],
				description: "End call",
				icon: <PhoneOff className="h-3.5 w-3.5" />,
				destructive: true,
			},
		],
	},
	{
		title: "Quick Actions",
		shortcuts: [
			{
				keys: ["J"],
				description: "Create new job",
				icon: <Plus className="h-3.5 w-3.5" />,
			},
			{
				keys: ["A"],
				description: "Schedule appointment",
				icon: <Calendar className="h-3.5 w-3.5" />,
			},
			{
				keys: ["N"],
				description: "Focus notes field",
				icon: <FileText className="h-3.5 w-3.5" />,
			},
			{
				keys: ["S"],
				description: "Send SMS to customer",
			},
			{
				keys: ["E"],
				description: "Send email to customer",
			},
		],
	},
	{
		title: "Navigation",
		shortcuts: [
			{
				keys: ["1"],
				description: "View transcript panel",
			},
			{
				keys: ["2"],
				description: "View schedule panel",
			},
			{
				keys: ["Tab"],
				description: "Cycle through sections",
			},
			{
				keys: ["Esc"],
				description: "Close dialogs/minimize",
			},
		],
	},
	{
		title: "General",
		shortcuts: [
			{
				keys: ["?"],
				description: "Show this help panel",
				icon: <Keyboard className="h-3.5 w-3.5" />,
			},
			{
				keys: ["Ctrl", "S"],
				description: "Save notes",
			},
			{
				keys: ["Ctrl", "C"],
				description: "Copy selected text",
			},
		],
	},
];

type KeyboardShortcutsHelpProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function KeyboardShortcutsHelp({
	open,
	onOpenChange,
}: KeyboardShortcutsHelpProps) {
	// Close on Escape
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && open) {
				onOpenChange(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, onOpenChange]);

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Keyboard className="h-5 w-5" />
						Keyboard Shortcuts
					</DialogTitle>
					<DialogDescription>
						Use these shortcuts for faster call handling. Press{" "}
						<kbd className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
							?
						</kbd>{" "}
						anytime to show this panel.
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4 grid grid-cols-2 gap-6">
					{shortcutCategories.map((category) => (
						<div className="space-y-3" key={category.title}>
							<h3 className="text-sm font-semibold">{category.title}</h3>
							<div className="space-y-2">
								{category.shortcuts.map((shortcut, index) => (
									<div
										className="flex items-center justify-between rounded-lg border p-2"
										key={index}
									>
										<div className="flex items-center gap-2">
											{shortcut.icon && (
												<span
													className={cn(
														"text-muted-foreground",
														shortcut.destructive && "text-destructive",
													)}
												>
													{shortcut.icon}
												</span>
											)}
											<span
												className={cn(
													"text-sm",
													shortcut.destructive && "text-destructive",
												)}
											>
												{shortcut.description}
											</span>
										</div>
										<div className="flex items-center gap-1">
											{shortcut.keys.map((key, keyIndex) => (
												<span key={keyIndex}>
													<kbd
														className={cn(
															"bg-muted inline-flex min-w-[24px] items-center justify-center rounded px-1.5 py-0.5 font-mono text-xs",
															shortcut.destructive &&
																"bg-destructive/10 text-destructive",
														)}
													>
														{key}
													</kbd>
													{keyIndex < shortcut.keys.length - 1 && (
														<span className="text-muted-foreground mx-0.5 text-xs">
															+
														</span>
													)}
												</span>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				<div className="bg-muted/50 mt-6 rounded-lg border p-4">
					<div className="flex items-start gap-3">
						<div className="bg-primary/10 rounded-full p-2">
							<Keyboard className="text-primary h-4 w-4" />
						</div>
						<div>
							<h4 className="text-sm font-medium">Pro Tips</h4>
							<ul className="text-muted-foreground mt-1 space-y-1 text-xs">
								<li>• Shortcuts only work when the call window is focused</li>
								<li>
									• Use{" "}
									<kbd className="bg-muted rounded px-1 font-mono">Shift+E</kbd>{" "}
									for end call to prevent accidental hangups
								</li>
								<li>
									• Press{" "}
									<kbd className="bg-muted rounded px-1 font-mono">N</kbd> to
									quickly add notes during a call
								</li>
								<li>• The mute indicator turns red when you're muted</li>
							</ul>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

/**
 * Keyboard Shortcuts Button
 *
 * Small button to trigger the shortcuts help panel.
 * Can be placed in the toolbar or header.
 */
type KeyboardShortcutsButtonProps = {
	onClick: () => void;
	className?: string;
};

export function KeyboardShortcutsButton({
	onClick,
	className,
}: KeyboardShortcutsButtonProps) {
	return (
		<Button
			className={cn("h-8 w-8", className)}
			onClick={onClick}
			size="icon"
			title="Keyboard shortcuts (?)"
			variant="ghost"
		>
			<Keyboard className="h-4 w-4" />
		</Button>
	);
}
