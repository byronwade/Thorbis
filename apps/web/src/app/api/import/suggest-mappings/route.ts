/**
 * Field Mapping Suggestions API
 *
 * POST /api/import/suggest-mappings
 *
 * Uses AI to suggest field mappings from source schema to target schema
 */

import { type NextRequest, NextResponse } from "next/server";
import { suggestFieldMappings } from "@/lib/import/ai/field-mapping";
import type { EntityType, SchemaField } from "@/types/import";

// Stratos target schemas for each entity type
const TARGET_SCHEMAS: Record<EntityType, SchemaField[]> = {
	customers: [
		{ name: "first_name", type: "string", required: false },
		{ name: "last_name", type: "string", required: false },
		{
			name: "display_name",
			type: "string",
			required: true,
			description: "Customer display name",
		},
		{
			name: "email",
			type: "string",
			required: true,
			description: "Email address",
		},
		{
			name: "phone",
			type: "string",
			required: true,
			description: "Phone number",
		},
		{ name: "address", type: "string", required: false },
		{ name: "city", type: "string", required: false },
		{ name: "state", type: "string", required: false },
		{ name: "zip", type: "string", required: false },
		{
			name: "type",
			type: "string",
			required: false,
			description: "residential, commercial, or industrial",
		},
		{ name: "company_name", type: "string", required: false },
		{ name: "notes", type: "string", required: false },
		{ name: "tags", type: "array", required: false },
	],
	jobs: [
		{ name: "customer_id", type: "string", required: true },
		{ name: "property_id", type: "string", required: false },
		{ name: "title", type: "string", required: true },
		{ name: "description", type: "string", required: false },
		{ name: "status", type: "string", required: false },
		{ name: "priority", type: "string", required: false },
		{ name: "scheduled_date", type: "datetime", required: false },
		{ name: "completed_date", type: "datetime", required: false },
	],
	invoices: [
		{ name: "customer_id", type: "string", required: true },
		{ name: "job_id", type: "string", required: false },
		{ name: "invoice_number", type: "string", required: true },
		{ name: "status", type: "string", required: false },
		{ name: "total", type: "number", required: true },
		{ name: "subtotal", type: "number", required: false },
		{ name: "tax", type: "number", required: false },
		{ name: "due_date", type: "date", required: false },
	],
	// Add more entity types as needed
} as Partial<Record<EntityType, SchemaField[]>>;

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const { sourceFields, entityType, platform } = body as {
			sourceFields: { name: string; sampleValues: unknown[] }[];
			entityType: EntityType;
			platform?: string;
		};

		if (!sourceFields || !Array.isArray(sourceFields)) {
			return NextResponse.json(
				{ error: "sourceFields must be an array" },
				{ status: 400 },
			);
		}

		if (!entityType) {
			return NextResponse.json(
				{ error: "entityType is required" },
				{ status: 400 },
			);
		}

		const targetSchema = TARGET_SCHEMAS[entityType];
		if (!targetSchema) {
			return NextResponse.json(
				{ error: `Unknown entity type: ${entityType}` },
				{ status: 400 },
			);
		}

		// Generate AI-powered mapping suggestions
		const mappings = await suggestFieldMappings({
			sourceFields,
			targetSchema,
			entityType,
			platform,
		});

		return NextResponse.json({
			success: true,
			data: {
				mappings,
				targetSchema,
			},
		});
	} catch (error) {
		console.error("Field mapping error:", error);

		return NextResponse.json(
			{
				success: false,
				error: {
					message:
						error instanceof Error ? error.message : "Field mapping failed",
					code: "FIELD_MAPPING_ERROR",
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
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	});
}
