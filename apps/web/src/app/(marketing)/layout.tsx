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

import { Footer } from "@/components/layout/footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="bg-background flex min-h-screen flex-col">
			<MarketingHeader />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
