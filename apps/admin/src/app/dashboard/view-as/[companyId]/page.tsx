/**
 * View-As Dashboard Home
 *
 * Shows the customer's dashboard home page in view-as mode.
 * This would mirror the web app's dashboard home.
 */

import { redirect } from "next/navigation";

export default async function ViewAsDashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
	const { companyId } = await params;

	// Redirect to work section (most common use case)
	redirect(`/admin/dashboard/view-as/${companyId}/work/jobs`);
}
