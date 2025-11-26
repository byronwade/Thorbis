"use client";

import { AdminUnifiedInbox } from "@/components/communication/admin-unified-inbox";
import type { AdminCommunication } from "@/types/entities";

// Mock data for development - replace with real data fetching
const mockCommunications: AdminCommunication[] = [
	{
		id: "comm_1",
		type: "email",
		direction: "inbound",
		subject: "Account upgrade inquiry",
		preview: "Hi, I would like to know more about upgrading our account to the enterprise plan. We currently have 20 users...",
		from: "john@acmeplumbing.com",
		to: "support@stratos.com",
		companyId: "1",
		companyName: "Acme Plumbing Co.",
		status: "unread",
		createdAt: "2024-11-11T10:30:00Z",
	},
	{
		id: "comm_2",
		type: "sms",
		direction: "inbound",
		preview: "Hey, the app is showing an error when I try to create a new job. Can someone help?",
		from: "+1 (555) 234-5678",
		to: "+1 (800) 555-0199",
		companyId: "2",
		companyName: "Elite HVAC Services",
		status: "read",
		createdAt: "2024-11-11T10:15:00Z",
	},
	{
		id: "comm_3",
		type: "call",
		direction: "inbound",
		from: "+1 (555) 123-4567",
		to: "+1 (800) 555-0199",
		companyId: "1",
		companyName: "Acme Plumbing Co.",
		status: "read",
		duration: 345,
		createdAt: "2024-11-11T09:45:00Z",
	},
	{
		id: "comm_4",
		type: "email",
		direction: "outbound",
		subject: "Welcome to Stratos!",
		preview: "Thank you for signing up for Stratos. Here's everything you need to get started with our platform...",
		from: "onboarding@stratos.com",
		to: "mike@quickfixelectric.com",
		companyId: "3",
		companyName: "Quick Fix Electric",
		status: "delivered",
		createdAt: "2024-11-11T09:15:00Z",
	},
	{
		id: "comm_5",
		type: "voicemail",
		direction: "inbound",
		from: "+1 (555) 456-7890",
		to: "+1 (800) 555-0199",
		companyId: "4",
		companyName: "Johnson & Sons Roofing",
		status: "new",
		duration: 45,
		recordingUrl: "https://recordings.example.com/vm_1.mp3",
		createdAt: "2024-11-10T17:20:00Z",
	},
	{
		id: "comm_6",
		type: "ticket",
		direction: "inbound",
		subject: "Payment failed notification",
		preview: "We received a notification that our last payment attempt failed. Can you help us update our payment method?",
		from: "billing@metrolandscaping.com",
		to: "billing@stratos.com",
		companyId: "5",
		companyName: "Metro Landscaping",
		status: "unread",
		priority: "high",
		createdAt: "2024-11-10T16:45:00Z",
	},
	{
		id: "comm_7",
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
		id: "comm_8",
		type: "call",
		direction: "outbound",
		from: "+1 (800) 555-0199",
		to: "+1 (555) 678-9012",
		companyId: "2",
		companyName: "Elite HVAC Services",
		status: "read",
		duration: 180,
		createdAt: "2024-11-09T15:30:00Z",
	},
	{
		id: "comm_9",
		type: "email",
		direction: "inbound",
		subject: "Feature request: Calendar integration",
		preview: "It would be great if Stratos could integrate with Google Calendar and Outlook for scheduling jobs...",
		from: "sarah@elitehvac.com",
		to: "feedback@stratos.com",
		companyId: "2",
		companyName: "Elite HVAC Services",
		status: "read",
		createdAt: "2024-11-09T14:20:00Z",
	},
	{
		id: "comm_10",
		type: "ticket",
		direction: "inbound",
		subject: "Cannot export invoices to PDF",
		preview: "When I try to export invoices to PDF, I get an error message. This has been happening since yesterday.",
		from: "support@acmeplumbing.com",
		to: "support@stratos.com",
		companyId: "1",
		companyName: "Acme Plumbing Co.",
		status: "read",
		priority: "medium",
		createdAt: "2024-11-09T11:00:00Z",
	},
];

/**
 * Communication Hub Page
 *
 * Unified inbox showing all platform communications
 */
export default function CommunicationPage() {
	return (
		<AdminUnifiedInbox
			communications={mockCommunications}
			onRefresh={() => {
				// TODO: Implement real data refresh
				console.log("Refreshing communications...");
			}}
		/>
	);
}
