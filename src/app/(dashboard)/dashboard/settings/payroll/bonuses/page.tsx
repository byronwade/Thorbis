import { Award } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function BonusesSettingsPage() {
  return (
    <SettingsComingSoon
      description="Set up bonus structures, performance incentives, and reward programs."
      icon={Award}
      title="Bonuses Settings"
    />
  );
}
