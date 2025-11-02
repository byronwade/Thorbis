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
      icon={BookOpen}
      title="Bookkeeping Settings"
      description="Configure your bookkeeping preferences, reconciliation rules, and transaction categorization."
    />
  );
}
