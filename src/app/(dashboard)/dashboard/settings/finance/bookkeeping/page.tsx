import { BookOpen } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

/**
 * Finance > Bookkeeping Settings Page - Coming Soon
 *
 * Server Component for optimal performance.
 */

export default function BookkeepingSettingsPage() {
	return (
		<SettingsComingSoon
			description="Configure your bookkeeping preferences, reconciliation rules, and transaction categorization."
			icon={<BookOpen className="size-10 text-primary" strokeWidth={1.5} />}
			title="Bookkeeping Settings"
		/>
	);
}
