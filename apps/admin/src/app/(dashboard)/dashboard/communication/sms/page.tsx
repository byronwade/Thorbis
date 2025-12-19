import { AdminUnifiedInbox } from "@/components/communication/admin-unified-inbox";
import { getPlatformCommunications } from "@/actions/communications";

/**
 * SMS Page
 *
 * Shows all SMS communications across the platform
 */
export default async function SmsPage() {
	// Fetch real SMS communications
	const result = await getPlatformCommunications({ limit: 100, type: "sms" });
	const communications = result.data || [];

	return <AdminUnifiedInbox communications={communications} />;
}
