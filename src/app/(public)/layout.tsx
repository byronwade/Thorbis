/**
 * Public Layout - Server Component
 *
 * Layout for public-facing pages (payment portal, etc.)
 * - No authentication required
 * - Minimal styling
 * - Clean, professional design
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Thorbis",
	description: "Professional service management platform",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return <div className="min-h-screen bg-background">{children}</div>;
}
