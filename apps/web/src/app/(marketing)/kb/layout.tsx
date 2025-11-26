/**
 * Knowledge Base Layout - Server Component
 *
 * Wraps all KB pages with consistent layout
 * Uses marketing layout for public access
 */

import { Footer } from "@/components/layout/footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function KBLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-background flex min-h-screen flex-col">
			<MarketingHeader />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
