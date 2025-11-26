"use client";

import { AdminUnifiedInbox } from "@/components/communication/admin-unified-inbox";
import type { AdminCommunication } from "@/types/entities";

// Mock data for development - replace with real data fetching
const mockSmsMessages: AdminCommunication[] = [
	{
		id: "sms_1",
		type: "sms",
		direction: "inbound",
		preview: "Hey, the app is showing an error when I try to create a new job. Can someone help?",
		from: "+1 (555) 234-5678",
		to: "+1 (800) 555-0199",
		companyId: "2",
		companyName: "Elite HVAC Services",
		status: "unread",
		createdAt: "2024-11-11T10:15:00Z",
	},
	{
		id: "sms_2",
		type: "sms",
		direction: "outbound",
		preview: "Your trial period ends in 3 days. To continue using Stratos, please select a subscription plan.",
		from: "+1 (800) 555-0199",
		to: "+1 (555) 567-8901",
		companyId: "3",
		companyName: "Quick Fix Electric",
		status: "sent",
		createdAt: "2024-11-10T08:00:00Z",
	},
	{
		id: "sms_3",
		type: "sms",
		direction: "inbound",
		preview: "Thanks for the quick response! I'll try that now.",
		from: "+1 (555) 345-6789",
		to: "+1 (800) 555-0199",
		companyId: "1",
		companyName: "Acme Plumbing Co.",
		status: "read",
		createdAt: "2024-11-09T16:30:00Z",
	},
	{
		id: "sms_4",
		type: "sms",
		direction: "outbound",
		preview: "Hi! Your scheduled maintenance reminder is coming up tomorrow at 9 AM.",
		from: "+1 (800) 555-0199",
		to: "+1 (555) 456-7890",
		companyId: "4",
		companyName: "Johnson & Sons Roofing",
		status: "delivered",
		createdAt: "2024-11-09T14:00:00Z",
	},
	{
		id: "sms_5",
		type: "sms",
		direction: "inbound",
		preview: "Can you help me reset my password? I can't log in to the dashboard.",
		from: "+1 (555) 678-9012",
		to: "+1 (800) 555-0199",
		companyId: "5",
		companyName: "Metro Landscaping",
		status: "read",
		createdAt: "2024-11-08T11:45:00Z",
	},
];

/**
 * SMS Page
 *
 * Shows all SMS communications across the platform
 */
export default function SmsPage() {
	return (
		<AdminUnifiedInbox
			communications={mockSmsMessages}
			onRefresh={() => {
				console.log("Refreshing SMS messages...");
			}}
		/>
	);
}
