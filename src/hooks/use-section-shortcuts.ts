import { useEffect } from "react";

/**
 * Section keyboard shortcuts hook for detail pages
 *
 * Enables Ctrl+Number shortcuts (Ctrl+1 through Ctrl+0) for tab/section navigation.
 * Simpler alternative to use-keyboard-shortcuts.ts for basic section switching.
 *
 * Features:
 * - Ctrl+1 through Ctrl+9 for first 9 sections
 * - Ctrl+0 for 10th section
 * - Prevents default browser behavior
 * - Does not interfere with browser shortcuts
 *
 * @param shortcuts - Map of key (string) to handler function
 *
 * @example
 * ```tsx
 * function JobDetails() {
 *   const [selectedTab, setSelectedTab] = useState("overview");
 *
 *   useSectionShortcuts({
 *     "1": () => setSelectedTab("overview"),
 *     "2": () => setSelectedTab("team"),
 *     "3": () => setSelectedTab("appointments"),
 *   });
 *
 *   return (
 *     <Tabs value={selectedTab}>
 *       <TabsTrigger value="overview">
 *         Overview <kbd className="text-xs">Ctrl+1</kbd>
 *       </TabsTrigger>
 *     </Tabs>
 *   );
 * }
 * ```
 */
export function useSectionShortcuts(
	shortcuts: Record<string, () => void>,
): void {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Only trigger on Ctrl+Number (no Shift, Alt, or Meta)
			if (!e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
				return;
			}

			// Check if the pressed key has a handler
			const handler = shortcuts[e.key];

			if (handler) {
				// Prevent default browser behavior
				e.preventDefault();

				// Call the handler
				handler();
			}
		};

		// Add event listener
		window.addEventListener("keydown", handleKeyDown);

		// Cleanup on unmount
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [shortcuts]);
}
