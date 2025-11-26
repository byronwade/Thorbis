"use client";

import { AdminUnifiedInbox } from "@/components/communication/admin-unified-inbox";
import type { AdminCommunication } from "@/types/entities";

// Mock data for development - replace with real data fetching
const mockEmails: AdminCommunication[] = [
	{
		id: "email_1",
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
		id: "email_2",
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
		id: "email_3",
		type: "email",
		direction: "inbound",
		subject: "Payment failed notification",
		preview: "We received a notification that our last payment attempt failed. Can you help us update our payment method?",
		from: "billing@metrolandscaping.com",
		to: "billing@stratos.com",
		companyId: "5",
		companyName: "Metro Landscaping",
		status: "read",
		createdAt: "2024-11-10T16:45:00Z",
	},
	{
		id: "email_4",
		type: "email",
		direction: "outbound",
		subject: "Your trial is ending soon",
		preview: "Your 14-day trial period ends in 3 days. To continue using Stratos, please select a subscription plan...",
		from: "notifications@stratos.com",
		to: "mike@quickfixelectric.com",
		companyId: "3",
		companyName: "Quick Fix Electric",
		status: "sent",
		createdAt: "2024-11-10T08:00:00Z",
	},
	{
		id: "email_5",
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
		id: "email_6",
		type: "email",
		direction: "inbound",
		subject: "Bug report: Invoice PDF export",
		preview: "When I try to export invoices to PDF, I get an error message. This has been happening since yesterday's update.",
		from: "support@acmeplumbing.com",
		to: "support@stratos.com",
		companyId: "1",
		companyName: "Acme Plumbing Co.",
		status: "read",
		createdAt: "2024-11-09T11:00:00Z",
	},
];

/**
 * Email Page
 *
 * Shows all email communications across the platform
 */
export default function EmailPage() {
	return (
		<AdminUnifiedInbox
			communications={mockEmails}
			onRefresh={() => {
				console.log("Refreshing emails...");
			}}
		/>
	);
}
