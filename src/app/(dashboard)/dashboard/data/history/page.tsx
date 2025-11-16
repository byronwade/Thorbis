/**
 * Import/Export History Page - Server Component
 *
 * Shows history of all import and export operations
 */

import { redirect } from "next/navigation";
import { ImportExportHistoryClient } from "@/components/data/import-export-history-client";
import { getCurrentUser } from "@/lib/auth/session";

export default async function HistoryPage() {
	// Check authentication
	const user = await getCurrentUser();

	if (!user) {
		redirect("/login?message=Please log in to view history");
	}

	return <ImportExportHistoryClient />;
}
