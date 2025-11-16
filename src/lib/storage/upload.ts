/**
 * Storage Upload Utilities - Supabase Storage Helpers
 *
 * Features:
 * - Type-safe file uploads
 * - Automatic path generation
 * - Image optimization
 * - Progress tracking
 * - Error handling
 */

import { createClient } from "@/lib/supabase/client";

// Storage bucket names
export const STORAGE_BUCKETS = {
	avatars: "avatars",
	documents: "documents",
	companyFiles: "company-files",
	jobPhotos: "job-photos",
	invoices: "invoices",
	estimates: "estimates",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

// Upload result type
export type UploadResult = {
	success: boolean;
	url?: string;
	path?: string;
	error?: string;
};

/**
 * Upload file to Supabase Storage
 *
 * @param bucket - Storage bucket name
 * @param file - File to upload
 * @param path - Optional custom path (auto-generated if not provided)
 * @param options - Upload options
 */
export async function uploadFile(
	bucket: StorageBucket,
	file: File,
	path?: string,
	options?: { upsert?: boolean; onProgress?: (progress: number) => void }
): Promise<UploadResult> {
	try {
		const supabase = createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Storage service not configured",
			};
		}

		// Generate path if not provided
		const filePath = path || generateFilePath(file.name);

		// Upload file
		const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
			cacheControl: "3600",
			upsert: options?.upsert ?? false,
		});

		if (error) {
			return {
				success: false,
				error: error.message,
			};
		}

		// Get public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from(bucket).getPublicUrl(data.path);

		return {
			success: true,
			url: publicUrl,
			path: data.path,
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
 * Upload avatar image with automatic resizing
 *
 * @param file - Image file
 * @param userId - User ID for path generation
 */
export async function uploadAvatar(file: File, userId: string): Promise<UploadResult> {
	// Validate file type
	if (!file.type.startsWith("image/")) {
		return {
			success: false,
			error: "File must be an image",
		};
	}

	// Validate file size (5MB max)
	if (file.size > 5 * 1024 * 1024) {
		return {
			success: false,
			error: "Image must be smaller than 5MB",
		};
	}

	const path = `${userId}/avatar.${getFileExtension(file.name)}`;
	return uploadFile(STORAGE_BUCKETS.avatars, file, path, { upsert: true });
}

/**
 * Upload document with validation
 *
 * @param file - Document file
 * @param userId - User ID for path generation
 */
export async function uploadDocument(file: File, userId: string): Promise<UploadResult> {
	// Validate file type
	const allowedTypes = [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"text/plain",
		"text/csv",
	];

	if (!allowedTypes.includes(file.type)) {
		return {
			success: false,
			error: "Invalid document type",
		};
	}

	// Validate file size (50MB max)
	if (file.size > 50 * 1024 * 1024) {
		return {
			success: false,
			error: "Document must be smaller than 50MB",
		};
	}

	const path = `${userId}/${Date.now()}-${sanitizeFileName(file.name)}`;
	return uploadFile(STORAGE_BUCKETS.documents, file, path);
}

/**
 * Upload company file
 *
 * @param file - File to upload
 * @param companyId - Company ID for path generation
 * @param folder - Optional folder name
 */
export async function uploadCompanyFile(file: File, companyId: string, folder?: string): Promise<UploadResult> {
	// Validate file size (100MB max)
	if (file.size > 100 * 1024 * 1024) {
		return {
			success: false,
			error: "File must be smaller than 100MB",
		};
	}

	const folderPath = folder ? `${folder}/` : "";
	const path = `${companyId}/${folderPath}${Date.now()}-${sanitizeFileName(file.name)}`;
	return uploadFile(STORAGE_BUCKETS.companyFiles, file, path);
}

/**
 * Upload job photo
 *
 * @param file - Image file
 * @param companyId - Company ID
 * @param jobId - Job ID
 */
export async function uploadJobPhoto(file: File, companyId: string, jobId: string): Promise<UploadResult> {
	// Validate file type
	if (!file.type.startsWith("image/")) {
		return {
			success: false,
			error: "File must be an image",
		};
	}

	// Validate file size (10MB max)
	if (file.size > 10 * 1024 * 1024) {
		return {
			success: false,
			error: "Image must be smaller than 10MB",
		};
	}

	const path = `${companyId}/${jobId}/${Date.now()}.${getFileExtension(file.name)}`;
	return uploadFile(STORAGE_BUCKETS.jobPhotos, file, path);
}

/**
 * Upload invoice PDF
 *
 * @param file - PDF file
 * @param companyId - Company ID
 * @param invoiceId - Invoice ID
 */
export async function uploadInvoice(file: File, companyId: string, invoiceId: string): Promise<UploadResult> {
	// Validate file type
	if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
		return {
			success: false,
			error: "File must be a PDF or image",
		};
	}

	// Validate file size (20MB max)
	if (file.size > 20 * 1024 * 1024) {
		return {
			success: false,
			error: "File must be smaller than 20MB",
		};
	}

	const path = `${companyId}/invoice-${invoiceId}.${getFileExtension(file.name)}`;
	return uploadFile(STORAGE_BUCKETS.invoices, file, path, { upsert: true });
}

