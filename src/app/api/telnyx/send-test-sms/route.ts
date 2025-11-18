import { sendTextMessage } from "@/actions/telnyx";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { companyId, to, message } = body;

		if (!companyId || !to || !message) {
			return NextResponse.json(
				{
					success: false,
					error: "companyId, to, and message are required",
				},
				{ status: 400 },
			);
		}

		// Get company's default phone number
		const settingsResponse = await fetch(
			`${request.nextUrl.origin}/api/telnyx/check-settings?companyId=${companyId}`,
		);
		const settingsData = await settingsResponse.json();

		if (!settingsData.ready || !settingsData.defaultNumber) {
			return NextResponse.json({
				success: false,
				error: "Company doesn't have a default outbound number configured",
			});
		}

		const result = await sendTextMessage({
			companyId,
			to,
			from: settingsData.defaultNumber,
			text: message,
		});

		return NextResponse.json(result);
	} catch (error: any) {
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to send test SMS",
			},
			{ status: 500 },
		);
	}
}
