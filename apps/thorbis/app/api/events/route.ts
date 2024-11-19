import { NextRequest, NextResponse } from "next/server";

// Define the payload structure
interface EventPayload {
	timestamp: string;
	origin: string;
	contentType: string;
	data: {
		sessionId: string;
		timestamp: number;
		type: string;
		metadata: {
			url: string;
			userAgent: string;
			screenSize: {
				width: number;
				height: number;
			};
		};
		events: Array<Record<string, unknown>>;
	};
}

// Store the last received payload with proper typing
let lastPayload: EventPayload | null = null;

export async function GET() {
	return NextResponse.json({
		message: "Events endpoint ready",
		lastReceivedPayload: lastPayload,
	});
}

export async function POST(request: NextRequest) {
	try {
		// Check if request has content
		const contentLength = request.headers.get("content-length");
		if (!contentLength || parseInt(contentLength) === 0) {
			return NextResponse.json({ error: "Empty payload" }, { status: 400 });
		}

		const text = await request.text();
		if (!text) {
			return NextResponse.json({ error: "Empty payload" }, { status: 400 });
		}

		const payload: EventPayload = JSON.parse(text);
		lastPayload = payload;
		console.log(JSON.stringify(payload, null, 2));
		return NextResponse.json(payload);
	} catch (error) {
		console.error("Error processing payload:", error);
		return NextResponse.json(
			{
				error: "Failed to process payload",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

export async function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	});
}
