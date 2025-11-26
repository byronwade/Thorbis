/**
 * Coming Soon Page Data Component
 *
 * Generic coming soon page for features under development.
 */

import { Clock } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export function ComingSoonData() {
	return (
		<ComingSoonShell
			title="Coming Soon"
			icon={Clock}
			description="This feature is currently under development and will be available soon."
		/>
	);
}
