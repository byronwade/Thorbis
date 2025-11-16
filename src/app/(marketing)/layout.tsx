/**
 * Marketing Layout - Server Component
 *
 * Used for all marketing/public pages:
 * - Homepage (/)
 * - Pricing (/pricing)
 * - Features (/features/*)
 * - Industries (/industries/*)
 * - etc.
 *
 * Includes MarketingHeader on all pages
 */

import { MarketingHeader } from "@/components/hero/marketing-header";
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<MarketingHeader />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
