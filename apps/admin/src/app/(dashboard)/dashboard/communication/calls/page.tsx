"use client";

import { AdminUnifiedInbox } from "@/components/communication/admin-unified-inbox";
import type { AdminCommunication } from "@/types/entities";

// Mock data for development - replace with real data fetching
const mockCalls: AdminCommunication[] = [
	{
		id: "call_1",
		type: "call",
		direction: "inbound",
		from: "+1 (555) 123-4567",
		to: "+1 (800) 555-0199",
		duration: 345,
		companyId: "1",
		companyName: "Acme Plumbing Co.",
		status: "read",
		createdAt: "2024-11-11T10:15:00Z",
	},
	{
		id: "call_2",
		type: "call",
		direction: "outbound",
		from: "+1 (800) 555-0199",
		to: "+1 (555) 234-5678",
		duration: 120,
		companyId: "2",
		companyName: "Elite HVAC Services",
		status: "read",
		createdAt: "2024-11-11T09:45:00Z",
	},
	{
		id: "call_3",
		type: "call",
		direction: "inbound",
		from: "+1 (555) 345-6789",
		to: "+1 (800) 555-0199",
		companyId: "3",
		companyName: "Quick Fix Electric",
		status: "read",
		createdAt: "2024-11-11T09:30:00Z",
	},
	{
		id: "call_4",
		type: "voicemail",
		direction: "inbound",
		from: "+1 (555) 456-7890",
		to: "+1 (800) 555-0199",
		duration: 45,
		recordingUrl: "https://recordings.example.com/call_4.mp3",
		companyId: "4",
		companyName: "Johnson & Sons Roofing",
		status: "new",
		createdAt: "2024-11-10T17:20:00Z",
	},
	{
		id: "call_5",
		type: "call",
		direction: "outbound",
		from: "+1 (800) 555-0199",
		to: "+1 (555) 567-8901",
		companyId: "5",
		companyName: "Metro Landscaping",
		status: "read",
		createdAt: "2024-11-10T15:00:00Z",
	},
	{
		id: "call_6",
		type: "call",
		direction: "inbound",
		from: "+1 (555) 678-9012",
		to: "+1 (800) 555-0199",
		duration: 520,
		companyId: "2",
		companyName: "Elite HVAC Services",
		status: "read",
		createdAt: "2024-11-10T14:30:00Z",
	},
];

/**
 * Calls Page
 *
 * Shows all phone call communications across the platform
 */
export default function CallsPage() {
	return (
		<AdminUnifiedInbox
			communications={mockCalls}
			onRefresh={() => {
				console.log("Refreshing calls...");
			}}
		/>
	);
}
