import { Calendar } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function PayrollScheduleSettingsPage() {
	return (
		<SettingsComingSoon
			backLink="/dashboard/settings"
			description="Configure your payroll schedule, pay periods, and processing dates."
			icon={<Calendar className="size-10 text-primary" strokeWidth={1.5} />}
			title="Payroll Schedule Settings"
		/>
	);
}
