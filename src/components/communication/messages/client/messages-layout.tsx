"use client";

/**
 * Messages Layout - Main orchestrator component
 *
 * Clean Slack-inspired 3-column layout:
 * - Thread list (left, 280px)
 * - Conversation view (center, flex-1)
 * - Customer panel (right, 320px, toggleable)
 *
 * Mobile: Single column with view switching
 */

import { ArrowLeft, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useMessageUIStore } from "@/lib/stores/message-ui-store";
import { useMessagesStore } from "@/lib/stores/messages-store";
import { cn } from "@/lib/utils";
import { ConversationHeader } from "./conversation/conversation-header";
import { ConversationView } from "./conversation/conversation-view";
import { MessageInputV2 } from "./conversation/message-input-v2";
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog";
import { ThreadHeader } from "./thread-list/thread-header";
import { ThreadList } from "./thread-list/thread-list";

interface MessagesLayoutProps {
	currentUserId?: string | null;
	onSendMessage: (
		threadId: string,
		text: string,
		files: File[],
	) => Promise<void>;
	soundEnabled?: boolean;
	onToggleSound?: () => void;
}

export function MessagesLayout({
	currentUserId,
	onSendMessage,
	soundEnabled,
	onToggleSound,
}: MessagesLayoutProps) {
	const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);

	// UI state
	const {
		activeView,
		setActiveView,
		isCustomerPanelOpen,
		toggleCustomerPanel,
		isMobile,
		setIsMobile,
		mobileView,
		setMobileView,
	} = useMessageUIStore();

	// Messages state
	const selectedThreadId = useMessagesStore((state) => state.selectedThreadId);
	const selectThread = useMessagesStore((state) => state.selectThread);
	const updateThread = useMessagesStore((state) => state.updateThread);
	const threads = useMessagesStore((state) => state.threads);

	// Get selected thread from threads array
	const selectedThread = selectedThreadId
		? threads.find((t) => t.threadId === selectedThreadId) || null
		: null;

	// Responsive detection
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [setIsMobile]);

	// Handle thread selection
	const handleThreadSelect = (threadId: string) => {
		selectThread(threadId);

		// On mobile, switch to conversation view
		if (isMobile) {
			setMobileView("conversation");
		}
	};

	// Handle back button (mobile)
	const handleBack = () => {
		if (mobileView === "conversation") {
			setMobileView("list");
			selectThread(null);
		} else if (mobileView === "panel") {
			setMobileView("conversation");
		}
	};

	// Handle status change
	const handleStatusChange = (
		status: "open" | "pending" | "resolved" | "snoozed",
	) => {
		if (selectedThreadId) {
			updateThread(selectedThreadId, { status });
		}
	};

	// Handle priority change
	const handlePriorityChange = (
		priority: "low" | "normal" | "high" | "urgent",
	) => {
		if (selectedThreadId) {
			updateThread(selectedThreadId, { priority });
		}
	};

	// Handle archive
	const handleArchive = () => {
		// TODO: Implement archive functionality
		console.log("Archive thread:", selectedThreadId);
	};

	// Handle assignment
	const handleAssignClick = () => {
		// TODO: Open assignment dialog
		console.log("Assign thread:", selectedThreadId);
	};

	// Keyboard shortcuts
	useKeyboardShortcuts([
		{
			key: "k",
			ctrl: true,
			callback: () => setSearchFocused(true),
			description: "Search conversations",
		},
		{
			key: "?",
			shift: true,
			callback: () => setShowShortcutsDialog(true),
			description: "Show keyboard shortcuts",
		},
		{
			key: "Escape",
			callback: () => {
				if (selectedThreadId && !isMobile) {
					selectThread(null);
				}
			},
			description: "Close conversation",
		},
		{
			key: "e",
			callback: () => {
				if (selectedThreadId) {
					updateThread(selectedThreadId, { status: "open" });
				}
			},
			description: "Mark as read",
		},
		{
			key: "u",
			callback: () => {
				if (selectedThreadId) {
					updateThread(selectedThreadId, { status: "pending" });
				}
			},
			description: "Mark as unread",
		},
		{
			key: "a",
			callback: handleArchive,
			description: "Archive conversation",
		},
		{
			key: "r",
			callback: () => handleStatusChange("resolved"),
			description: "Mark as resolved",
		},
		{
			key: "1",
			callback: () => setActiveView("inbox"),
			description: "View Inbox",
		},
		{
			key: "2",
			callback: () => setActiveView("unassigned"),
			description: "View Unassigned",
		},
		{
			key: "3",
			callback: () => setActiveView("assigned"),
			description: "View My Tasks",
		},
		{
			key: "4",
			callback: () => setActiveView("resolved"),
			description: "View Resolved",
		},
		{
			key: "5",
			callback: () => setActiveView("snoozed"),
			description: "View Snoozed",
		},
	]);

	// Mobile layout
	if (isMobile) {
		return (
			<div className="flex flex-col h-full bg-background">
				{/* Mobile header */}
				{mobileView !== "list" && (
					<div className="border-b px-4 py-3 flex items-center gap-3">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleBack}
							className="h-8 w-8 p-0"
						>
							<ArrowLeft className="h-4 w-4" />
							<span className="sr-only">Back</span>
						</Button>
						<h2 className="font-semibold">
							{mobileView === "conversation"
								? selectedThread?.remoteName || "Conversation"
								: "Details"}
						</h2>
					</div>
				)}

				{/* Mobile views */}
				{mobileView === "list" && (
					<>
						<ThreadHeader
							activeView={activeView}
							onViewChange={setActiveView}
							soundEnabled={soundEnabled}
							onToggleSound={onToggleSound}
						/>
						<div className="flex-1 overflow-hidden">
							<ThreadList
								currentUserId={currentUserId}
								onThreadSelect={handleThreadSelect}
							/>
						</div>
					</>
				)}

				{mobileView === "conversation" && selectedThread && (
					<>
						<ConversationHeader
							thread={selectedThread}
							onAssignClick={handleAssignClick}
							onStatusChange={handleStatusChange}
							onPriorityChange={handlePriorityChange}
							onArchive={handleArchive}
						/>
						<div className="flex-1 overflow-hidden">
							<ConversationView threadId={selectedThread.threadId} />
						</div>
						<MessageInputV2
							threadId={selectedThread.threadId}
							onSend={(text, files) =>
								onSendMessage(selectedThread.threadId, text, files)
							}
						/>
					</>
				)}
			</div>
		);
	}

	// Desktop layout (3-column)
	return (
		<div className="flex h-full bg-background">
			{/* Left sidebar - Thread list */}
			<div className="w-[280px] border-r flex flex-col flex-shrink-0">
				<ThreadHeader
					activeView={activeView}
					onViewChange={setActiveView}
					soundEnabled={soundEnabled}
					onToggleSound={onToggleSound}
				/>
				<div className="flex-1 overflow-hidden">
					<ThreadList
						currentUserId={currentUserId}
						onThreadSelect={handleThreadSelect}
					/>
				</div>
			</div>

			{/* Center - Conversation */}
			<div className="flex-1 flex flex-col min-w-0">
				{selectedThread ? (
					<>
						<ConversationHeader
							thread={selectedThread}
							onAssignClick={handleAssignClick}
							onStatusChange={handleStatusChange}
							onPriorityChange={handlePriorityChange}
							onArchive={handleArchive}
						/>
						<div className="flex-1 overflow-hidden">
							<ConversationView threadId={selectedThread.threadId} />
						</div>
						<MessageInputV2
							threadId={selectedThread.threadId}
							onSend={(text, files) =>
								onSendMessage(selectedThread.threadId, text, files)
							}
						/>
					</>
				) : (
					<div className="flex-1 flex items-center justify-center text-center p-8">
						<div>
							<h2 className="text-2xl font-semibold mb-2">
								Select a conversation
							</h2>
							<p className="text-muted-foreground">
								Choose a conversation from the list to start messaging
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Right sidebar - Customer panel (toggleable) */}
			{isCustomerPanelOpen && selectedThread && (
				<div className="w-[320px] border-l flex flex-col flex-shrink-0">
					<div className="border-b px-4 py-3 flex items-center justify-between">
						<h3 className="font-semibold">Customer Info</h3>
						<Button
							variant="ghost"
							size="sm"
							onClick={toggleCustomerPanel}
							className="h-8 w-8 p-0"
						>
							<PanelRightClose className="h-4 w-4" />
							<span className="sr-only">Close panel</span>
						</Button>
					</div>
					<div className="flex-1 overflow-y-auto p-4">
						<div className="space-y-4">
							<div>
								<p className="text-sm font-medium mb-1">Phone</p>
								<p className="text-sm text-muted-foreground">
									{selectedThread.remotePhoneNumber}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium mb-1">Status</p>
								<p className="text-sm text-muted-foreground capitalize">
									{selectedThread.status}
								</p>
							</div>
							<div>
								<p className="text-sm font-medium mb-1">Priority</p>
								<p className="text-sm text-muted-foreground capitalize">
									{selectedThread.priority}
								</p>
							</div>
							{selectedThread.assignedToName && (
								<div>
									<p className="text-sm font-medium mb-1">Assigned to</p>
									<p className="text-sm text-muted-foreground">
										{selectedThread.assignedToName}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Toggle panel button (when closed) */}
			{!isCustomerPanelOpen && selectedThread && (
				<div className="border-l w-12 flex items-center justify-center">
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleCustomerPanel}
						className="h-8 w-8 p-0"
					>
						<PanelRightOpen className="h-4 w-4" />
						<span className="sr-only">Open panel</span>
					</Button>
				</div>
			)}

			{/* Keyboard Shortcuts Dialog */}
			<KeyboardShortcutsDialog
				open={showShortcutsDialog}
				onOpenChange={setShowShortcutsDialog}
			/>
		</div>
	);
}
