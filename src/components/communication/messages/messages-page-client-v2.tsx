"use client";

/**
 * Messages Page Client V2 - Client wrapper for new messaging UI
 *
 * Responsibilities:
 * - Initialize Zustand stores with server data
 * - Handle real-time Supabase subscriptions
 * - Manage message sending
 * - Coordinate between layout and stores
 */

import { useEffect, useState, useTransition } from "react";
import { sendMMSMessage, sendTextMessage } from "@/actions/telnyx";
import {
	useDesktopNotifications,
	useUnreadBadge,
} from "@/hooks/use-desktop-notifications";
import { useToast } from "@/hooks/use-toast";
import { uploadCompanyFile } from "@/lib/storage/upload";
import type { SmsThread } from "@/lib/stores/messages-store";
import { useMessagesStore } from "@/lib/stores/messages-store";
import { useTeamPresenceStore } from "@/lib/stores/team-presence-store";
import { createClient } from "@/lib/supabase/client";
import { MessagesLayout } from "./client/messages-layout";

interface MessagesPageClientV2Props {
	companyId: string;
	initialThreads: SmsThread[];
	companyPhones: Array<{
		id: string;
		number: string;
		label: string;
		status: string;
	}>;
	teamMembers: Array<{
		id: string;
		userId: string;
		name: string;
		email: string;
		avatarUrl: string | null;
		status: string;
	}>;
	initialThreadId: string | null;
}

export function MessagesPageClientV2({
	companyId,
	initialThreads,
	companyPhones,
	teamMembers,
	initialThreadId,
}: MessagesPageClientV2Props) {
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	// Notifications
	const { showNotification, soundEnabled, toggleSound, requestPermission } =
		useDesktopNotifications();
	const { updateBadge } = useUnreadBadge();

	// Initialize stores
	const { setThreads, selectThread, addMessageToThread } = useMessagesStore();
	const { setCurrentUser } = useTeamPresenceStore();

	// Get threads for unread count
	const threads = useMessagesStore((state) => state.threads);

	// Initialize threads on mount
	useEffect(() => {
		setThreads(initialThreads);
		if (initialThreadId) {
			selectThread(initialThreadId);
		}
	}, [setThreads, selectThread, initialThreads, initialThreadId]);

	// Update unread badge
	useEffect(() => {
		const unreadCount = threads.reduce(
			(sum, thread) => sum + thread.unreadCount,
			0,
		);
		updateBadge(unreadCount);
	}, [threads, updateBadge]);

	// Request notification permission on mount
	useEffect(() => {
		// Request after a short delay to avoid interrupting initial page load
		const timer = setTimeout(() => {
			requestPermission();
		}, 2000);

		return () => clearTimeout(timer);
	}, [requestPermission]);

	// Set up real-time subscriptions
	useEffect(() => {
		const supabase = createClient();

		// Subscribe to new messages
		const channel = supabase
			.channel(`messages:${companyId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "communications",
					filter: `company_id=eq.${companyId}`,
				},
				(payload) => {
					const newMessage = payload.new as any;

					// Determine thread ID (use thread_id or derive from phone number)
					const threadId = newMessage.thread_id || newMessage.from_address;

					if (threadId) {
						// Add message to thread
						addMessageToThread(threadId, newMessage);

						// Show notification for inbound messages (not from current user)
						if (newMessage.direction === "inbound") {
							// Find the thread to get customer name
							const thread = useMessagesStore
								.getState()
								.threads.find((t) => t.threadId === threadId);

							showNotification({
								title: thread?.remoteName || "New Message",
								body: newMessage.body || "New message received",
								tag: threadId,
								onClick: () => {
									selectThread(threadId);
								},
							});
						}
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [companyId, addMessageToThread]);

	// Handle sending messages
	const handleSendMessage = async (
		threadId: string,
		text: string,
		files: File[],
	) => {
		const threads = useMessagesStore.getState().threads;
		const thread = threads.find((t) => t.threadId === threadId);
		if (!thread) {
			toast.error("Thread not found");
			return;
		}

		// Get company phone (use first available for now)
		const fromPhone = companyPhones[0]?.number;
		if (!fromPhone) {
			toast.error("No company phone number available");
			return;
		}

		const toPhone = thread.remotePhoneNumber;

		startTransition(async () => {
			try {
				let result;

				if (files.length > 0) {
					// Handle MMS with attachments
					const uploadPromises = files.map((file) =>
						uploadCompanyFile(file, companyId, "sms-attachments"),
					);

					const uploadResults = await Promise.all(uploadPromises);
					const attachmentUrls = uploadResults
						.filter((r): r is { url: string; path: string } => r !== null)
						.map((r) => r.url);

					result = await sendMMSMessage({
						from: fromPhone,
						to: toPhone,
						text,
						mediaUrls: attachmentUrls,
						companyId,
						customerId: thread.customerId || undefined,
					});
				} else {
					// Send SMS
					result = await sendTextMessage({
						from: fromPhone,
						to: toPhone,
						text,
						companyId,
						customerId: thread.customerId || undefined,
					});
				}

				if (result && !result.success) {
					const errorMsg =
						typeof result.error === "string"
							? result.error
							: "Failed to send message";
					toast.error(errorMsg);
					return;
				}

				toast.success("Message sent successfully");
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "An error occurred";
				toast.error(errorMessage);
			}
		});
	};

	return (
		<div className="h-full">
			<MessagesLayout
				currentUserId={currentUserId}
				onSendMessage={handleSendMessage}
				soundEnabled={soundEnabled}
				onToggleSound={toggleSound}
			/>
		</div>
	);
}
