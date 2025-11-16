/**
 * Document Manager Service
 *
 * Comprehensive document management for Supabase Storage with:
 * - Context-aware uploads (customer, job, equipment, general)
 * - Automatic path generation
 * - Database tracking
 * - Virus scanning integration
 * - Secure downloads with signed URLs
 * - File operations (move, delete, duplicate)
 */

import crypto from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { formatFileSize, sanitizeFileName, type ValidationOptions, validateFile } from "./file-validator";

// ============================================================================
// TYPES
// ============================================================================

export type DocumentContext = {
	type: "customer" | "job" | "equipment" | "general" | "invoice" | "estimate" | "contract";
	id?: string; // Entity ID (customer_id, job_id, etc.)
	folder?: string; // Custom folder within context
};

export type StorageBucket =
	| "company-files"
	| "customer-documents"
	| "documents"
	| "job-photos"
	| "invoices"
	| "estimates"
	| "contracts"
	| "avatars";

export type UploadOptions = {
	companyId: string;
	context: DocumentContext;
	bucket?: StorageBucket;
	description?: string;
	tags?: string[];
	isPublic?: boolean;
	isInternal?: boolean;
	expiryDate?: Date;
	validationOptions?: ValidationOptions;
	onProgress?: (progress: number) => void;
};

export type UploadResult = {
	success: boolean;
	attachmentId?: string;
	storageUrl?: string;
	storagePath?: string;
	publicUrl?: string;
	error?: string;
	warnings?: string[];
};

export type DocumentMetadata = {
	id: string;
	companyId: string;
	entityType: string;
	entityId?: string;
	fileName: string;
	originalFileName: string;
	fileSize: number;
	mimeType: string;
	storageUrl: string;
	storagePath: string;
	storageBucket: string;
	folderPath?: string;
	virusScanStatus: string;
	isPublic: boolean;
	uploadedBy: string;
	uploadedAt: Date;
	description?: string;
	tags?: string[];
	accessCount: number;
	downloadCount: number;
};

export type ListFilesOptions = {
	companyId: string;
	context?: DocumentContext;
	folder?: string;
	search?: string;
	mimeTypes?: string[];
	uploadedBy?: string;
	virusScanStatus?: string;
	limit?: number;
	offset?: number;
	sortBy?: "created_at" | "file_name" | "file_size" | "access_count";
	sortOrder?: "asc" | "desc";
};

// ============================================================================
// BUCKET SELECTION
// ============================================================================

/**
 * Determine appropriate storage bucket based on context
 */
function selectBucket(context: DocumentContext, customBucket?: StorageBucket): StorageBucket {
	if (customBucket) {
		return customBucket;
	}

	switch (context.type) {
		case "customer":
			return "customer-documents";
		case "job":
			return "job-photos";
		case "invoice":
			return "invoices";
		case "estimate":
			return "estimates";
		case "contract":
			return "contracts";
		default:
			return "company-files";
	}
}

// ============================================================================
// PATH GENERATION
// ============================================================================

/**
 * Generate storage path based on context
 * Format: {companyId}/{contextType}/{entityId?}/{folder?}/{timestamp}-{filename}
 */
export function generateStoragePath(companyId: string, context: DocumentContext, fileName: string): string {
	const sanitized = sanitizeFileName(fileName);
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 8);
	const uniqueFileName = `${timestamp}-${random}-${sanitized}`;

	const parts = [companyId];

	// Add context type
	if (context.type !== "general") {
		parts.push(`${context.type}s`); // customers, jobs, etc.
	} else {
		parts.push("general");
	}

	// Add entity ID if provided
	if (context.id) {
		parts.push(context.id);
	}

	// Add custom folder if provided
	if (context.folder) {
		parts.push(context.folder);
	}

	// Add filename
	parts.push(uniqueFileName);

	return parts.join("/");
}

/**
 * Generate folder path for database tracking
 */
function generateFolderPath(context: DocumentContext): string {
	const parts: string[] = [];

	if (context.type === "general") {
		parts.push("general");
	} else {
		parts.push(`${context.type}s`);
	}

	if (context.id) {
		parts.push(context.id);
	}

	if (context.folder) {
		parts.push(context.folder);
	}

	return `/${parts.join("/")}`;
}

// ============================================================================
// CHECKSUM GENERATION
// ============================================================================

/**
 * Generate SHA256 checksum for file integrity
 */
async function generateChecksum(file: File): Promise<string> {
	const buffer = await file.arrayBuffer();
	const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	return hashHex;
}

// ============================================================================
// UPLOAD FUNCTIONS
// ============================================================================

/**
 * Upload document to storage and track in database
 */
