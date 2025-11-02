import { Calendar } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function PayrollScheduleSettingsPage() {
  return (
    <SettingsComingSoon
      icon={Calendar}
      title="Payroll Schedule Settings"
      description="Configure your payroll schedule, pay periods, and processing dates."
      backLink="/dashboard/settings"
    />
  );
}
