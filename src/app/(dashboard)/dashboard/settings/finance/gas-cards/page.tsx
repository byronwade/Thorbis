import { Fuel } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function GasCardsSettingsPage() {
	return (
		<SettingsComingSoon
			description="Configure gas card programs and fuel expense tracking for your fleet."
			icon={<Fuel className="size-10 text-primary" strokeWidth={1.5} />}
			title="Gas Cards Settings"
		/>
	);
}
