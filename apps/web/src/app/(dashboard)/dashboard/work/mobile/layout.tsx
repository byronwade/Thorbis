import type { ReactNode } from "react";

/**
 * Mobile Work Layout
 *
 * Bypasses parent work layout to provide mobile-optimized experience:
 * - No sidebar (mobile has bottom tabs instead)
 * - No nested SectionLayout (prevents parent sidebar from rendering)
 * - Full screen for mobile dashboard
 *
 * Note: This layout intentionally does NOT use SectionLayout to avoid
 * inheriting the parent's sidebar configuration.
 */
export default function MobileWorkLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			{children}
		</div>
	);
}
