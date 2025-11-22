/**
 * Document Server Actions
 *
 * Server-side actions for document management with:
 * - Permission checks
 * - Audit logging
 * - Error handling
 * - Type-safe interfaces
 */

"use server";

import { revalidatePath } from "next/cache";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	type DocumentContext,
	deleteDocument as deleteDocumentService,
	getDocumentStats as getDocumentStatsService,
	getDownloadUrl as getDownloadUrlService,
	type ListFilesOptions,
	listDocuments as listDocumentsService,
	moveDocument as moveDocumentService,
	type UploadOptions,
	updateDocumentMetadata as updateMetadataService,
	uploadDocument as uploadDocumentService,
	uploadDocuments as uploadDocumentsService,
} from "@/lib/storage/document-manager";
import { validateFile } from "@/lib/storage/file-validator";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// TYPES
// ============================================================================

export type ActionResult<T = void> = {
	success: boolean;
	data?: T;
	error?: string;
	warnings?: string[];
};

export type UploadDocumentResult = {
	attachmentId: string;
	fileName: string;
	fileSize: number;
	storageUrl: string;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Verify user has access to company
 */
async function verifyCompanyAccess(
	companyId: string,
	requiredRole?: string[],
): Promise<{ userId: string; role: string } | null> {
	const supabase = await createClient();
	if (!supabase) {
		return null;
	}

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();
	if (authError || !user) {
		return null;
	}

	const { data: membership, error } = await supabase
		.from("company_memberships")
		.select("id, role")
		.eq("user_id", user.id)
		.eq("company_id", companyId)
		.eq("status", "active")
		.single();

	if (error || !membership) {
		return null;
	}

	if (requiredRole && !requiredRole.includes(membership.role)) {
		return null;
	}

	return { userId: user.id, role: membership.role };
}

/**
 * Log document action to audit trail
 */
async function logDocumentAction(
	companyId: string,
	userId: string,
	action: string,
	details: Record<string, unknown>,
): Promise<void> {
	const supabase = await createClient();
	if (!supabase) {
		return;
	}

	await supabase.from("activity_log").insert({
		company_id: companyId,
		user_id: userId,
		action,
		entity_type: "document",
		details,
		created_at: new Date().toISOString(),
	});
}

// ============================================================================
// UPLOAD ACTIONS
// ============================================================================

/**
 * Upload a single document
 */
export async function uploadDocument(
	formData: FormData,
): Promise<ActionResult<UploadDocumentResult>> {
	try {
		const {
			file,
			companyId,
			contextType,
			contextId,
			folder,
			description,
			tagsRaw,
		} = extractUploadFormData(formData);

		const validateResult = await validateUploadInputs(file, contextType);
		if (validateResult) {
			return validateResult;
		}

		const activeCompanyId = await getActiveCompanyId();
		if (!activeCompanyId) {
			return {
				success: false,
				error: "No active company found. Please select a company.",
			};
		}

		const targetCompanyId = companyId || activeCompanyId;

		if (contextType === "job" && contextId) {
			return handleJobDocumentUpload({
				file,
				contextType,
				contextId,
				folder,
				description,
				tagsRaw,
				activeCompanyId,
			});
		}

		return handleNonJobDocumentUpload({
			file,
			contextType,
			contextId,
			folder,
			description,
			tagsRaw,
			targetCompanyId,
			activeCompanyId,
		});
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Upload failed",
		};
	}
}

type UploadContextType = DocumentContext["type"];

type UploadFormData = {
	file: File;
	companyId: string;
	contextType: UploadContextType;
	contextId?: string;
	folder?: string;
	description?: string;
	tagsRaw?: string;
};

type UploadHandlerBaseParams = {
	file: File;
	contextType: UploadContextType;
	contextId?: string;
	folder?: string;
	description?: string;
	tagsRaw?: string;
};

type JobUploadParams = UploadHandlerBaseParams & {
	contextId: string;
	activeCompanyId: string;
};

type NonJobUploadParams = UploadHandlerBaseParams & {
	targetCompanyId: string;
	activeCompanyId: string;
};

