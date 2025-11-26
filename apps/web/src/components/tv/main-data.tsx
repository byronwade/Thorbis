/**
 * TV Page Data Component
 *
 * Server component that displays TV dashboard mode.
 */

import { Tv } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export function TvData() {
	return (
		<ComingSoonShell
			title="TV Dashboard"
			icon={Tv}
			description="Display key metrics and schedules on office TVs and large displays."
		/>
	);
}
