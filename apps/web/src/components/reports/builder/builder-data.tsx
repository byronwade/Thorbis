/**
 * Builder Data - Report Builder Page Content
 *
 * Production: Shows Coming Soon shell
 * Development: Shows full report builder wizard
 */

import { Wand2 } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";
import { ReportBuilderWizard } from "./report-builder-wizard";

const isProduction = process.env.NODE_ENV === "production";

export async function BuilderData() {
	// Show Coming Soon in production, full builder in development
	if (isProduction) {
		return (
			<ComingSoonShell
				description="Create custom reports with an intuitive drag-and-drop builder"
				icon={Wand2}
				title="Custom Report Builder"
			/>
		);
	}

	return <ReportBuilderWizard />;
}
