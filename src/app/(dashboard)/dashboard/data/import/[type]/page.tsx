/**
 * Import Workflow Page - Server Component
 *
 * Multi-step import wizard for all data types
 * Steps:
 * 1. Upload file
 * 2. Column mapping
 * 3. Data preview & validation
 * 4. Dry run simulation
 * 5. Confirm & import
 * 6. Results
 */

import { redirect } from "next/navigation";
import { ImportWorkflowClient } from "@/components/data/import-workflow-client";
import { getCurrentUser } from "@/lib/auth/session";

type ImportPageProps = {
	params: {
		type: string;
	};
};

export default async function ImportPage({ params }: ImportPageProps) {
	// Check authentication
	const user = await getCurrentUser();

	if (!user) {
		redirect("/login?message=Please log in to import data");
	}

	// Validate data type
	const validTypes = [
		"jobs",
		"invoices",
		"estimates",
		"contracts",
		"purchase-orders",
		"customers",
		"pricebook",
		"materials",
		"equipment",
		"schedule",
		"maintenance-plans",
		"service-agreements",
		"service-tickets",
	];

	if (!validTypes.includes(params.type)) {
		redirect("/dashboard");
	}

	return <ImportWorkflowClient dataType={params.type} />;
}
