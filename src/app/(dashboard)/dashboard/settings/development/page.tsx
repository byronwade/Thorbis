import { Code } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

/**
 * Development Settings Page - Coming Soon
 *
 * Server Component for optimal performance.
 */

export default function DevelopmentSettingsPage() {
  return (
    <SettingsComingSoon
      description="Advanced developer tools, API access, webhooks, and integration settings."
      icon={Code}
      title="Development Settings"
    />
  );
}
