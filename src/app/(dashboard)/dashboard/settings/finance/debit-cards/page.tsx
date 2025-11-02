import { CreditCard } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function DebitCardsSettingsPage() {
  return (
    <SettingsComingSoon
      icon={CreditCard}
      title="Debit Cards Settings"
      description="Manage company debit cards and spending controls for your team."
    />
  );
}