function extractUploadFormData(formData: FormData): UploadFormData {
	const file = formData.get("file") as File;
	const companyId = (formData.get("companyId") as string) ?? "";
	const contextType = formData.get("contextType") as UploadContextType;
	const contextId = formData.get("contextId") as string | undefined;
	const folder = formData.get("folder") as string | undefined;
	const description = formData.get("description") as string | undefined;
	const tagsRaw = formData.get("tags") as string | undefined;

	return {
		file,
		companyId,
		contextType,
		contextId,
		folder,
		description,
		tagsRaw,
	};
}

function validateUploadInputs(
	file: File | undefined,
	contextType: UploadContextType | undefined,
): ActionResult<UploadDocumentResult> | undefined {
	if (!(file && contextType)) {
		return {
			success: false,
			error: "Missing required fields",
		};
	}

	return;
}

function parseTags(tagsRaw?: string): string[] | undefined {
	if (!tagsRaw) {
		return;
	}

	try {
		return JSON.parse(tagsRaw) as string[];
	} catch {
		return;
	}
}

async function validateJobContext(
	contextId: string,
	activeCompanyId: string,
): Promise<{ companyId: string } | ActionResult<UploadDocumentResult>> {
	const supabase = await createClient();
	if (!supabase) {
		return {
			success: false,
			error: "Server configuration error",
		};
	}

	const { data: job, error: jobError } = await supabase
		.from("jobs")
		.select("company_id")
		.eq("id", contextId)
		.single();

	if (jobError || !job) {
		return {
			success: false,
			error: "Job not found",
		};
	}

	if (job.company_id !== activeCompanyId) {
		return {
			success: false,
			error: "Access denied - This job belongs to a different company",
		};
	}

	return { companyId: job.company_id };
}

async function handleJobDocumentUpload(
	params: JobUploadParams,
): Promise<ActionResult<UploadDocumentResult>> {
	const validationResult = await validateJobContext(
		params.contextId,
		params.activeCompanyId,
	);

	if ("success" in validationResult && !validationResult.success) {
		return validationResult;
	}

	const { companyId } = validationResult as { companyId: string };

	const access = await verifyCompanyAccess(companyId);
	if (!access) {
		return {
			success: false,
			error:
				"Access denied - You must be an active member of this company to upload files",
		};
	}

	const parsedTags = parseTags(params.tagsRaw);
	if (params.tagsRaw && !parsedTags) {
		return {
			success: false,
			error: "Invalid tags format",
		};
	}

	const context: DocumentContext = {
		type: params.contextType,
		id: params.contextId,
		folder: params.folder,
	};

	const options: UploadOptions = {
		companyId,
		context,
		description: params.description,
		tags: parsedTags,
	};

	const result = await uploadDocumentService(params.file, options);

	if (!(result.success && result.attachmentId && result.storageUrl)) {
		return {
			success: false,
			error: result.error || "Upload failed",
			warnings: result.warnings,
		};
	}

	await logDocumentAction(companyId, access.userId, "document_uploaded", {
		attachmentId: result.attachmentId,
		fileName: params.file.name,
		fileSize: params.file.size,
		context,
	});

	revalidatePath("/dashboard/documents");
	if (params.contextId) {
		revalidatePath(`/dashboard/work/${params.contextId}`);
	}

	return {
		success: true,
		data: {
			attachmentId: result.attachmentId,
			fileName: params.file.name,
			fileSize: params.file.size,
			storageUrl: result.storageUrl,
		},
		warnings: result.warnings,
	};
}

