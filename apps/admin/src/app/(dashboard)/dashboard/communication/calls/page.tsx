import { AdminUnifiedInbox } from "@/components/communication/admin-unified-inbox";
import { getPlatformCommunications } from "@/actions/communications";

/**
 * Calls Page
 *
 * Shows all phone call communications across the platform
 */
export default async function CallsPage() {
	// Fetch real call communications
	const result = await getPlatformCommunications({ limit: 100, type: "call" });
	const communications = result.data || [];

	return <AdminUnifiedInbox communications={communications} />;
}
