/**
 * Telnyx Account Verification
 *
 * Utilities for checking Telnyx account verification status.
 * Verification levels:
 * - Level 1: Basic identity verification (1-2 business days)
 * - Level 2: Business verification required for 10DLC (2-5 business days)
 */

import { telnyxRequest } from "./api";

export type VerificationLevel = "none" | "level_1" | "level_2";

export type VerificationStatus = {
	currentLevel: VerificationLevel;
	isLevel1Complete: boolean;
	isLevel2Complete: boolean;
	canCreate10DLC: boolean;
	requirementsRemaining: string[];
	estimatedCompletionDays?: number;
};

/**
 * Check the current verification level of the Telnyx account
 *
 * Note: This endpoint may not exist in Telnyx API. If it fails,
 * we'll need to infer verification status from 10DLC brand creation attempts.
 */
export async function checkAccountVerificationStatus(): Promise<{
	success: boolean;
	data?: VerificationStatus;
	error?: string;
}> {
	try {
		// Try to get account verification info
		// Note: Telnyx may not have a direct endpoint for this
		const accountResult = await telnyxRequest<{
			verifications: {
				identity_verification: { status: string; level: number };
				business_verification: { status: string; level: number };
			};
		}>("/account/verifications", {
			method: "GET",
		});

		if (accountResult.success && accountResult.data) {
			const { verifications } = accountResult.data;
			const level1Complete =
				verifications.identity_verification?.status === "verified";
			const level2Complete =
				verifications.business_verification?.status === "verified";

			const requirementsRemaining: string[] = [];
			let estimatedDays = 0;

			if (!level1Complete) {
				requirementsRemaining.push(
					"Complete Level 1 verification (ID, payment method, contact info)",
				);
				estimatedDays = Math.max(estimatedDays, 2);
			}

			if (!level2Complete) {
				requirementsRemaining.push(
					"Complete Level 2 verification (EIN letter, business license, proof of address)",
				);
				estimatedDays = Math.max(estimatedDays, 5);
			}

			const currentLevel: VerificationLevel = level2Complete
				? "level_2"
				: level1Complete
					? "level_1"
					: "none";

			return {
				success: true,
				data: {
					currentLevel,
					isLevel1Complete: level1Complete,
					isLevel2Complete: level2Complete,
					canCreate10DLC: level2Complete,
					requirementsRemaining,
					estimatedCompletionDays:
						requirementsRemaining.length > 0 ? estimatedDays : undefined,
				},
			};
		}

		// If direct endpoint doesn't exist, try to infer from 10DLC brand creation
		// This will fail with 403 if not verified
		const brandTestResult = await telnyxRequest<{ id: string }>("/10dlc/brand", {
			method: "GET",
		});

		if (brandTestResult.success) {
			// If we can access brands, Level 2 is complete
			return {
				success: true,
				data: {
					currentLevel: "level_2",
					isLevel1Complete: true,
					isLevel2Complete: true,
					canCreate10DLC: true,
					requirementsRemaining: [],
				},
			};
		}

		// Check the error to determine verification level
		if (
			brandTestResult.error?.includes("403") ||
			brandTestResult.error?.includes("verification")
		) {
			// 403 means account exists but not verified for 10DLC
			return {
				success: true,
				data: {
					currentLevel: "level_1",
					isLevel1Complete: true,
					isLevel2Complete: false,
					canCreate10DLC: false,
					requirementsRemaining: [
						"Complete Level 2 verification (EIN letter, business license, proof of address)",
					],
					estimatedCompletionDays: 5,
				},
			};
		}

		// Unknown state - assume no verification
		return {
			success: true,
			data: {
				currentLevel: "none",
				isLevel1Complete: false,
				isLevel2Complete: false,
				canCreate10DLC: false,
				requirementsRemaining: [
					"Complete Level 1 verification (ID, payment method, contact info)",
					"Complete Level 2 verification (EIN letter, business license, proof of address)",
				],
				estimatedCompletionDays: 7,
			},
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to check verification status",
		};
	}
}

/**
 * Get verification requirements based on current level
 */
export function getVerificationRequirements(
	currentLevel: VerificationLevel,
): {
	level1: { required: boolean; items: string[] };
	level2: { required: boolean; items: string[] };
} {
	return {
		level1: {
			required: currentLevel === "none",
			items: [
				"Valid government-issued ID (Driver's License, Passport, etc.)",
				"Payment method (Credit card or bank account)",
				"Phone number verification",
				"Email verification",
				"Business address confirmation",
			],
		},
		level2: {
			required: currentLevel === "none" || currentLevel === "level_1",
			items: [
				"IRS EIN Confirmation Letter (CP 575 or 147C)",
				"Business License or Articles of Incorporation",
				"Proof of Business Address (Utility bill, lease agreement)",
				"Government-issued ID for business representative",
				"Tax documents (W-9 or recent tax return)",
			],
		},
	};
}

/**
 * Get next steps based on verification status
 */
export function getNextSteps(
	status: VerificationStatus,
): Array<{ step: string; action: string; url?: string }> {
	const steps: Array<{ step: string; action: string; url?: string }> = [];

	if (!status.isLevel1Complete) {
		steps.push({
			step: "Complete Level 1 Verification",
			action:
				"Visit Telnyx Portal → Account → Public Profile and complete identity verification",
			url: "https://portal.telnyx.com/#/app/account/public-profile",
		});
	}

	if (!status.isLevel2Complete && status.isLevel1Complete) {
		steps.push({
			step: "Complete Level 2 Verification",
			action:
				"Visit Telnyx Portal → Account → Verifications and upload business documents",
			url: "https://portal.telnyx.com/#/app/account/verifications",
		});
	}

	if (status.canCreate10DLC) {
		steps.push({
			step: "Create 10DLC Brand & Campaign",
			action:
				"Run automated setup to create 10DLC brand and campaign (fully automated)",
			url: "/test-telnyx-setup",
		});
	}

	return steps;
}
