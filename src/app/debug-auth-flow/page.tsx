import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { isOnboardingComplete } from "@/lib/onboarding/status";
import { createClient } from "@/lib/supabase/server";

/**
 * Debug page to trace the exact auth flow logic
 */
export default async function DebugAuthFlowPage() {
	const user = await getCurrentUser();
	const activeCompanyId = await getActiveCompanyId();
	const supabase = await createClient();

	const checks = {
		hasUser: !!user,
		hasActiveCompanyId: !!activeCompanyId,
		hasSupabase: !!supabase,
		teamMemberResult: null as any,
		companyResult: null as any,
		subscriptionActive: false,
		onboardingFinished: false,
		isCompanyOnboardingComplete: false,
	};

	if (activeCompanyId && supabase) {
		// Simulate DashboardAuthWrapper logic (lines 48-84)
		const [teamMemberResult, companyResult] = await Promise.all([
			supabase
				.from("company_memberships")
				.select("company_id")
				.eq("user_id", user?.id || "")
				.eq("company_id", activeCompanyId)
				.eq("status", "active")
				.maybeSingle(),

			supabase
				.from("companies")
				.select(
					"stripe_subscription_status, onboarding_progress, onboarding_completed_at",
				)
				.eq("id", activeCompanyId)
				.maybeSingle(),
		]);

		checks.teamMemberResult = teamMemberResult;
		checks.companyResult = companyResult;

		const teamMember = teamMemberResult.data;
		const company = companyResult.data;

		const subscriptionStatus = company?.stripe_subscription_status;
		checks.subscriptionActive =
			subscriptionStatus === "active" || subscriptionStatus === "trialing";

		const onboardingProgress =
			(company?.onboarding_progress as Record<string, unknown>) || null;

		checks.onboardingFinished = isOnboardingComplete({
			progress: onboardingProgress,
			completedAt: company?.onboarding_completed_at ?? null,
		});

		checks.isCompanyOnboardingComplete =
			!!teamMember && checks.subscriptionActive && checks.onboardingFinished;
	}

	const CheckIcon = ({ passed }: { passed: boolean }) =>
		passed ? (
			<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
		) : (
			<XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
		);

	return (
		<div className="container max-w-4xl py-8">
			<h1 className="text-3xl font-bold mb-6">Auth Flow Debug</h1>

			<div className="space-y-6">
				{/* Summary */}
				<Card>
					<CardHeader>
						<CardTitle>Dashboard Access Check</CardTitle>
						<CardDescription>
							Simulating DashboardAuthWrapper logic from line 22-84
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-3 text-lg font-semibold">
							{checks.isCompanyOnboardingComplete ? (
								<>
									<CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
									<span className="text-green-600 dark:text-green-400">
										Should allow dashboard access
									</span>
								</>
							) : (
								<>
									<AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
									<span className="text-yellow-600 dark:text-yellow-400">
										Should redirect to /dashboard/welcome
									</span>
								</>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Step-by-step checks */}
				<Card>
					<CardHeader>
						<CardTitle>Step-by-Step Checks</CardTitle>
						<CardDescription>
							Each condition in DashboardAuthWrapper
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Step 1: User */}
						<div className="flex items-start gap-3 p-3 bg-muted rounded-md">
							<CheckIcon passed={checks.hasUser} />
							<div className="flex-1">
								<p className="font-medium">Step 1: User authenticated</p>
								<p className="text-sm text-muted-foreground">
									Line 24: const user = await getCurrentUser()
								</p>
								{checks.hasUser && (
									<Badge variant="secondary" className="mt-2">
										User ID: {user?.id}
									</Badge>
								)}
							</div>
						</div>

						{/* Step 2: Active Company */}
						<div className="flex items-start gap-3 p-3 bg-muted rounded-md">
							<CheckIcon passed={checks.hasActiveCompanyId} />
							<div className="flex-1">
								<p className="font-medium">Step 2: Active company ID exists</p>
								<p className="text-sm text-muted-foreground">
									Line 42: const activeCompanyId = await getActiveCompanyId()
								</p>
								{checks.hasActiveCompanyId && (
									<Badge variant="secondary" className="mt-2">
										{activeCompanyId}
									</Badge>
								)}
							</div>
						</div>

						{/* Step 3: Team Member */}
						<div className="flex items-start gap-3 p-3 bg-muted rounded-md">
							<CheckIcon passed={!!checks.teamMemberResult?.data} />
							<div className="flex-1">
								<p className="font-medium">Step 3: User is team member</p>
								<p className="text-sm text-muted-foreground">
									Lines 48-55: Query company_memberships
								</p>
								{checks.teamMemberResult && (
									<pre className="mt-2 text-xs bg-background p-2 rounded">
										{JSON.stringify(checks.teamMemberResult, null, 2)}
									</pre>
								)}
							</div>
						</div>

						{/* Step 4: Company Data */}
						<div className="flex items-start gap-3 p-3 bg-muted rounded-md">
							<CheckIcon passed={!!checks.companyResult?.data} />
							<div className="flex-1">
								<p className="font-medium">Step 4: Company data fetched</p>
								<p className="text-sm text-muted-foreground">
									Lines 57-64: Query companies table
								</p>
								{checks.companyResult && (
									<pre className="mt-2 text-xs bg-background p-2 rounded">
										{JSON.stringify(checks.companyResult, null, 2)}
									</pre>
								)}
							</div>
						</div>

						{/* Step 5: Subscription */}
						<div className="flex items-start gap-3 p-3 bg-muted rounded-md">
							<CheckIcon passed={checks.subscriptionActive} />
							<div className="flex-1">
								<p className="font-medium">Step 5: Subscription active</p>
								<p className="text-sm text-muted-foreground">
									Lines 69-71: subscriptionStatus === "active" || "trialing"
								</p>
								<Badge
									variant={
										checks.subscriptionActive ? "default" : "destructive"
									}
									className="mt-2"
								>
									{checks.companyResult?.data?.stripe_subscription_status ||
										"unknown"}
								</Badge>
							</div>
						</div>

						{/* Step 6: Onboarding */}
						<div className="flex items-start gap-3 p-3 bg-muted rounded-md">
							<CheckIcon passed={checks.onboardingFinished} />
							<div className="flex-1">
								<p className="font-medium">Step 6: Onboarding finished</p>
								<p className="text-sm text-muted-foreground">
									Lines 72-77: isOnboardingComplete()
								</p>
								<div className="mt-2 space-y-1">
									<Badge variant="secondary">
										completed_at:{" "}
										{checks.companyResult?.data?.onboarding_completed_at ||
											"null"}
									</Badge>
									<Badge variant="secondary">
										progress:{" "}
										{JSON.stringify(
											checks.companyResult?.data?.onboarding_progress || {},
										)}
									</Badge>
								</div>
							</div>
						</div>

						{/* Final Result */}
						<div className="flex items-start gap-3 p-3 bg-muted rounded-md border-2 border-primary">
							<CheckIcon passed={checks.isCompanyOnboardingComplete} />
							<div className="flex-1">
								<p className="font-medium">
									Final: isCompanyOnboardingComplete
								</p>
								<p className="text-sm text-muted-foreground">
									Line 82-83: !!teamMember && subscriptionActive &&
									onboardingFinished
								</p>
								<div className="mt-2">
									<Badge
										variant={
											checks.isCompanyOnboardingComplete
												? "default"
												: "destructive"
										}
									>
										{checks.isCompanyOnboardingComplete ? "PASS" : "FAIL"}
									</Badge>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Verdict */}
				<Card>
					<CardHeader>
						<CardTitle>Verdict</CardTitle>
					</CardHeader>
					<CardContent>
						{checks.isCompanyOnboardingComplete ? (
							<div className="text-green-600 dark:text-green-400">
								<p className="font-semibold text-lg mb-2">
									✅ You should have access to /dashboard
								</p>
								<p className="text-sm">
									All checks passed. DashboardAuthWrapper will NOT redirect you
									to /dashboard/welcome.
								</p>
							</div>
						) : (
							<div className="text-yellow-600 dark:text-yellow-400">
								<p className="font-semibold text-lg mb-2">
									⚠️ You will be redirected to /dashboard/welcome
								</p>
								<p className="text-sm">
									One or more checks failed. DashboardAuthWrapper will redirect
									you to complete onboarding.
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
