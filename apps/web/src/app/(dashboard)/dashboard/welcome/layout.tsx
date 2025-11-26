/**
 * Welcome Page Layout - Override Parent Layout
 *
 * This layout overrides the parent dashboard layout to provide
 * a clean onboarding experience with NO app chrome.
 *
 * Note: The parent layout's AppHeader/DashboardAuthWrapper will still run,
 * but we override the visual presentation here.
 */

export default function WelcomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Return children directly - no app chrome
	// The parent DashboardAuthWrapper handles auth
	return <>{children}</>;
}