export async function uploadDocument(file: File, options: UploadOptions): Promise<UploadResult> {
	try {
		// 1. Validate file
		const validation = await validateFile(file, options.validationOptions);
		if (!validation.valid) {
			return {
				success: false,
				error: validation.errors.join("; "),
				warnings: validation.warnings,
			};
		}

		// 2. Get Supabase client and user
		const supabase = await createClient();
		if (!supabase) {
			return {
				success: false,
				error: "Supabase client not available",
			};
		}
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return {
				success: false,
				error: "User not authenticated",
			};
		}

		// 3. Verify user has access to company
		const { data: membership } = await supabase
			.from("team_members")
			.select("id, role")
			.eq("user_id", user.id)
			.eq("company_id", options.companyId)
			.eq("status", "active")
			.single();

		if (!membership) {
			return {
				success: false,
				error: "User does not have access to this company",
			};
		}

		// 4. Select bucket and generate path
		const bucket = selectBucket(options.context, options.bucket);
		const storagePath = generateStoragePath(
			options.companyId,
			options.context,
			validation.metadata?.sanitizedName || file.name
		);

		// 5. Upload to storage
		const { data: storageData, error: storageError } = await supabase.storage.from(bucket).upload(storagePath, file, {
			cacheControl: "3600",
			upsert: false,
		});

		if (storageError) {
			return {
				success: false,
				error: `Storage upload failed: ${storageError.message}`,
			};
		}

		// 6. Get public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from(bucket).getPublicUrl(storageData.path);

		// 7. Generate checksum
		const checksum = await generateChecksum(file);

		// 8. Track in database
		const folderPath = generateFolderPath(options.context);

		const { data: attachment, error: dbError } = await supabase
			.from("attachments")
			.insert({
				company_id: options.companyId,
				entity_type: options.context.type,
				entity_id: options.context.id,
				file_name: validation.metadata?.sanitizedName || file.name,
				original_file_name: file.name,
				file_size: file.size,
				mime_type: validation.metadata?.detectedMimeType || file.type,
				storage_provider: "supabase",
				storage_url: publicUrl,
				storage_path: storageData.path,
				storage_bucket: bucket,
				folder_path: folderPath,
				checksum,
				is_image: file.type.startsWith("image/"),
				is_document: file.type.includes("pdf") || file.type.includes("document"),
				is_video: file.type.startsWith("video/"),
				is_public: options.isPublic ?? false,
				is_internal: options.isInternal ?? false,
				description: options.description,
				tags: options.tags || [],
				expiry_date: options.expiryDate,
				uploaded_by: user.id,
				virus_scan_status: "pending",
			})
			.select()
			.single();

		if (dbError) {
			// Rollback: delete from storage
			await supabase.storage.from(bucket).remove([storageData.path]);

			return {
				success: false,
				error: `Database tracking failed: ${dbError.message}`,
			};
		}

		// 9. Queue virus scan (async)
		queueVirusScan(attachment.id, bucket, storageData.path).catch(console.error);

		return {
			success: true,
			attachmentId: attachment.id,
			storageUrl: publicUrl,
			storagePath: storageData.path,
			publicUrl,
			warnings: validation.warnings,
		};
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Upload failed",
		};
	}
}

/**
 * Upload multiple documents
 */
export async function uploadDocuments(files: File[], options: UploadOptions): Promise<UploadResult[]> {
	const results: UploadResult[] = [];

	for (const file of files) {
		const result = await uploadDocument(file, options);
		results.push(result);

		// Update progress if callback provided
		if (options.onProgress) {
			const progress = (results.length / files.length) * 100;
			options.onProgress(progress);
		}
	}

	return results;
}

// ============================================================================
// DOWNLOAD FUNCTIONS
// ============================================================================

/**
 * Get signed download URL for private files
 */
export async function getDownloadUrl(
	attachmentId: string,
	expiresIn = 3600
): Promise<{ url?: string; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { error: "Supabase client not available" };
		}

		// Get attachment details
		const { data: attachment, error: fetchError } = await supabase
			.from("attachments")
			.select("storage_bucket, storage_path, company_id, virus_scan_status")
			.eq("id", attachmentId)
			.single();

		if (fetchError || !attachment) {
			return { error: "File not found" };
		}

		// Verify user has access to company
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return { error: "User not authenticated" };
		}

		const { data: membership } = await supabase
			.from("team_members")
			.select("id")
			.eq("user_id", user.id)
			.eq("company_id", attachment.company_id)
			.eq("status", "active")
			.single();

		if (!membership) {
			return { error: "Access denied" };
		}

		// Check virus scan status
		if (attachment.virus_scan_status === "infected") {
			return { error: "File failed security scan and cannot be downloaded" };
		}

		// Generate signed URL
		const { data, error } = await supabase.storage
			.from(attachment.storage_bucket)
			.createSignedUrl(attachment.storage_path, expiresIn);

		if (error) {
			return { error: error.message };
		}

		// Track download
		await supabase.rpc("track_file_download", {
			p_attachment_id: attachmentId,
		});

		return { url: data.signedUrl };
	} catch (error) {
    console.error("Error:", error);
		return {
			error: error instanceof Error ? error.message : "Failed to generate download URL",
		};
	}
}

// ============================================================================
// LIST AND SEARCH FUNCTIONS
// ============================================================================

/**
 * List documents with filtering and pagination
 */
