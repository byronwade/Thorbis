/**
 * Data Validation API
 *
 * POST /api/import/validate
 *
 * Validates import data before actual import (dry run)
 */

import { type NextRequest, NextResponse } from "next/server";
import { detectDuplicates } from "@/lib/import/ai/duplicate-detection";
import { DataValidator } from "@/lib/import/processors/validator";
import type { EntityType, FieldMapping } from "@/types/import";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const {
			records,
			entityType,
			mappings,
			checkDuplicates = true,
		} = body as {
			records: Record<string, unknown>[];
			entityType: EntityType;
			mappings?: FieldMapping[];
			checkDuplicates?: boolean;
		};

		if (!records || !Array.isArray(records)) {
			return NextResponse.json(
				{ error: "records must be an array" },
				{ status: 400 },
			);
		}

		if (!entityType) {
			return NextResponse.json(
				{ error: "entityType is required" },
				{ status: 400 },
			);
		}

		// Validate records
		const validator = new DataValidator();
		const validationResult = await validator.validateBatch(
			records,
			entityType,
			mappings,
		);

		// Check for duplicates if requested
		let duplicates = [];
		if (checkDuplicates && entityType === "customers") {
			duplicates = detectDuplicates(records as any[]);
		}

		// Calculate estimated import time
		const estimatedDurationSeconds = Math.ceil(records.length / 167); // ~10,000 records/min

		return NextResponse.json({
			success: true,
			data: {
				...validationResult,
				duplicates,
				stats: validator.getStats(),
				estimatedDurationSeconds,
			},
		});
	} catch (error) {
		console.error("Validation error:", error);

		return NextResponse.json(
			{
				success: false,
				error: {
					message: error instanceof Error ? error.message : "Validation failed",
					code: "VALIDATION_ERROR",
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
