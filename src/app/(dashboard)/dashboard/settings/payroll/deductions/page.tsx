import { MinusCircle } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function DeductionsSettingsPage() {
  return (
    <SettingsComingSoon
      description="Manage payroll deductions, garnishments, and benefit withholdings."
      icon={MinusCircle}
      title="Deductions Settings"
    />
  );
}
