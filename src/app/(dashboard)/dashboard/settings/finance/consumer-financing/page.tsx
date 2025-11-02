import { CreditCard } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function ConsumerFinancingSettingsPage() {
  return (
    <SettingsComingSoon
      icon={CreditCard}
      title="Consumer Financing Settings"
      description="Set up customer financing options and payment plans for your services."
    />
  );
}
