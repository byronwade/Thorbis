"use client";

/**
 * Keyboard Shortcuts Help Dialog
 *
 * Shows available keyboard shortcuts for messaging
 */

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KeyboardShortcutsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const shortcuts = [
	{
		category: "Navigation",
		items: [
			{ keys: ["⌘", "K"], description: "Search conversations" },
			{ keys: ["↑"], description: "Previous conversation" },
			{ keys: ["↓"], description: "Next conversation" },
			{ keys: ["Enter"], description: "Open selected conversation" },
			{ keys: ["Esc"], description: "Close conversation" },
		],
	},
	{
		category: "Actions",
		items: [
			{ keys: ["E"], description: "Mark as read" },
			{ keys: ["U"], description: "Mark as unread" },
			{ keys: ["A"], description: "Archive conversation" },
			{ keys: ["Z"], description: "Snooze conversation" },
			{ keys: ["T"], description: "Assign to team member" },
			{ keys: ["R"], description: "Mark as resolved" },
		],
	},
	{
		category: "Messaging",
		items: [
			{ keys: ["⌘", "Enter"], description: "Send message" },
			{ keys: ["Shift", "Enter"], description: "New line" },
			{ keys: ["⌘", "B"], description: "Bold text" },
			{ keys: ["⌘", "I"], description: "Italic text" },
		],
	},
	{
		category: "View",
		items: [
			{ keys: ["1"], description: "View Inbox" },
			{ keys: ["2"], description: "View Unassigned" },
			{ keys: ["3"], description: "View My Tasks" },
			{ keys: ["4"], description: "View Resolved" },
			{ keys: ["5"], description: "View Snoozed" },
		],
	},
	{
		category: "Help",
		items: [{ keys: ["?"], description: "Show this help dialog" }],
	},
];

export function KeyboardShortcutsDialog({
	open,
	onOpenChange,
}: KeyboardShortcutsDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Keyboard Shortcuts</DialogTitle>
					<DialogDescription>
						Navigate faster with these keyboard shortcuts
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[500px] pr-4">
					<div className="space-y-6">
						{shortcuts.map((category) => (
							<div key={category.category}>
								<h3 className="mb-3 text-sm font-semibold">
									{category.category}
								</h3>
								<div className="space-y-2">
									{category.items.map((item, index) => (
										<div
											key={index}
											className="hover:bg-muted/50 flex items-center justify-between rounded-lg px-3 py-2"
										>
											<span className="text-muted-foreground text-sm">
												{item.description}
											</span>
											<div className="flex items-center gap-1">
												{item.keys.map((key, keyIndex) => (
													<kbd
														key={keyIndex}
														className="bg-muted border-border rounded border px-2 py-1 text-xs font-semibold"
													>
														{key}
													</kbd>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</ScrollArea>

				<div className="text-muted-foreground border-t pt-4 text-center text-xs">
					Press <kbd className="bg-muted rounded px-1.5 py-0.5">?</kbd> anytime
					to show this dialog
				</div>
			</DialogContent>
		</Dialog>
	);
}
