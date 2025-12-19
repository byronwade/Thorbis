import { AdminUnifiedInbox } from "@/components/communication/admin-unified-inbox";
import { getPlatformCommunications } from "@/actions/communications";

/**
 * Email Page
 *
 * Shows all email communications across the platform
 */
export default async function EmailPage() {
	// Fetch real email communications
	const result = await getPlatformCommunications({ limit: 100, type: "email" });
	const communications = result.data || [];

	return <AdminUnifiedInbox communications={communications} />;
}
