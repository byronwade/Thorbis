import { CreditCard } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function ConsumerFinancingSettingsPage() {
  return (
    <SettingsComingSoon
      description="Set up customer financing options and payment plans for your services."
      icon={<CreditCard className="size-10 text-primary" strokeWidth={1.5} />}
      title="Consumer Financing Settings"
    />
  );
}
