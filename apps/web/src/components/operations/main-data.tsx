/**
 * Operations Page Data Component
 *
 * Server component that displays operations dashboard.
 */

import { Settings } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export function OperationsData() {
	return (
		<ComingSoonShell
			title="Operations"
			icon={Settings}
			description="Manage your daily operations and optimize business processes."
		/>
	);
}
