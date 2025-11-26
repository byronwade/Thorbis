"use client";

import { AdminUnifiedInbox } from "@/components/communication/admin-unified-inbox";
import type { AdminCommunication } from "@/types/entities";

// Mock data for development - replace with real data fetching
const mockTickets: AdminCommunication[] = [
	{
		id: "ticket_1",
		type: "ticket",
		direction: "inbound",
		subject: "Unable to generate invoices",
		preview: "When I click on 'Generate Invoice' button, nothing happens. This started after the latest update. I've tried clearing cache and using different browsers.",
		from: "john.smith@acmeplumbing.com",
		to: "support@stratos.com",
		companyId: "1",
		companyName: "Acme Plumbing Co.",
		userId: "1",
		userName: "John Smith",
		status: "unread",
		priority: "high",
		createdAt: "2024-11-11T09:30:00Z",
	},
	{
		id: "ticket_2",
		type: "ticket",
		direction: "inbound",
		subject: "Question about API integration",
		preview: "We want to integrate our CRM with Stratos. Is there documentation available for the API?",
		from: "sarah.johnson@elitehvac.com",
		to: "support@stratos.com",
		companyId: "2",
		companyName: "Elite HVAC Services",
		userId: "2",
		userName: "Sarah Johnson",
		status: "read",
		priority: "medium",
		createdAt: "2024-11-10T14:15:00Z",
	},
	{
		id: "ticket_3",
		type: "ticket",
		direction: "inbound",
		subject: "Billing discrepancy on last invoice",
		preview: "The amount charged doesn't match what was shown in the subscription page. Please review.",
		from: "lisa.johnson@johnsonroofing.com",
		to: "billing@stratos.com",
		companyId: "4",
		companyName: "Johnson & Sons Roofing",
		userId: "5",
		userName: "Lisa Johnson",
		status: "new",
		priority: "urgent",
		createdAt: "2024-11-11T08:00:00Z",
	},
	{
		id: "ticket_4",
		type: "ticket",
		direction: "inbound",
		subject: "Feature request: Bulk job creation",
		preview: "It would be great to have the ability to create multiple jobs at once from a CSV file.",
		from: "sarah.johnson@elitehvac.com",
		to: "feedback@stratos.com",
		companyId: "2",
		companyName: "Elite HVAC Services",
		userId: "2",
		userName: "Sarah Johnson",
		status: "resolved",
		priority: "low",
		createdAt: "2024-11-08T10:30:00Z",
	},
	{
		id: "ticket_5",
		type: "ticket",
		direction: "inbound",
		subject: "Login issues after password reset",
		preview: "Customer reset their password but still cannot log in. Getting 'invalid credentials' error.",
		from: "mike.williams@quickfixelectric.com",
		to: "support@stratos.com",
		companyId: "3",
		companyName: "Quick Fix Electric",
		userId: "3",
		userName: "Mike Williams",
		status: "read",
		priority: "high",
		createdAt: "2024-11-11T07:45:00Z",
	},
];

/**
 * Support Tickets Page
 *
 * Shows all support tickets across the platform
 */
export default function TicketsPage() {
	return (
		<AdminUnifiedInbox
			communications={mockTickets}
			onRefresh={() => {
				console.log("Refreshing tickets...");
			}}
		/>
	);
}
