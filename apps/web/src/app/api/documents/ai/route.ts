/**
 * Google Document AI API Route
 *
 * Multi-tenant document processing using Google Document AI.
 * Supports vendor invoices, equipment warranties, permits, contracts, receipts, and OCR.
 * Tracks usage per company for billing and quota management.
 */

import { type NextRequest, NextResponse } from "next/server";
import { checkApiQuota, withUsageTracking } from "@/lib/api/usage-tracking";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { googleDocumentAIService } from "@/lib/services/google-document-ai-service";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
	try {
		// Authenticate user
		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ error: "Database connection failed" },
				{ status: 500 },
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get company context for multi-tenancy
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return NextResponse.json(
				{ error: "No active company selected" },
				{ status: 401 },
			);
		}

		// Check if service is configured
		if (!googleDocumentAIService.isConfigured()) {
			return NextResponse.json(
				{ error: "Document AI service not configured" },
				{ status: 503 },
			);
		}

		// Check quota before processing
		const quota = await checkApiQuota(companyId, "google_document_ai");
		if (quota && !quota.has_quota) {
			return NextResponse.json(
				{
					error: "API quota exceeded",
					currentUsage: quota.current_usage,
					limit: quota.monthly_limit,
				},
				{ status: 429 },
			);
		}

		const body = await request.json();
		const { action, content, gcsUri, mimeType } = body;

		if (!action) {
			return NextResponse.json(
				{ error: "action is required" },
				{ status: 400 },
			);
		}

		if (!content && !gcsUri) {
			return NextResponse.json(
				{ error: "Either content (base64) or gcsUri is required" },
				{ status: 400 },
			);
		}

		if (!mimeType) {
			return NextResponse.json(
				{ error: "mimeType is required" },
				{ status: 400 },
			);
		}

		const input = {
			content,
			gcsUri,
			mimeType,
		};

		// Map action to endpoint name for tracking
		const endpointMap: Record<string, string> = {
			process: "process",
			"extract-text": "extract_text",
			"vendor-invoice": "vendor_invoice",
			"equipment-warranty": "equipment_warranty",
			permit: "permit",
			contract: "contract",
			"equipment-info": "equipment_info",
			receipt: "receipt",
		};

		const endpoint = endpointMap[action];
		if (!endpoint) {
			return NextResponse.json(
				{
					error: `Invalid action: ${action}`,
					validActions: Object.keys(endpointMap),
				},
				{ status: 400 },
			);
		}

		// Execute with usage tracking
		const result = await withUsageTracking(
			companyId,
			"google_document_ai",
			endpoint,
			async () => {
				switch (action) {
					case "process":
						return await googleDocumentAIService.processDocument(input);
					case "extract-text":
						return await googleDocumentAIService.extractText(input);
					case "vendor-invoice":
						return await googleDocumentAIService.processVendorInvoice(input);
					case "equipment-warranty":
						return await googleDocumentAIService.processEquipmentWarranty(
							input,
						);
					case "permit":
						return await googleDocumentAIService.processPermitDocument(input);
					case "contract":
						return await googleDocumentAIService.processCustomerContract(input);
					case "equipment-info":
						return await googleDocumentAIService.extractEquipmentInfo(input);
					case "receipt":
						return await googleDocumentAIService.processReceipt(input);
					default:
						throw new Error(`Unknown action: ${action}`);
				}
			},
		);

		if (!result) {
			return NextResponse.json(
				{ error: "Failed to process document" },
				{ status: 500 },
			);
		}

		return NextResponse.json(result);
	} catch (error) {
		console.error("Document AI API error:", error);

		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * GET endpoint for service configuration check
 */
export async function GET() {
	try {
		const isConfigured = googleDocumentAIService.isConfigured();

		return NextResponse.json({
			configured: isConfigured,
			supportedActions: [
				"process",
				"extract-text",
				"vendor-invoice",
				"equipment-warranty",
				"permit",
				"contract",
				"equipment-info",
				"receipt",
			],
			supportedMimeTypes: [
				"application/pdf",
				"image/png",
				"image/jpeg",
				"image/gif",
				"image/tiff",
				"image/webp",
				"image/bmp",
			],
			maxFileSize: "20MB",
			documentation: "https://cloud.google.com/document-ai/docs",
		});
	} catch (error) {
		console.error("Document AI config check error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
