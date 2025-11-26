/**
 * Format Detection API
 *
 * POST /api/import/detect-format
 *
 * Accepts file upload or sample data and uses AI to detect:
 * - Source platform (ServiceTitan, Housecall Pro, Jobber, etc.)
 * - Entity type (customers, jobs, invoices, etc.)
 * - Data quality issues
 * - Suggested field mappings
 */

import { type NextRequest, NextResponse } from "next/server";
import { detectFormat } from "@/lib/import/ai/format-detection";
import { GenericCSVConnector } from "@/lib/import/connectors/generic-csv";
import type { FormatDetectionResult } from "@/types/import";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const sampleDataStr = formData.get("sampleData") as string | null;

		if (!file && !sampleDataStr) {
			return NextResponse.json(
				{ error: "Either file or sampleData must be provided" },
				{ status: 400 },
			);
		}

		let headers: string[] = [];
		let sampleData: Record<string, unknown>[] = [];
		let fileName: string | undefined;
		let fileSize: number | undefined;
		let rowCount: number | undefined;

		if (file) {
			// Parse CSV file
			fileName = file.name;
			fileSize = file.size;

			const fileContent = await file.text();

			const connector = new GenericCSVConnector(
				{
					platform: "csv",
					credentials: { platform: "csv" },
					companyId: "temp",
					userId: "temp",
				},
				{
					fileContent,
					hasHeaders: true,
				},
			);

			// Get schema (which detects headers)
			const schema = await connector.getSchema("customers");
			headers = schema.fields.map((f) => f.name);

			// Get sample data (first 10 records)
			sampleData = await connector.preview(10);
			rowCount = await connector.estimateRecordCount("customers");
		} else if (sampleDataStr) {
			// Parse provided sample data
			try {
				const parsed = JSON.parse(sampleDataStr);
				if (Array.isArray(parsed) && parsed.length > 0) {
					sampleData = parsed;
					headers = Object.keys(parsed[0]);
				} else {
					return NextResponse.json(
						{ error: "sampleData must be a non-empty array of objects" },
						{ status: 400 },
					);
				}
			} catch (error) {
				return NextResponse.json(
					{ error: "Invalid JSON in sampleData" },
					{ status: 400 },
				);
			}
		}

		// Run AI format detection
		const result: FormatDetectionResult = await detectFormat({
			headers,
			sampleData,
			fileName,
			fileSize,
			rowCount,
		});

		return NextResponse.json({
			success: true,
			data: result,
		});
	} catch (error) {
		console.error("Format detection error:", error);

		return NextResponse.json(
			{
				success: false,
				error: {
					message:
						error instanceof Error ? error.message : "Format detection failed",
					code: "FORMAT_DETECTION_ERROR",
				},
			},
			{ status: 500 },
		);
	}
}

// OPTIONS for CORS
export async function OPTIONS() {
	return new NextResponse(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	});
}
