/**
 * Import Execution API
 *
 * POST /api/import/execute
 *
 * Executes the actual data import in the background
 * Returns job ID for progress tracking
 */

import { type NextRequest, NextResponse } from "next/server";
import { BatchProcessor } from "@/lib/import/processors/batch-processor";
import { DataTransformer } from "@/lib/import/processors/transformer";
import { DataValidator } from "@/lib/import/processors/validator";
import { ProgressTracker } from "@/lib/import/utils/progress-tracker";
import { createClient } from "@/lib/supabase/server";
import type {
	DuplicateHandlingStrategy,
	EntityType,
	FieldMapping,
} from "@/types/import";

export const maxDuration = 300; // 5 minutes (Vercel Pro plan)

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const {
			records,
			entityType,
			mappings,
			companyId,
			userId,
			isDryRun = false,
			duplicateHandling = "skip",
			sourcePlatform,
			mappingId,
		} = body as {
			records: Record<string, unknown>[];
			entityType: EntityType;
			mappings: FieldMapping[];
			companyId: string;
			userId: string;
			isDryRun?: boolean;
			duplicateHandling?: DuplicateHandlingStrategy;
			sourcePlatform?: string;
			mappingId?: string;
		};

		// Validation
		if (!records || !Array.isArray(records) || records.length === 0) {
			return NextResponse.json(
				{ error: "records must be a non-empty array" },
				{ status: 400 },
			);
		}

		if (!entityType) {
			return NextResponse.json(
				{ error: "entityType is required" },
				{ status: 400 },
			);
		}

		if (!companyId || !userId) {
			return NextResponse.json(
				{ error: "companyId and userId are required" },
				{ status: 400 },
			);
		}

		// Create import job record
		const supabase = await createClient();

		const { data: importJob, error: importError } = await supabase
			.from("data_imports")
			.insert({
				company_id: companyId,
				user_id: userId,
				data_type: entityType,
				source_platform: sourcePlatform,
				mapping_id: mappingId,
				total_rows: records.length,
				successful_rows: 0,
				failed_rows: 0,
				status: "in_progress",
				is_dry_run: isDryRun,
				duplicate_handling_strategy: duplicateHandling,
				estimated_duration_seconds: Math.ceil(records.length / 167), // ~10,000 records/min
				rollback_available_until: new Date(
					Date.now() + 24 * 60 * 60 * 1000,
				).toISOString(), // 24 hours
			})
			.select("id")
			.single();

		if (importError || !importJob) {
			throw new Error("Failed to create import job");
		}

		const importId = importJob.id;

		// Start background import process
		// Note: In production, this should use Inngest or similar job queue
		// For now, we'll process it synchronously with a timeout
		processImportInBackground(
			importId,
			records,
			entityType,
			mappings,
			companyId,
			isDryRun,
			duplicateHandling,
		).catch((error) => {
			console.error(`Import ${importId} failed:`, error);
		});

		return NextResponse.json({
			success: true,
			data: {
				importId,
				status: "in_progress",
				totalRecords: records.length,
				estimatedDurationSeconds: Math.ceil(records.length / 167),
			},
		});
	} catch (error) {
		console.error("Import execution error:", error);

		return NextResponse.json(
			{
				success: false,
				error: {
					message:
						error instanceof Error ? error.message : "Import execution failed",
					code: "IMPORT_EXECUTION_ERROR",
				},
			},
			{ status: 500 },
		);
	}
}

/**
 * Background import processing
 */
async function processImportInBackground(
	importId: string,
	records: Record<string, unknown>[],
	entityType: EntityType,
	mappings: FieldMapping[],
	companyId: string,
	isDryRun: boolean,
	duplicateHandling: DuplicateHandlingStrategy,
): Promise<void> {
	const totalBatches = Math.ceil(records.length / 1000);
	const tracker = new ProgressTracker(importId, records.length, totalBatches);

	try {
		await tracker.setStatus("in_progress");

		// Step 1: Transform data
		const transformer = new DataTransformer();
		const transformedRecords = await transformer.transformBatch(
			records,
			mappings,
		);

		// Step 2: Validate data
		const validator = new DataValidator();
		const validationResult = await validator.validateBatch(
			transformedRecords,
			entityType,
			mappings,
		);

		if (!validationResult.valid) {
			await tracker.addErrors(validationResult.errors);

			// If too many errors, fail the import
			if (validationResult.invalidRecords.length / records.length > 0.1) {
				// > 10% error rate
				await tracker.markFailed("Too many validation errors (> 10%)");
				return;
			}
		}

		// Use only valid records
		const recordsToImport = validationResult.validRecords;

		if (isDryRun) {
			// Dry run - just validate, don't insert
			await tracker.updateProgress(
				recordsToImport.length,
				recordsToImport.length,
				0,
			);
			await tracker.markComplete();
			return;
		}

		// Step 3: Batch insert with progress tracking
		const processor = new BatchProcessor();

		const result = await processor.processBatches(
			recordsToImport,
			entityType,
			companyId,
			(processed, total) => {
				const stats = processor.getStats();
				tracker.updateProgress(
					processed,
					stats.successCount,
					stats.failureCount,
				);
			},
		);

		// Add any errors from batch processing
		if (result.errors.length > 0) {
			await tracker.addErrors(result.errors);
		}

		// Mark as complete
		await tracker.markComplete();
	} catch (error) {
		console.error(`Import ${importId} failed:`, error);
		await tracker.markFailed(
			error instanceof Error ? error.message : "Import failed",
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
