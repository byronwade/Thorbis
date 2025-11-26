/**
 * Adyen Onboarding Status API Route
 *
 * Checks Adyen merchant account KYC verification status.
 * Used by AdyenOnboardingTracker component to show real-time onboarding progress.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const companyId = searchParams.get("companyId");
		const accountHolderId = searchParams.get("accountHolderId");

		if (!companyId) {
			return NextResponse.json(
				{ success: false, error: "Company ID is required" },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		// Query company payment processor settings
		const { data: processorSettings, error } = await supabase
			.from("payment_processor_settings")
			.select("*")
			.eq("company_id", companyId)
			.eq("processor_type", "adyen")
			.eq("is_active", true)
			.single();

		if (error || !processorSettings) {
			console.error("Failed to fetch Adyen settings:", error);
			return NextResponse.json({
				success: true,
				status: "draft",
				documents: [],
			});
		}

		// In production, this would call Adyen's API to get the actual onboarding status
		// For now, we'll use mock data based on the database state

		const onboardingStatus = processorSettings.onboarding_status || "pending";
		const submittedAt = processorSettings.created_at
			? new Date(processorSettings.created_at)
			: new Date();
		const now = new Date();
		const daysSinceSubmission = Math.floor(
			(now.getTime() - submittedAt.getTime()) / (1000 * 60 * 60 * 24),
		);

		// Estimate completion date (typically 3-7 business days from submission)
		const estimatedCompletionDate = new Date(submittedAt);
		estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + 7);

		// Mock documents based on onboarding status
		const documents = [
			{
				id: "business_registration",
				type: "Business Registration",
				description: "Articles of Incorporation or Business License",
				required: true,
				uploaded: onboardingStatus !== "draft",
				verified: onboardingStatus === "verified",
			},
			{
				id: "tax_id",
				type: "Tax Identification",
				description: "EIN Letter or Tax ID Documentation",
				required: true,
				uploaded: onboardingStatus !== "draft",
				verified: onboardingStatus === "verified",
			},
			{
				id: "bank_statement",
				type: "Bank Statement",
				description: "Recent bank statement (within 3 months)",
				required: true,
				uploaded: onboardingStatus !== "draft",
				verified: onboardingStatus === "verified",
			},
			{
				id: "owner_id",
				type: "Owner Identification",
				description: "Government-issued ID for beneficial owners",
				required: true,
				uploaded: onboardingStatus !== "draft",
				verified: onboardingStatus === "verified",
			},
		];

		// Filter to show only non-verified documents if in documents_requested status
		const relevantDocuments =
			onboardingStatus === "documents_requested"
				? documents
				: onboardingStatus === "verified"
					? documents.filter((d) => d.verified)
					: [];

		return NextResponse.json({
			success: true,
			status: onboardingStatus,
			documents: relevantDocuments,
			daysSinceSubmission,
			estimatedCompletionDate: estimatedCompletionDate.toISOString(),
			accountHolderId: accountHolderId || processorSettings.account_holder_id,
		});
	} catch (error) {
		console.error("Adyen onboarding status API error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 },
		);
	}
}