async function handleNonJobDocumentUpload(
	params: NonJobUploadParams,
): Promise<ActionResult<UploadDocumentResult>> {
	const access = await verifyCompanyAccess(params.targetCompanyId);
	if (!access) {
		return {
			success: false,
			error:
				"Access denied - You must be an active member of this company to upload files",
		};
	}

	const validation = await validateFile(params.file);
	if (!validation.valid) {
		return {
			success: false,
			error: validation.errors.join("; "),
			warnings: validation.warnings,
		};
	}

	const parsedTags = parseTags(params.tagsRaw);
	if (params.tagsRaw && !parsedTags) {
		return {
			success: false,
			error: "Invalid tags format",
		};
	}

	const context: DocumentContext = {
		type: params.contextType,
		id: params.contextId,
		folder: params.folder,
	};

	const options: UploadOptions = {
		companyId: params.targetCompanyId,
		context,
		description: params.description,
		tags: parsedTags,
	};

	const result = await uploadDocumentService(params.file, options);

	if (!(result.success && result.attachmentId && result.storageUrl)) {
		return {
			success: false,
			error: result.error || "Upload failed",
			warnings: result.warnings,
		};
	}

	await logDocumentAction(
		params.targetCompanyId,
		access.userId,
		"document_uploaded",
		{
			attachmentId: result.attachmentId,
			fileName: params.file.name,
			fileSize: params.file.size,
			context,
		},
	);

	revalidatePath("/dashboard/documents");
	if (params.contextType === "customer" && params.contextId) {
		revalidatePath(`/dashboard/customers/${params.contextId}`);
	} else if (params.contextType === "job" && params.contextId) {
		revalidatePath(`/dashboard/work/${params.contextId}`);
	}

	return {
		success: true,
		data: {
			attachmentId: result.attachmentId,
			fileName: params.file.name,
			fileSize: params.file.size,
			storageUrl: result.storageUrl,
		},
		warnings: result.warnings,
	};
}

/**
 * Upload multiple documents
 */
async function uploadDocuments(
	formData: FormData,
): Promise<ActionResult<UploadDocumentResult[]>> {
	try {
		const files = formData.getAll("files") as File[];
		const companyId = formData.get("companyId") as string;
		const contextType = formData.get("contextType") as DocumentContext["type"];
		const contextId = formData.get("contextId") as string | undefined;
		const folder = formData.get("folder") as string | undefined;

		if (!(files.length && companyId && contextType)) {
			return {
				success: false,
				error: "Missing required fields",
			};
		}

		const access = await verifyCompanyAccess(companyId);
		if (!access) {
			return {
				success: false,
				error: "Access denied",
			};
		}

		const context: DocumentContext = {
			type: contextType,
			id: contextId,
			folder,
		};

		const options: UploadOptions = {
			companyId,
			context,
		};

		const results = await uploadDocumentsService(files, options);

		const successfulUploads: UploadDocumentResult[] = [];
		const errors: string[] = [];

		results.forEach((result, index) => {
			if (result.success && result.attachmentId && result.storageUrl) {
				successfulUploads.push({
					attachmentId: result.attachmentId,
					fileName: files[index].name,
					fileSize: files[index].size,
					storageUrl: result.storageUrl,
				});
			} else {
				errors.push(`${files[index].name}: ${result.error}`);
			}
		});

		// Log action
		await logDocumentAction(
			companyId,
			access.userId,
			"documents_bulk_uploaded",
			{
				count: successfulUploads.length,
				failed: errors.length,
				context,
			},
		);

		revalidatePath("/dashboard/documents");

		if (errors.length > 0 && successfulUploads.length === 0) {
			return {
				success: false,
				error: errors.join("; "),
			};
		}

		return {
			success: true,
			data: successfulUploads,
			warnings: errors.length > 0 ? errors : undefined,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Upload failed",
		};
	}
}

// ============================================================================
// DOWNLOAD ACTIONS
// ============================================================================

/**
 * Get download URL for document
 */
async function getDocumentDownloadUrl(
	attachmentId: string,
): Promise<ActionResult<string>> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Server configuration error" };
		}

		// Get attachment to verify access
		const { data: attachment, error } = await supabase
			.from("attachments")
			.select("company_id, file_name")
			.eq("id", attachmentId)
			.single();

		if (error || !attachment) {
			return {
				success: false,
				error: "Document not found",
			};
		}

		const access = await verifyCompanyAccess(attachment.company_id);
		if (!access) {
			return {
				success: false,
				error: "Access denied",
			};
		}

		const result = await getDownloadUrlService(attachmentId);

		if (result.error) {
			return {
				success: false,
				error: result.error,
			};
		}

		// Log download
		await logDocumentAction(
			attachment.company_id,
			access.userId,
			"document_downloaded",
			{
				attachmentId,
				fileName: attachment.file_name,
			},
		);

		if (!result.url) {
			return {
				success: false,
				error: "Download URL not available",
			};
		}

		return {
			success: true,
			data: result.url,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to get download URL",
		};
	}
}

