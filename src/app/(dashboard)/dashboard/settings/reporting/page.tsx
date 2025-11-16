import { BarChart3 } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

/**
 * Reporting Settings Page - Coming Soon
 *
 * Server Component for optimal performance.
 */

export default function ReportingSettingsPage() {
	return (
		<SettingsComingSoon
			description="Configure custom reports, dashboards, and analytics preferences."
			icon={<BarChart3 className="size-10 text-primary" strokeWidth={1.5} />}
			title="Reporting Settings"
		/>
	);
}
