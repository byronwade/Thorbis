import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@stratos/config/env";

/**
 * Verify Waitlist Resend Integration
 * 
 * GET /api/waitlist/verify
 * 
 * Verifies that Resend is properly configured and can:
 * - Connect to Resend API
 * - List/create audiences
 * - Check contact creation capability
 */
export async function GET() {
	try {
		const apiKey = env.resend.apiKey;
		
		if (!apiKey) {
			return NextResponse.json({
				success: false,
				configured: false,
				error: "RESEND_API_KEY not set in environment variables",
				message: "Resend integration is not configured. Set RESEND_API_KEY to enable waitlist contact management.",
			});
		}

		const resend = new Resend(apiKey);

		// Test 1: List audiences
		let audiencesTest = { success: false, error: null as string | null, audiences: null as any };
		try {
			const { data: audiences, error } = await resend.audiences.list();
			if (error) {
				audiencesTest.error = error.message || "Unknown error";
			} else {
				audiencesTest.success = true;
				audiencesTest.audiences = audiences?.data || [];
			}
		} catch (err) {
			audiencesTest.error = err instanceof Error ? err.message : "Failed to list audiences";
		}

		// Test 2: Find or create waitlist audience
		let audienceTest = { success: false, error: null as string | null, audience: null as any };
		try {
			if (audiencesTest.success && audiencesTest.audiences) {
				const waitlistAudience = audiencesTest.audiences.find(
					(a: any) => a.name.toLowerCase().includes("waitlist")
				);

				if (waitlistAudience) {
					audienceTest.success = true;
					audienceTest.audience = {
						id: waitlistAudience.id,
						name: waitlistAudience.name,
						createdAt: waitlistAudience.created_at,
					};
				} else {
					// Try to create one
					const { data: newAudience, error: createError } = await resend.audiences.create({
						name: "Thorbis Waitlist",
					});

					if (createError) {
						audienceTest.error = createError.message || "Failed to create audience";
					} else {
						audienceTest.success = true;
						audienceTest.audience = {
							id: newAudience?.id,
							name: newAudience?.name,
							createdAt: newAudience?.created_at,
						};
					}
				}
			} else {
				audienceTest.error = "Cannot test audience creation - failed to list audiences";
			}
		} catch (err) {
			audienceTest.error = err instanceof Error ? err.message : "Failed to get/create audience";
		}

		// Test 3: Check contact count if audience exists
		let contactTest = { success: false, count: 0, error: null as string | null };
		if (audienceTest.success && audienceTest.audience) {
			try {
				const { data: contacts, error: contactsError } = await resend.contacts.list({
					audienceId: audienceTest.audience.id,
				});

				if (contactsError) {
					contactTest.error = contactsError.message || "Failed to list contacts";
				} else {
					contactTest.success = true;
					contactTest.count = contacts?.data?.length || 0;
				}
			} catch (err) {
				contactTest.error = err instanceof Error ? err.message : "Failed to get contacts";
			}
		}

		const allTestsPassed = audiencesTest.success && audienceTest.success;

		return NextResponse.json({
			success: allTestsPassed,
			configured: true,
			tests: {
				apiConnection: {
					success: !!apiKey,
					message: apiKey ? "API key is configured" : "API key missing",
				},
				listAudiences: {
					success: audiencesTest.success,
					error: audiencesTest.error,
					count: audiencesTest.audiences?.length || 0,
				},
				waitlistAudience: {
					success: audienceTest.success,
					error: audienceTest.error,
					audience: audienceTest.audience,
				},
				contacts: {
					success: contactTest.success,
					error: contactTest.error,
					count: contactTest.count,
				},
			},
			message: allTestsPassed
				? "Resend integration is working correctly"
				: "Resend integration has issues - check errors above",
		});
	} catch (error) {
		console.error("Waitlist verification error:", error);
		return NextResponse.json(
			{
				success: false,
				configured: false,
				error: error instanceof Error ? error.message : "Internal server error",
			},
			{ status: 500 }
		);
	}
}

