"use client";

/**
 * Admin SMS Panel Component
 *
 * Complete SMS conversation panel combining:
 * - Conversation header with contact info
 * - iPhone-style message bubbles
 * - Message input with emoji picker
 * - Optimistic updates for sent messages
 */

import { useCallback, useState, useTransition } from "react";
import { AdminSmsConversation, type SmsConversation, type SmsMessage } from "./admin-sms-conversation";
import { AdminSmsInput } from "./admin-sms-input";
import { cn } from "@/lib/utils";
import { useAdminCommunicationStore } from "@/lib/stores/admin-communication-store";
import type { AdminCommunication } from "@/types/entities";
import { sendAdminSms } from "@/actions/sms";

type AdminSmsPanelProps = {
	communication: AdminCommunication;
	onMessageSent?: (message: SmsMessage) => void;
	className?: string;
};

// Convert AdminCommunication to SmsConversation format
function toSmsConversation(comm: AdminCommunication): SmsConversation {
	// For demo, create a conversation from the communication
	// In production, this would fetch the full thread from the server
	const messages: SmsMessage[] = [
		{
			id: comm.id,
			direction: comm.direction,
			content: comm.preview || "",
			timestamp: comm.createdAt,
			status: comm.direction === "outbound" ? "delivered" : undefined,
			senderName: comm.direction === "inbound" ? comm.userName : "You",
		},
	];

	return {
		id: comm.id,
		contactName: comm.userName || comm.from || "Unknown",
		contactPhone: comm.direction === "inbound" ? comm.from || "" : comm.to || "",
		companyName: comm.companyName,
		companyId: comm.companyId,
		messages,
		isTyping: false,
	};
}

export function AdminSmsPanel({ communication, onMessageSent, className }: AdminSmsPanelProps) {
	const [messageText, setMessageText] = useState("");
	const [isPending, startTransition] = useTransition();
	const [localMessages, setLocalMessages] = useState<SmsMessage[]>([]);
	const { addPendingMessage, resolvePendingMessage } = useAdminCommunicationStore();

	// Combine original messages with local optimistic messages
	const baseConversation = toSmsConversation(communication);
	const conversation: SmsConversation = {
		...baseConversation,
		messages: [...baseConversation.messages, ...localMessages],
	};

	const handleSend = useCallback(() => {
		if (!messageText.trim() || isPending) return;

		const tempId = `temp_${Date.now()}`;
		const newMessage: SmsMessage = {
			id: tempId,
			direction: "outbound",
			content: messageText.trim(),
			timestamp: new Date().toISOString(),
			status: "sending",
			senderName: "You",
		};

		// Optimistic update - add to local state immediately
		setLocalMessages((prev) => [...prev, newMessage]);
		setMessageText("");

		// Add to pending messages store
		addPendingMessage({
			id: tempId,
			conversationId: communication.id,
			direction: "outbound",
			content: newMessage.content,
			timestamp: newMessage.timestamp,
			status: "sending",
			contactName: conversation.contactName,
			contactPhone: conversation.contactPhone,
			companyId: communication.companyId,
		});

		// Send SMS via Twilio
		startTransition(async () => {
			try {
				// Validate company ID exists
				if (!communication.companyId) {
					throw new Error("No company ID associated with this conversation");
				}

				// Send via Twilio API
				const result = await sendAdminSms({
					companyId: communication.companyId,
					to: conversation.contactPhone,
					body: messageText.trim(),
				});

				if (!result.success) {
					throw new Error(result.error || "Failed to send SMS");
				}

				// Update message status to sent
				setLocalMessages((prev) => prev.map((msg) => (msg.id === tempId ? { ...msg, status: "sent" as const } : msg)));

				// Update to delivered based on Twilio status
				if (result.status === "delivered" || result.status === "sent") {
					setLocalMessages((prev) => prev.map((msg) => (msg.id === tempId ? { ...msg, status: "delivered" as const } : msg)));
				}

				// Resolve pending message in store
				resolvePendingMessage(communication.id, tempId);

				// Notify parent
				onMessageSent?.(newMessage);
			} catch (error) {
				// Mark as failed
				setLocalMessages((prev) => prev.map((msg) => (msg.id === tempId ? { ...msg, status: "failed" as const } : msg)));
				console.error("Failed to send SMS:", error);
			}
		});
	}, [messageText, isPending, communication.id, conversation.contactName, conversation.contactPhone, communication.companyId, addPendingMessage, resolvePendingMessage, onMessageSent]);

	return (
		<div className={cn("flex h-full flex-col", className)}>
			{/* Conversation View */}
			<div className="min-h-0 flex-1">
				<AdminSmsConversation conversation={conversation} />
			</div>

			{/* Input Area */}
			<AdminSmsInput value={messageText} onChange={setMessageText} onSend={handleSend} sending={isPending} placeholder={`Message ${conversation.contactName}...`} />
		</div>
	);
}