// ============================================================================
// DELETE ACTIONS
// ============================================================================

/**
 * Delete document
 */
async function deleteDocument(
	attachmentId: string,
): Promise<ActionResult> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Server configuration error" };
		}

		const { data: attachment, error } = await supabase
			.from("attachments")
			.select("company_id, file_name, entity_type, entity_id")
			.eq("id", attachmentId)
			.single();

		if (error || !attachment) {
			return {
				success: false,
				error: "Document not found",
			};
		}

		const access = await verifyCompanyAccess(attachment.company_id, [
			"owner",
			"admin",
			"manager",
		]);
		if (!access) {
			return {
				success: false,
				error: "Access denied - insufficient permissions",
			};
		}

		const result = await deleteDocumentService(attachmentId);

		if (!result.success) {
			return {
				success: false,
				error: result.error,
			};
		}

		// Log deletion
		await logDocumentAction(
			attachment.company_id,
			access.userId,
			"document_deleted",
			{
				attachmentId,
				fileName: attachment.file_name,
			},
		);

		// Revalidate paths
		revalidatePath("/dashboard/documents");
		if (attachment.entity_type === "customer" && attachment.entity_id) {
			revalidatePath(`/dashboard/customers/${attachment.entity_id}`);
		} else if (attachment.entity_type === "job" && attachment.entity_id) {
			revalidatePath(`/dashboard/work/${attachment.entity_id}`);
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Delete failed",
		};
	}
}

/**
 * Bulk delete documents
 */
async function bulkDeleteDocuments(
	attachmentIds: string[],
): Promise<ActionResult<{ deleted: number; failed: number }>> {
	try {
		let deleted = 0;
		let failed = 0;

		for (const id of attachmentIds) {
			const result = await deleteDocument(id);
			if (result.success) {
				deleted++;
			} else {
				failed++;
			}
		}

		return {
			success: true,
			data: { deleted, failed },
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Bulk delete failed",
		};
	}
}

// ============================================================================
// UPDATE ACTIONS
// ============================================================================

/**
 * Update document metadata
 */
async function updateDocument(
	attachmentId: string,
	updates: {
		description?: string;
		tags?: string[];
		isPublic?: boolean;
		isInternal?: boolean;
		isFavorite?: boolean;
	},
): Promise<ActionResult> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Server configuration error" };
		}

		const { data: attachment, error } = await supabase
			.from("attachments")
			.select("company_id, file_name")
			.eq("id", attachmentId)
			.single();

		if (error || !attachment) {
			return {
				success: false,
				error: "Document not found",
			};
		}

		const access = await verifyCompanyAccess(attachment.company_id);
		if (!access) {
			return {
				success: false,
				error: "Access denied",
			};
		}

		const result = await updateMetadataService(attachmentId, updates);

		if (!result.success) {
			return {
				success: false,
				error: result.error,
			};
		}

		// Log update
		await logDocumentAction(
			attachment.company_id,
			access.userId,
			"document_updated",
			{
				attachmentId,
				fileName: attachment.file_name,
				updates,
			},
		);

		revalidatePath("/dashboard/documents");

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Update failed",
		};
	}
}

/**
 * Move document to different folder
 */
async function moveDocument(
	attachmentId: string,
	newFolderPath: string,
): Promise<ActionResult> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Server configuration error" };
		}

		const { data: attachment, error } = await supabase
			.from("attachments")
			.select("company_id, file_name, folder_path")
			.eq("id", attachmentId)
			.single();

		if (error || !attachment) {
			return {
				success: false,
				error: "Document not found",
			};
		}

		const access = await verifyCompanyAccess(attachment.company_id);
		if (!access) {
			return {
				success: false,
				error: "Access denied",
			};
		}

		const result = await moveDocumentService(attachmentId, newFolderPath);

		if (!result.success) {
			return {
				success: false,
				error: result.error,
			};
		}

		// Log move
		await logDocumentAction(
			attachment.company_id,
			access.userId,
			"document_moved",
			{
				attachmentId,
				fileName: attachment.file_name,
				from: attachment.folder_path,
				to: newFolderPath,
			},
		);

		revalidatePath("/dashboard/documents");

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Move failed",
		};
	}
}

