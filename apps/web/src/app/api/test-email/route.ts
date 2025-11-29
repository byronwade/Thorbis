import { NextResponse } from "next/server";
import { sendTestEmail } from "@/actions/test-email";

/**
 * Test Email API Route
 * 
 * POST /api/test-email
 * Body: { to: string, companyId?: string }
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { to, companyId } = body;

		if (!to || !to.includes("@")) {
			return NextResponse.json(
				{ success: false, error: "Invalid email address" },
				{ status: 400 }
			);
		}

		const result = await sendTestEmail({
			to,
			companyId,
		});

		if (result.success) {
			return NextResponse.json({
				success: true,
				messageId: result.messageId,
				message: `Test email sent successfully to ${to}`,
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error || "Failed to send test email",
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Test email API error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Internal server error",
			},
			{ status: 500 }
		);
	}
}


