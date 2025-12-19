import { AdminUnifiedInbox } from "@/components/communication/admin-unified-inbox";
import { getSupportTickets } from "@/actions/support-tickets";
import type { AdminCommunication } from "@/types/entities";

/**
 * Support Tickets Page
 *
 * Shows all support tickets across the platform
 */
export default async function TicketsPage() {
	// Fetch real support tickets
	const result = await getSupportTickets(100, 0);

	// Transform support tickets to AdminCommunication format
	const communications: AdminCommunication[] = (result.data || []).map((ticket) => {
		// Map ticket status to communication status
		let status: AdminCommunication["status"] = "read";
		if (ticket.status === "open") {
			status = "new";
		} else if (ticket.status === "in_progress" || ticket.status === "waiting_on_us") {
			status = "unread";
		} else if (ticket.status === "waiting_on_customer") {
			status = "sent";
		} else if (ticket.status === "resolved" || ticket.status === "closed") {
			status = "read";
		}

		// Map ticket priority to communication priority
		let priority: AdminCommunication["priority"] = undefined;
		if (ticket.priority === "urgent") {
			priority = "urgent";
		} else if (ticket.priority === "high") {
			priority = "high";
		} else if (ticket.priority === "normal") {
			priority = "medium";
		} else if (ticket.priority === "low") {
			priority = "low";
		}

		return {
			id: ticket.id,
			type: "ticket" as const,
			direction: "inbound" as const,
			subject: ticket.subject,
			preview: ticket.description || undefined,
			from: ticket.requester_email,
			to: "support@stratos.com",
			companyId: ticket.company_id,
			companyName: ticket.company_name,
			userId: undefined,
			userName: ticket.requester_name,
			status,
			priority,
			createdAt: ticket.created_at,
			updatedAt: ticket.updated_at,
		};
	});

	return <AdminUnifiedInbox communications={communications} />;
}
