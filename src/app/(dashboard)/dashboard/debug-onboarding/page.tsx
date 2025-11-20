/**
 * Debug Onboarding Status Page
 *
 * Shows the current onboarding status for debugging purposes.
 * Only available in development mode.
 */

import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";
import { isOnboardingComplete } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";

export default async function DebugOnboardingPage() {
	// Only allow in development
	if (process.env.NODE_ENV !== "development") {
		redirect("/dashboard");
	}

	const user = await getCurrentUser();
	if (!user) {
		return <div>Not authenticated</div>;
	}

	const supabase = await createClient();
	const activeCompanyId = await getActiveCompanyId();

	// Get all companies for this user
	const { data: teamMembers } = await supabase
		.from("company_memberships")
		.select(
			"company_id, status, companies!inner(id, name, stripe_subscription_status, onboarding_progress, onboarding_completed_at, created_at)",
		)
		.eq("user_id", user.id)
		.is("companies.deleted_at", null);

	return (
		<div className="container mx-auto max-w-4xl p-8">
			<h1 className="mb-8 text-3xl font-bold">Onboarding Debug</h1>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>User Info</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div>
							<strong>ID:</strong> {user.id}
						</div>
						<div>
							<strong>Email:</strong> {user.email}
						</div>
						<div>
							<strong>Active Company ID:</strong> {activeCompanyId || "None"}
						</div>
					</div>
				</CardContent>
			</Card>

			<h2 className="mb-4 text-2xl font-semibold">
				Companies ({teamMembers?.length || 0})
			</h2>

			{teamMembers?.map((tm: any) => {
				const company = Array.isArray(tm.companies)
					? tm.companies[0]
					: tm.companies;
				const onboardingProgress =
					(company?.onboarding_progress as Record<string, unknown>) || {};
				const onboardingDone = isOnboardingComplete({
					progress: onboardingProgress,
					completedAt: company?.onboarding_completed_at ?? null,
				});

				return (
					<Card key={company.id} className="mb-4">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>{company.name}</CardTitle>
								<div className="flex gap-2">
									{activeCompanyId === company.id && (
										<Badge variant="default">Active</Badge>
									)}
									{onboardingDone && (
										<Badge
											variant="outline"
											className="bg-green-50 text-green-700"
										>
											Onboarding Complete
										</Badge>
									)}
									{!onboardingDone && (
										<Badge
											variant="outline"
											className="bg-yellow-50 text-yellow-700"
										>
											Onboarding Incomplete
										</Badge>
									)}
								</div>
							</div>
							<CardDescription>ID: {company.id}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div>
									<strong>Team Member Status:</strong>{" "}
									<Badge
										variant={tm.status === "active" ? "default" : "secondary"}
									>
										{tm.status}
									</Badge>
								</div>
								<div>
									<strong>Subscription Status:</strong>{" "}
									<Badge
										variant={
											company.stripe_subscription_status === "active" ||
											company.stripe_subscription_status === "trialing"
												? "default"
												: "secondary"
										}
									>
										{company.stripe_subscription_status || "none"}
									</Badge>
								</div>
								<div>
									<strong>Created:</strong>{" "}
									{new Date(company.created_at).toLocaleString()}
								</div>
								<div>
									<strong>Onboarding Completed At:</strong>{" "}
									{company.onboarding_completed_at
										? new Date(company.onboarding_completed_at).toLocaleString()
										: "Not completed"}
								</div>
								<div>
									<strong>Onboarding Progress:</strong>
									<pre className="bg-muted mt-2 overflow-auto rounded-md p-4 text-xs">
										{JSON.stringify(onboardingProgress, null, 2)}
									</pre>
								</div>
								<div className="pt-4">
									<strong>Should Show Welcome Page:</strong>{" "}
									<Badge variant={!onboardingDone ? "default" : "secondary"}>
										{!onboardingDone ? "YES" : "NO"}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}

			{(!teamMembers || teamMembers.length === 0) && (
				<Card>
					<CardContent className="text-muted-foreground py-8 text-center">
						No companies found for this user
					</CardContent>
				</Card>
			)}
		</div>
	);
}
