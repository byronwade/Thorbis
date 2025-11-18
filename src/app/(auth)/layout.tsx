/**
 * Auth Layout - Server Component
 *
 * Minimal layout for authentication pages (login, register)
 * - No header or footer
 * - Centered content on desktop
 * - Full width on mobile
 */

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
