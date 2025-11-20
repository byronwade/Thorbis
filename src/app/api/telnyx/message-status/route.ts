import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const messageId = searchParams.get("messageId");

	if (!messageId) {
		return NextResponse.json(
			{ error: "messageId is required" },
			{ status: 400 },
		);
	}

	const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
	if (!TELNYX_API_KEY) {
		return NextResponse.json(
			{ error: "TELNYX_API_KEY not configured" },
			{ status: 500 },
		);
	}

	try {
		const response = await fetch(
			`https://api.telnyx.com/v2/messages/${messageId}`,
			{
				headers: {
					Authorization: `Bearer ${TELNYX_API_KEY}`,
					"Content-Type": "application/json",
				},
			},
		);

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{
					error: `Telnyx API error: ${response.status}`,
					details: data,
				},
				{ status: response.status },
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to fetch message status",
			},
			{ status: 500 },
		);
	}
}
