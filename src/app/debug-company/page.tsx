import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	getActiveCompanyId,
	getUserCompanies,
} from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

/**
 * Debug page to show current company context
 */
export default async function DebugCompanyPage() {
	const user = await getCurrentUser();
	const activeCompanyId = await getActiveCompanyId();
	const companies = await getUserCompanies();
	const supabase = await createClient();

	let activeCompanyDetails = null;
	if (activeCompanyId && supabase) {
		const { data } = await supabase
			.from("companies")
			.select("*")
			.eq("id", activeCompanyId)
			.single();
		activeCompanyDetails = data;
	}

	return (
		<div className="container max-w-4xl py-8">
			<h1 className="text-3xl font-bold mb-6">Company Context Debug</h1>

			<div className="space-y-6">
				{/* User Info */}
				<Card>
					<CardHeader>
						<CardTitle>User Info</CardTitle>
						<CardDescription>
							Current authenticated user details
						</CardDescription>
					</CardHeader>
					<CardContent>
						<pre className="text-sm overflow-auto bg-muted p-4 rounded-md">
							{JSON.stringify({ id: user?.id, email: user?.email }, null, 2)}
						</pre>
					</CardContent>
				</Card>

				{/* Active Company ID */}
				<Card>
					<CardHeader>
						<CardTitle>Active Company ID</CardTitle>
						<CardDescription>Company ID stored in cookie</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="font-mono text-sm bg-muted p-4 rounded-md">
							{activeCompanyId || "NULL"}
						</p>
					</CardContent>
				</Card>

				{/* Active Company Details */}
				{activeCompanyDetails && (
					<Card>
						<CardHeader>
							<CardTitle>Active Company Details</CardTitle>
							<CardDescription>
								Full details of selected company
							</CardDescription>
						</CardHeader>
						<CardContent>
							<pre className="text-sm overflow-auto bg-muted p-4 rounded-md">
								{JSON.stringify(
									{
										id: activeCompanyDetails.id,
										name: activeCompanyDetails.name,
										onboarding_completed_at:
											activeCompanyDetails.onboarding_completed_at,
										stripe_subscription_status:
											activeCompanyDetails.stripe_subscription_status,
										deleted_at: activeCompanyDetails.deleted_at,
									},
									null,
									2,
								)}
							</pre>
						</CardContent>
					</Card>
				)}

				{/* All Companies */}
				<Card>
					<CardHeader>
						<CardTitle>All Companies</CardTitle>
						<CardDescription>
							Sorted by onboarding completion (completed first)
						</CardDescription>
					</CardHeader>
					<CardContent>
						<pre className="text-sm overflow-auto bg-muted p-4 rounded-md">
							{JSON.stringify(companies, null, 2)}
						</pre>
					</CardContent>
				</Card>

				{/* Actions */}
				<Card>
					<CardHeader>
						<CardTitle>Actions</CardTitle>
						<CardDescription>Navigation and company switching</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-4">
							<Button asChild>
								<Link href="/test-switch-company">
									Switch to Test Plumbing Company
								</Link>
							</Button>
							<Button asChild variant="outline">
								<Link href="/dashboard">Go to Dashboard</Link>
							</Button>
							<Button asChild variant="outline">
								<Link href="/dashboard/welcome">Go to Welcome</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
