import { Award } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function BonusesSettingsPage() {
  return (
    <SettingsComingSoon
      icon={Award}
      title="Bonuses Settings"
      description="Set up bonus structures, performance incentives, and reward programs."
    />
  );
}
