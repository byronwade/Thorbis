/**
 * Import Progress API
 *
 * GET /api/import/progress/[id]
 *
 * Returns current progress of an import job
 * Supports both polling and WebSocket/Realtime
 */

import { type NextRequest, NextResponse } from "next/server";
import { pollImportProgress } from "@/lib/import/utils/progress-tracker";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ error: "Import ID is required" },
				{ status: 400 },
			);
		}

		const progress = await pollImportProgress(id);

		if (!progress) {
			return NextResponse.json(
				{ error: "Import job not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: progress,
		});
	} catch (error) {
		console.error("Progress polling error:", error);

		return NextResponse.json(
			{
				success: false,
				error: {
					message:
						error instanceof Error ? error.message : "Failed to get progress",
					code: "PROGRESS_ERROR",
				},
			},
			{ status: 500 },
		);
	}
}

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	});
}
