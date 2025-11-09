import { Calendar } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function PayrollScheduleSettingsPage() {
  return (
    <SettingsComingSoon
      backLink="/dashboard/settings"
      description="Configure your payroll schedule, pay periods, and processing dates."
      icon={Calendar}
      title="Payroll Schedule Settings"
    />
  );
}