export async function listDocuments(
	options: ListFilesOptions
): Promise<{ documents: DocumentMetadata[]; total: number; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return {
				documents: [],
				total: 0,
				error: "Supabase client not available",
			};
		}

		// Build query
		let query = supabase
			.from("attachments")
			.select("*", { count: "exact" })
			.eq("company_id", options.companyId)
			.is("deleted_at", null);

		// Apply filters
		if (options.context) {
			query = query.eq("entity_type", options.context.type);
			if (options.context.id) {
				query = query.eq("entity_id", options.context.id);
			}
		}

		if (options.folder) {
			query = query.eq("folder_path", options.folder);
		}

		if (options.search) {
			query = query.or(`file_name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
		}

		if (options.mimeTypes && options.mimeTypes.length > 0) {
			query = query.in("mime_type", options.mimeTypes);
		}

		if (options.uploadedBy) {
			query = query.eq("uploaded_by", options.uploadedBy);
		}

		if (options.virusScanStatus) {
			query = query.eq("virus_scan_status", options.virusScanStatus);
		}

		// Apply sorting
		const sortBy = options.sortBy || "created_at";
		const sortOrder = options.sortOrder || "desc";
		query = query.order(sortBy, { ascending: sortOrder === "asc" });

		// Apply pagination
		const limit = options.limit || 50;
		const offset = options.offset || 0;
		query = query.range(offset, offset + limit - 1);

		const { data, error, count } = await query;

		if (error) {
			return { documents: [], total: 0, error: error.message };
		}

		return {
			documents: data as DocumentMetadata[],
			total: count || 0,
		};
	} catch (error) {
    console.error("Error:", error);
		return {
			documents: [],
			total: 0,
			error: error instanceof Error ? error.message : "Failed to list documents",
		};
	}
}

// ============================================================================
// FILE OPERATIONS
// ============================================================================

/**
 * Delete document (soft delete)
 */
export async function deleteDocument(attachmentId: string): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Supabase client not available" };
		}
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return { success: false, error: "User not authenticated" };
		}

		// Get attachment to verify access
		const { data: attachment } = await supabase
			.from("attachments")
			.select("company_id")
			.eq("id", attachmentId)
			.single();

		if (!attachment) {
			return { success: false, error: "File not found" };
		}

		// Verify access
		const { data: membership } = await supabase
			.from("team_members")
			.select("role")
			.eq("user_id", user.id)
			.eq("company_id", attachment.company_id)
			.eq("status", "active")
			.single();

		if (!membership) {
			return { success: false, error: "Access denied" };
		}

		// Soft delete
		const { error } = await supabase
			.from("attachments")
			.update({
				deleted_at: new Date().toISOString(),
				deleted_by: user.id,
			})
			.eq("id", attachmentId);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Delete failed",
		};
	}
}

/**
 * Move document to different folder
 */
export async function moveDocument(
	attachmentId: string,
	newFolderPath: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Supabase client not available" };
		}

		const { error } = await supabase
			.from("attachments")
			.update({
				folder_path: newFolderPath,
				updated_at: new Date().toISOString(),
			})
			.eq("id", attachmentId);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Move failed",
		};
	}
}

/**
 * Update document metadata
 */
export async function updateDocumentMetadata(
	attachmentId: string,
	updates: {
		description?: string;
		tags?: string[];
		isPublic?: boolean;
		isInternal?: boolean;
		isFavorite?: boolean;
	}
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Supabase client not available" };
		}

		const { error } = await supabase
			.from("attachments")
			.update({ ...updates, updated_at: new Date().toISOString() })
			.eq("id", attachmentId);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Update failed",
		};
	}
}

// ============================================================================
// VIRUS SCANNING
// ============================================================================

/**
 * Queue file for virus scanning
 */
async function queueVirusScan(attachmentId: string, bucket: string, path: string): Promise<void> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return;
		}

		// Call Edge Function to handle scanning
		await supabase.functions.invoke("virus-scan", {
			body: { attachmentId, bucket, path },
		});
	} catch (_error) {}
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get document statistics for company
 */
export async function getDocumentStats(companyId: string): Promise<{
	totalFiles: number;
	totalSize: number;
	byType: Record<string, number>;
	error?: string;
}> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return {
				totalFiles: 0,
				totalSize: 0,
				byType: {},
				error: "Supabase client not available",
			};
		}

		const { data, error } = await supabase
			.from("attachments")
			.select("file_size, mime_type")
			.eq("company_id", companyId)
			.is("deleted_at", null);

		if (error) {
			return { totalFiles: 0, totalSize: 0, byType: {}, error: error.message };
		}

		const totalFiles = data.length;
		const totalSize = data.reduce((sum, file) => sum + file.file_size, 0);
		const byType: Record<string, number> = {};

		data.forEach((file) => {
			const category = file.mime_type.split("/")[0];
			byType[category] = (byType[category] || 0) + 1;
		});

		return { totalFiles, totalSize, byType };
	} catch (error) {
    console.error("Error:", error);
		return {
			totalFiles: 0,
			totalSize: 0,
			byType: {},
			error: error instanceof Error ? error.message : "Failed to get stats",
		};
	}
}

export { formatFileSize };
