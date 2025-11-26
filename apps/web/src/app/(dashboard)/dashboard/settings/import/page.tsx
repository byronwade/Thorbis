import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ImportPageContent } from "./import-page-content";
import { ImportPageSkeleton } from "./import-page-skeleton";

// Force dynamic rendering - this page requires authentication
export const dynamic = "force-dynamic";

export const metadata = {
	title: "Import Data - Stratos",
	description: "AI-powered data import from any platform",
};

export default async function ImportPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Get user's company (get first active membership)
	const { data: memberships, error: membershipError } = await supabase
		.from("company_memberships")
		.select("company_id")
		.eq("user_id", user.id)
		.limit(1);

	const membership = memberships?.[0];

	// If no membership found, show helpful error instead of redirecting
	if (!membership || membershipError) {
		return (
			<div className="container max-w-7xl py-6">
				<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
					<div className="text-center space-y-2">
						<h1 className="text-2xl font-bold">Company Membership Required</h1>
						<p className="text-muted-foreground">
							You need to be part of a company to use the import system.
						</p>
						<p className="text-sm text-muted-foreground">
							Error: {membershipError?.message || "No company membership found"}
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<Suspense fallback={<ImportPageSkeleton />}>
			<ImportPageContent companyId={membership.company_id} userId={user.id} />
		</Suspense>
	);
}
