import { TrendingUp } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function BusinessFinancingSettingsPage() {
  return (
    <SettingsComingSoon
      description="Configure business loan and financing options for your company."
      icon={TrendingUp}
      title="Business Financing Settings"
    />
  );
}
