import type { ReactNode } from "react";

type TVDisplayShellProps = {
	children: ReactNode;
};

/**
 * TV Display Shell - Static Server Component
 *
 * Renders instantly (5-20ms) and provides the base layout
 * for the TV display mode. The actual TV content is a client
 * component that handles interactivity and animations.
 *
 * This shell ensures instant visual feedback while the
 * client component hydrates.
 */
export function TVDisplayShell({ children }: TVDisplayShellProps) {
	return (
		<div className="bg-background fixed inset-0">
			{/* Instant shell - shows immediately */}
			{children}
		</div>
	);
}
