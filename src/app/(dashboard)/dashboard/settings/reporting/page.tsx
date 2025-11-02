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
      icon={BarChart3}
      title="Reporting Settings"
      description="Configure custom reports, dashboards, and analytics preferences."
    />
  );
}
