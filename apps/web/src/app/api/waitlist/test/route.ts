import { NextResponse } from "next/server";
import { joinWaitlist } from "@/actions/waitlist";
import { Resend } from "resend";

/**
 * Test Waitlist API Route
 * 
 * POST /api/waitlist/test
 * Body: { email: string, name: string }
 * 
 * Tests the waitlist signup functionality including:
 * - Resend contact creation
 * - Email sending
 * - Duplicate detection
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email, name } = body;

		if (!email || !email.includes("@")) {
			return NextResponse.json(
				{ success: false, error: "Invalid email address" },
				{ status: 400 }
			);
		}

		if (!name || name.trim().length < 2) {
			return NextResponse.json(
				{ success: false, error: "Name must be at least 2 characters" },
				{ status: 400 }
			);
		}

		// Test Resend API connection
		const resend = new Resend(process.env.RESEND_API_KEY);
		let resendStatus = "not_configured";
		let audienceInfo = null;

		if (process.env.RESEND_API_KEY) {
			try {
				const { data: audiences, error } = await resend.audiences.list();
				if (error) {
					resendStatus = "error";
					console.error("Resend API error:", error);
				} else {
					resendStatus = "connected";
					const waitlistAudience = audiences?.data?.find(
						(a) => a.name.toLowerCase().includes("waitlist")
					);
					audienceInfo = waitlistAudience
						? {
								id: waitlistAudience.id,
								name: waitlistAudience.name,
								createdAt: waitlistAudience.created_at,
							}
						: null;
				}
			} catch (error) {
				resendStatus = "error";
				console.error("Resend connection test error:", error);
			}
		}

		// Test waitlist signup
		const formData = new FormData();
		formData.append("email", email);
		formData.append("name", name);

		const result = await joinWaitlist(formData);

		return NextResponse.json({
			success: result.success,
			message: result.message,
			error: result.error,
			resend: {
				status: resendStatus,
				apiKeyConfigured: !!process.env.RESEND_API_KEY,
				audienceId: process.env.RESEND_WAITLIST_AUDIENCE_ID || null,
				audience: audienceInfo,
			},
		});
	} catch (error) {
		console.error("Waitlist test API error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Internal server error",
			},
			{ status: 500 }
		);
	}
}

/**
 * GET /api/waitlist/test
 * 
 * Returns waitlist configuration status without making changes
 */
export async function GET() {
	try {
		const resend = new Resend(process.env.RESEND_API_KEY);
		let resendStatus = "not_configured";
		let audienceInfo = null;
		let contactCount = null;

		if (process.env.RESEND_API_KEY) {
			try {
				const { data: audiences, error } = await resend.audiences.list();
				if (error) {
					resendStatus = "error";
					console.error("Resend API error:", error);
				} else {
					resendStatus = "connected";
					const waitlistAudience = audiences?.data?.find(
						(a) => a.name.toLowerCase().includes("waitlist")
					);
					
					if (waitlistAudience) {
						audienceInfo = {
							id: waitlistAudience.id,
							name: waitlistAudience.name,
							createdAt: waitlistAudience.created_at,
						};

						// Get contact count
						try {
							const { data: contacts } = await resend.contacts.list({
								audienceId: waitlistAudience.id,
							});
							contactCount = contacts?.data?.length || 0;
						} catch (contactError) {
							console.error("Error getting contact count:", contactError);
						}
					}
				}
			} catch (error) {
				resendStatus = "error";
				console.error("Resend connection test error:", error);
			}
		}

		return NextResponse.json({
			success: true,
			resend: {
				status: resendStatus,
				apiKeyConfigured: !!process.env.RESEND_API_KEY,
				audienceId: process.env.RESEND_WAITLIST_AUDIENCE_ID || null,
				audience: audienceInfo,
				contactCount,
			},
		});
	} catch (error) {
		console.error("Waitlist test API error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Internal server error",
			},
			{ status: 500 }
		);
	}
}

