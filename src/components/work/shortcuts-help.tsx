"use client";

import { Keyboard } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

/**
 * Shortcuts Help Dialog
 *
 * Displays all available keyboard shortcuts
 * Triggered by Cmd/Ctrl + /
 */

type ShortcutsHelpProps = {
	isOpen: boolean;
	onClose: () => void;
};

const SHORTCUTS = [
	{
		category: "General",
		shortcuts: [
			{ keys: ["⌘", "S"], description: "Save job" },
			{ keys: ["⌘", "K"], description: "Focus customer search" },
			{ keys: ["⌘", "/"], description: "Show shortcuts" },
			{ keys: ["Esc"], description: "Cancel / Go back" },
		],
	},
	{
		category: "Templates",
		shortcuts: [
			{ keys: ["Alt", "1"], description: "HVAC Maintenance" },
			{ keys: ["Alt", "2"], description: "Emergency Repair" },
			{ keys: ["Alt", "3"], description: "New Installation" },
			{ keys: ["Alt", "4"], description: "System Inspection" },
			{ keys: ["Alt", "5"], description: "Consultation" },
			{ keys: ["Alt", "6"], description: "Seasonal Service" },
		],
	},
	{
		category: "Navigation",
		shortcuts: [
			{ keys: ["Tab"], description: "Next field" },
			{ keys: ["Shift", "Tab"], description: "Previous field" },
			{ keys: ["⌘", "↑"], description: "Scroll to top" },
			{ keys: ["⌘", "↓"], description: "Scroll to bottom" },
		],
	},
	{
		category: "Scheduling",
		shortcuts: [
			{ keys: ["⌘", "T"], description: "Set to today" },
			{ keys: ["⌘", "D"], description: "Set to tomorrow" },
			{ keys: ["1"], description: "15 min duration (when focused)" },
			{ keys: ["2"], description: "30 min duration (when focused)" },
			{ keys: ["3"], description: "1 hour duration (when focused)" },
			{ keys: ["4"], description: "2 hours duration (when focused)" },
		],
	},
];

export function ShortcutsHelp({ isOpen, onClose }: ShortcutsHelpProps) {
	const isMac = typeof navigator !== "undefined" && navigator.platform.includes("Mac");

	const formatKey = (key: string) => {
		if (key === "⌘" && !isMac) {
			return "Ctrl";
		}
		return key;
	};

	return (
		<Dialog onOpenChange={onClose} open={isOpen}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Keyboard className="size-5" />
						Keyboard Shortcuts
					</DialogTitle>
					<DialogDescription>
						Speed up your workflow with these keyboard shortcuts
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 md:grid-cols-2">
					{SHORTCUTS.map((category) => (
						<div className="space-y-3" key={category.category}>
							<h4 className="text-sm font-semibold">{category.category}</h4>
							<div className="space-y-2">
								{category.shortcuts.map((shortcut, index) => (
									<div className="flex items-center justify-between text-sm" key={index}>
										<span className="text-muted-foreground">{shortcut.description}</span>
										<div className="flex items-center gap-1">
											{shortcut.keys.map((key, keyIndex) => (
												<span className="flex items-center" key={keyIndex}>
													<kbd className="bg-muted pointer-events-none inline-flex h-6 items-center gap-1 rounded border px-2 font-mono text-xs font-medium select-none">
														{formatKey(key)}
													</kbd>
													{keyIndex < shortcut.keys.length - 1 && (
														<span className="text-muted-foreground mx-1">+</span>
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

				<div className="bg-muted mt-4 rounded-lg p-4">
					<p className="text-muted-foreground text-sm">
						<strong>Pro tip:</strong> Use Tab to quickly move between fields. Press{" "}
						{isMac ? "⌘" : "Ctrl"} + K to instantly jump to customer search from anywhere in the
						form.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
