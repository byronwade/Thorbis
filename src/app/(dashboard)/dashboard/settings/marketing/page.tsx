import { Megaphone } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

/**
 * Marketing Settings Page - Coming Soon
 *
 * Server Component for optimal performance.
 */

export default function MarketingSettingsPage() {
  return (
    <SettingsComingSoon
      icon={Megaphone}
      title="Marketing Settings"
      description="Configure marketing campaigns, lead tracking, and customer acquisition tools."
    />
  );
}
