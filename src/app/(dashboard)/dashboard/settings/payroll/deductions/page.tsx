import { MinusCircle } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function DeductionsSettingsPage() {
	return (
		<SettingsComingSoon
			description="Manage payroll deductions, garnishments, and benefit withholdings."
			icon={<MinusCircle className="size-10 text-primary" strokeWidth={1.5} />}
			title="Deductions Settings"
		/>
	);
}