// ============================================================================
// LIST AND SEARCH ACTIONS
// ============================================================================

/**
 * List documents with filters
 */
async function listDocuments(
	options: ListFilesOptions,
): Promise<ActionResult<Awaited<ReturnType<typeof listDocumentsService>>>> {
	try {
		const access = await verifyCompanyAccess(options.companyId);
		if (!access) {
			return {
				success: false,
				error: "Access denied",
			};
		}

		const result = await listDocumentsService(options);

		if (result.error) {
			return {
				success: false,
				error: result.error,
			};
		}

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "List failed",
		};
	}
}

// ============================================================================
// FOLDER MANAGEMENT ACTIONS
// ============================================================================

/**
 * Create a new folder
 */
type CreateFolderParams = {
	companyId: string;
	name: string;
	parentId?: string;
	contextType?: string;
	contextId?: string;
};

async function createFolder(
	params: CreateFolderParams,
): Promise<ActionResult<{ folderId: string }>> {
	try {
		const access = await verifyCompanyAccess(params.companyId);
		if (!access) {
			return {
				success: false,
				error: "Access denied",
			};
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Server configuration error" };
		}

		const { companyId, name, parentId, contextType, contextId } = params;

		// Generate path
		let path = "/";
		if (parentId) {
			const { data: parent } = await supabase
				.from("document_folders")
				.select("path")
				.eq("id", parentId)
				.single();

			if (parent) {
				path = `${parent.path}/${name.toLowerCase().replace(/\s+/g, "-")}`;
			}
		} else {
			path = `/${name.toLowerCase().replace(/\s+/g, "-")}`;
		}

		const { data, error } = await supabase
			.from("document_folders")
			.insert({
				company_id: companyId,
				parent_id: parentId,
				name,
				slug: name.toLowerCase().replace(/\s+/g, "-"),
				path,
				context_type: contextType,
				context_id: contextId,
				created_by: access.userId,
			})
			.select()
			.single();

		if (error) {
			return {
				success: false,
				error: error.message,
			};
		}

		// Log action
		await logDocumentAction(companyId, access.userId, "folder_created", {
			folderId: data.id,
			name,
			path,
		});

		revalidatePath("/dashboard/documents");

		return {
			success: true,
			data: { folderId: data.id },
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create folder",
		};
	}
}

/**
 * Delete a folder
 */
async function deleteFolder(folderId: string): Promise<ActionResult> {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Server configuration error" };
		}

		const { data: folder, error: fetchError } = await supabase
			.from("document_folders")
			.select("company_id, name, is_system")
			.eq("id", folderId)
			.single();

		if (fetchError || !folder) {
			return {
				success: false,
				error: "Folder not found",
			};
		}

		if (folder.is_system) {
			return {
				success: false,
				error: "Cannot delete system folders",
			};
		}

		const access = await verifyCompanyAccess(folder.company_id, [
			"owner",
			"admin",
		]);
		if (!access) {
			return {
				success: false,
				error: "Access denied - insufficient permissions",
			};
		}

		const { error } = await supabase
			.from("document_folders")
			.delete()
			.eq("id", folderId);

		if (error) {
			return {
				success: false,
				error: error.message,
			};
		}

		// Log deletion
		await logDocumentAction(
			folder.company_id,
			access.userId,
			"folder_deleted",
			{
				folderId,
				name: folder.name,
			},
		);

		revalidatePath("/dashboard/documents");

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Delete failed",
		};
	}
}

// ============================================================================
// STATISTICS ACTIONS
// ============================================================================

/**
 * Get document statistics
 */
async function getDocumentStatistics(
	companyId: string,
): Promise<ActionResult<Awaited<ReturnType<typeof getDocumentStatsService>>>> {
	try {
		const access = await verifyCompanyAccess(companyId);
		if (!access) {
			return {
				success: false,
				error: "Access denied",
			};
		}

		const stats = await getDocumentStatsService(companyId);

		if (stats.error) {
			return {
				success: false,
				error: stats.error,
			};
		}

		return {
			success: true,
			data: stats,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to get statistics",
		};
	}
}
