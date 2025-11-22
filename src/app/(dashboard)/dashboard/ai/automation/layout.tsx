import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";

// Configuration for AI automation page
const automationConfig: UnifiedLayoutConfig = {
	structure: {
		maxWidth: "7xl",
		padding: "md",
		gap: "lg",
		fixedHeight: false,
		variant: "default",
	},
	toolbar: {
		show: true,
		title: "AI Automation",
		subtitle: "Manage automated AI workflows",
	},
	sidebar: {
		show: true,
		customConfig: null,
	},
	rightSidebar: {
		show: false,
	},
};

export default function AutomationLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SectionLayout config={automationConfig} pathname="/dashboard/ai/automation">
			{children}
		</SectionLayout>
	);
}


