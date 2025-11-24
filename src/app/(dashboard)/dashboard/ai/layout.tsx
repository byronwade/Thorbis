import { SectionLayout } from "@/components/layout/section-layout";
import type { UnifiedLayoutConfig } from "@/lib/layout/unified-layout-config";
import { AiToolbarActions } from "@/components/ai/ai-toolbar-actions";

// Configuration for AI pages
const aiConfig: UnifiedLayoutConfig = {
	structure: {
		maxWidth: "full",
		padding: "none",
		gap: "none",
		fixedHeight: false,
		variant: "default",
	},
	toolbar: {
		show: true,
		actions: <AiToolbarActions />,
		hideActionSeparator: true,
	},
	sidebar: {
		show: true,
		customConfig: null,
	},
	rightSidebar: {
		show: false,
	},
};

export default function AiLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SectionLayout config={aiConfig} pathname="/dashboard/ai">
			{children}
		</SectionLayout>
	);
}

