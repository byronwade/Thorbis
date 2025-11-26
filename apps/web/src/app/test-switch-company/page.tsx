import { redirect } from "next/navigation";
import { setActiveCompany } from "@/lib/auth/company-context";

/**
 * Debug page to manually switch to Test Plumbing Company
 * Navigate to /test-switch-company to trigger
 */
export default async function TestSwitchCompanyPage() {
	const testCompanyId = "2b88a305-0ecd-4bff-9898-b166cc7937c4";

	try {
		await setActiveCompany(testCompanyId);
	} catch (error) {
		return (
			<div className="p-8">
				<h1 className="text-2xl font-bold text-red-600">
					Error Switching Company
				</h1>
				<pre className="mt-4 p-4 bg-gray-100 rounded">
					{error instanceof Error ? error.message : "Unknown error"}
				</pre>
			</div>
		);
	}

	redirect("/dashboard");
}