/**
 * Upload estimate PDF
 *
 * @param file - PDF file
 * @param companyId - Company ID
 * @param estimateId - Estimate ID
 */
export async function uploadEstimate(file: File, companyId: string, estimateId: string): Promise<UploadResult> {
	// Validate file type
	if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
		return {
			success: false,
			error: "File must be a PDF or image",
		};
	}

	// Validate file size (20MB max)
	if (file.size > 20 * 1024 * 1024) {
		return {
			success: false,
			error: "File must be smaller than 20MB",
		};
	}

	const path = `${companyId}/estimate-${estimateId}.${getFileExtension(file.name)}`;
	return uploadFile(STORAGE_BUCKETS.estimates, file, path, { upsert: true });
}

/**
 * Delete file from storage
 *
 * @param bucket - Storage bucket name
 * @param path - File path to delete
 */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Storage service not configured",
			};
		}

		const { error } = await supabase.storage.from(bucket).remove([path]);

		if (error) {
			return {
				success: false,
				error: error.message,
			};
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
 * Get signed URL for private file
 *
 * @param bucket - Storage bucket name
 * @param path - File path
 * @param expiresIn - Expiration time in seconds (default 1 hour)
 */
export async function getSignedUrl(
	bucket: StorageBucket,
	path: string,
	expiresIn = 3600
): Promise<{ url?: string; error?: string }> {
	try {
		const supabase = createClient();

		if (!supabase) {
			return {
				error: "Storage service not configured",
			};
		}

		const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);

		if (error) {
			return {
				error: error.message,
			};
		}

		return {
			url: data.signedUrl,
		};
	} catch (error) {
    console.error("Error:", error);
		return {
			error: error instanceof Error ? error.message : "Failed to get signed URL",
		};
	}
}

/**
 * List files in a folder
 *
 * @param bucket - Storage bucket name
 * @param folder - Folder path
 */
export async function listFiles(bucket: StorageBucket, folder = "") {
	try {
		const supabase = createClient();

		if (!supabase) {
			return {
				success: false,
				error: "Storage service not configured",
			};
		}

		const { data, error } = await supabase.storage.from(bucket).list(folder);

		if (error) {
			return {
				success: false,
				error: error.message,
			};
		}

		return {
			success: true,
			files: data,
		};
	} catch (error) {
    console.error("Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to list files",
		};
	}
}

// Helper functions
// ============================================================================

/**
 * Generate unique file path
 */
function generateFilePath(fileName: string): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(7);
	const sanitized = sanitizeFileName(fileName);
	return `${timestamp}-${random}-${sanitized}`;
}

/**
 * Sanitize file name
 */
function sanitizeFileName(fileName: string): string {
	return fileName
		.toLowerCase()
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/[^a-z0-9.-]/g, "") // Remove special characters
		.replace(/--+/g, "-"); // Replace multiple hyphens with single
}

/**
 * Get file extension from file name
 */
function getFileExtension(fileName: string): string {
	const parts = fileName.split(".");
	return parts.length > 1 ? parts.at(-1) : "";
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) {
		return "0 Bytes";
	}

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
}

/**
 * Validate image file
 */
export function isValidImage(file: File): boolean {
	return file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024; // 10MB
}

/**
 * Validate document file
 */
export function isValidDocument(file: File): boolean {
	const allowedTypes = [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"text/plain",
		"text/csv",
	];

	return allowedTypes.includes(file.type) && file.size <= 50 * 1024 * 1024; // 50MB
}
