import { AdminUnifiedInbox } from "@/components/communication/admin-unified-inbox";
import { getPlatformCommunications } from "@/actions/communications";

/**
 * Communication Hub Page
 *
 * Unified inbox showing all platform communications
 */
export default async function CommunicationPage() {
	// Fetch real communications data
	const result = await getPlatformCommunications({ limit: 100 });

	// Use fetched data or empty array if error
	const communications = result.data || [];

	return <AdminUnifiedInbox communications={communications} />;
}
