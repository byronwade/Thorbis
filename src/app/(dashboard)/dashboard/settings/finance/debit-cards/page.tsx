import { CreditCard } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function DebitCardsSettingsPage() {
	return (
		<SettingsComingSoon
			description="Manage company debit cards and spending controls for your team."
			icon={<CreditCard className="size-10 text-primary" strokeWidth={1.5} />}
			title="Debit Cards Settings"
		/>
	);
}
