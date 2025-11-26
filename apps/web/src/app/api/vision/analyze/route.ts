/**
 * Vision Analysis API Route
 *
 * Analyzes images using Google Cloud Vision API
 * - Equipment/serial number scanning
 * - Document OCR
 * - Barcode detection
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { googleVisionService } from "@/lib/services/google-vision-service";

// Body size limit is handled by Next.js automatically
// For large uploads, consider using streaming or external storage

export async function POST(request: NextRequest) {
	// Verify authentication
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const contentType = request.headers.get("content-type") || "";

		let imageSource: string;
		let analysisType: string = "equipment";

		if (contentType.includes("multipart/form-data")) {
			// Handle form data upload
			const formData = await request.formData();
			const file = formData.get("image") as File | null;
			analysisType = (formData.get("type") as string) || "equipment";

			if (!file) {
				return NextResponse.json(
					{ error: "Image file is required" },
					{ status: 400 },
				);
			}

			// Convert file to base64
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);
			imageSource = buffer.toString("base64");
		} else {
			// Handle JSON body
			const body = await request.json();
			imageSource = body.image; // Can be base64 or URL
			analysisType = body.type || "equipment";

			if (!imageSource) {
				return NextResponse.json(
					{ error: "Image (base64 or URL) is required" },
					{ status: 400 },
				);
			}
		}

		// Check service availability
		if (!googleVisionService.isAvailable()) {
			return NextResponse.json(
				{ error: "Vision service not configured" },
				{ status: 503 },
			);
		}

		let result;

		switch (analysisType) {
			case "equipment":
				result = await googleVisionService.analyzeEquipment(imageSource);
				break;

			case "document":
				result = await googleVisionService.scanDocument(imageSource);
				break;

			case "barcode": {
				const barcodes = await googleVisionService.detectBarcodes(imageSource);
				result = { barcodes };
				break;
			}

			case "text": {
				const text = await googleVisionService.extractText(imageSource);
				result = { text };
				break;
			}

			default:
				return NextResponse.json(
					{
						error:
							"Invalid analysis type. Use: equipment, document, barcode, or text",
					},
					{ status: 400 },
				);
		}

		if (!result) {
			return NextResponse.json(
				{ error: "Failed to analyze image" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			success: true,
			type: analysisType,
			data: result,
		});
	} catch (error) {
		console.error("Vision analysis error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
