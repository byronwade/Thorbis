/**
 * View-As Layout
 *
 * Root layout for admin view-as mode.
 * Verifies active support session and wraps with admin UI.
 */

import { notFound, redirect } from "next/navigation";
import { requireActiveSupportSession, getCurrentSession } from "@/lib/admin-context";
import { AdminViewAsBanner } from "@/components/view-as/admin-banner";
import { AdminFloatingTools } from "@/components/view-as/floating-tools";

export default async function ViewAsLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ companyId: string }>;
}) {
	const { companyId } = await params;

	// Verify active support session
	try {
		const session = await requireActiveSupportSession();

		// Verify we're viewing the correct company
		if (session.companyId !== companyId) {
			redirect(`/admin/dashboard/view-as/${session.companyId}`);
		}

		// Get full session details
		const sessionDetails = await getCurrentSession();
		if (!sessionDetails) {
			redirect("/admin/dashboard/work/companies");
		}

		return (
			<div className="relative min-h-screen">
				{/* Admin banner at top */}
				<AdminViewAsBanner session={sessionDetails} companyId={companyId} />

				{/* Customer dashboard content */}
				<div className="pt-16">{/* Offset for fixed banner */}{children}</div>

				{/* Floating admin toolbox */}
				<AdminFloatingTools companyId={companyId} sessionId={sessionDetails.id} />
			</div>
		);
	} catch (error) {
		// No active session or session expired
		redirect("/admin/dashboard/work/companies");
	}
}
