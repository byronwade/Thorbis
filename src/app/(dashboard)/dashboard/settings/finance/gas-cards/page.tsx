import { Fuel } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function GasCardsSettingsPage() {
  return (
    <SettingsComingSoon
      description="Configure gas card programs and fuel expense tracking for your fleet."
      icon={Fuel}
      title="Gas Cards Settings"
    />
  );
}
