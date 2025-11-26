/**
 * Automation Page Data Component
 *
 * Server component that displays automation features.
 */

import { Zap } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export function AutomationData() {
	return (
		<ComingSoonShell
			title="Automation"
			icon={Zap}
			description="Automate your workflows and save time on repetitive tasks."
		/>
	);
}
