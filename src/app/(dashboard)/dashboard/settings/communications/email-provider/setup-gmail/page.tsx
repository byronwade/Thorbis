/**
 * Google Workspace Setup Wizard Page
 *
 * Guides users through connecting Google Workspace as their email provider.
 * Multi-step process:
 * 1. OAuth connection
 * 2. Select workspace emails
 * 3. Assign team permissions
 * 4. Test connection
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { GmailSetupWizard } from "@/components/settings/communications/gmail-setup-wizard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function GmailSetupSkeleton() {
	return (
		<div className="space-y-6">
			{/* Progress Steps */}
			<div className="flex items-center justify-between gap-4">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="flex items-center gap-2 flex-1">
						<div className="flex flex-col items-center gap-2 flex-1">
							<Skeleton className="h-10 w-10 rounded-full" />
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-3 w-32" />
						</div>
						{i < 4 && <Skeleton className="h-px flex-1 max-w-24" />}
					</div>
				))}
			</div>

			{/* Content Card */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-48 mb-2" />
					<Skeleton className="h-4 w-96" />
				</CardHeader>
				<CardContent className="space-y-4">
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-48 w-full" />
				</CardContent>
			</Card>
		</div>
	);
}

async function GmailSetupData() {
	const companyId = await getActiveCompanyId();
	if (!companyId) {
		redirect("/dashboard");
	}

	return (
		<GmailSetupWizard
			companyId={companyId}
			onComplete={() => {
				// Handled client-side via redirect
			}}
		/>
	);
}

export default function GmailSetupPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Google Workspace Setup</h1>
				<p className="text-muted-foreground">
					Connect your Google Workspace account to send and receive emails
				</p>
			</div>

			<Suspense fallback={<GmailSetupSkeleton />}>
				<GmailSetupData />
			</Suspense>
		</div>
	);
}
