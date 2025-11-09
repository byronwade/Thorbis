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

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}

export interface UploadDocumentResult {
  attachmentId: string;
  fileName: string;
  fileSize: number;
  storageUrl: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Verify user has access to company
 */
async function verifyCompanyAccess(
  companyId: string,
  requiredRole?: string[]
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
    console.error("❌ verifyCompanyAccess: Auth failed", {
      authError: authError?.message,
    });
    return null;
  }

  console.log("👤 verifyCompanyAccess: User authenticated", {
    userId: user.id,
    companyId,
  });

  const { data: membership, error } = await supabase
    .from("team_members")
    .select("id, role")
    .eq("user_id", user.id)
    .eq("company_id", companyId)
    .eq("status", "active")
    .single();

  if (error || !membership) {
    console.error("❌ verifyCompanyAccess: No membership found", {
      userId: user.id,
      companyId,
      error: error?.message,
      hasMembership: !!membership,
    });
    return null;
  }

  console.log("✅ verifyCompanyAccess: Membership found", {
    userId: user.id,
    companyId,
    role: membership.role,
  });

  if (requiredRole && !requiredRole.includes(membership.role)) {
    console.error("❌ verifyCompanyAccess: Insufficient role", {
      role: membership.role,
      requiredRole,
    });
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
  details: Record<string, unknown>
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
  formData: FormData
): Promise<ActionResult<UploadDocumentResult>> {
  try {
    const file = formData.get("file") as File;
    const companyId = formData.get("companyId") as string;
    const contextType = formData.get("contextType") as DocumentContext["type"];
    const contextId = formData.get("contextId") as string | undefined;
    const folder = formData.get("folder") as string | undefined;
    const description = formData.get("description") as string | undefined;
    const tags = formData.get("tags") as string | undefined;

    console.log("📤 Upload request received:", {
      fileName: file?.name,
      companyId,
      contextType,
      contextId,
      folder,
      hasFile: !!file,
    });

    // Validate inputs
    if (!(file && contextType)) {
      console.error("❌ Missing required fields:", {
        hasFile: !!file,
        contextType,
      });
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    // Get user's active company
    const activeCompanyId = await getActiveCompanyId();
    if (!activeCompanyId) {
      console.error("❌ No active company found");
      return {
        success: false,
        error: "No active company found. Please select a company.",
      };
    }

    // Use active company ID, but verify the passed companyId matches (if provided)
    const targetCompanyId = companyId || activeCompanyId;

    // For job context, verify the job belongs to the user's active company
    if (contextType === "job" && contextId) {
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
        console.error("❌ Job not found:", {
          jobId: contextId,
          error: jobError,
        });
        return {
          success: false,
          error: "Job not found",
        };
      }

      // Verify job belongs to user's active company
      if (job.company_id !== activeCompanyId) {
        console.error("❌ Job company mismatch:", {
          jobCompanyId: job.company_id,
          activeCompanyId,
          passedCompanyId: companyId,
        });
        return {
          success: false,
          error: "Access denied - This job belongs to a different company",
        };
      }

      // Use the job's company_id to ensure consistency
      const finalCompanyId = job.company_id;

      // Verify access
      const access = await verifyCompanyAccess(finalCompanyId);
      if (!access) {
        console.error("❌ Upload access denied:", {
          companyId: finalCompanyId,
          fileName: file?.name,
          contextType,
          contextId,
        });
        return {
          success: false,
          error:
            "Access denied - You must be an active member of this company to upload files",
        };
      }

      // Parse tags safely
      let parsedTags: string[] | undefined;
      if (tags) {
        try {
          parsedTags = JSON.parse(tags);
        } catch (parseError) {
          console.error("❌ Failed to parse tags:", parseError);
          return {
            success: false,
            error: "Invalid tags format",
          };
        }
      }

      // Continue with upload using job's company_id
      const context: DocumentContext = {
        type: contextType,
        id: contextId,
        folder,
      };

      const options: UploadOptions = {
        companyId: finalCompanyId,
        context,
        description,
        tags: parsedTags,
      };

      const result = await uploadDocumentService(file, options);

      if (!result.success) {
        return {
          success: false,
          error: result.error || "Upload failed",
          warnings: result.warnings,
        };
      }

      // Log action
      await logDocumentAction(
        finalCompanyId,
        access.userId,
        "document_uploaded",
        {
          attachmentId: result.attachmentId,
          fileName: file.name,
          fileSize: file.size,
          context,
        }
      );

      // Revalidate relevant paths
      revalidatePath("/dashboard/documents");
      if (contextId) {
        revalidatePath(`/dashboard/work/${contextId}`);
      }

      return {
        success: true,
        data: {
          attachmentId: result.attachmentId!,
          fileName: file.name,
          fileSize: file.size,
          storageUrl: result.storageUrl!,
        },
        warnings: result.warnings,
      };
    }

    // For non-job contexts, verify access to the target company
    const access = await verifyCompanyAccess(targetCompanyId);
    console.log("🔐 Access check result:", access ? "granted" : "denied", {
      targetCompanyId,
      activeCompanyId,
      userId: access?.userId,
      role: access?.role,
    });

    if (!access) {
      console.error("❌ Upload access denied:", {
        targetCompanyId,
        activeCompanyId,
        fileName: file?.name,
        contextType,
        contextId,
      });
      return {
        success: false,
        error:
          "Access denied - You must be an active member of this company to upload files",
      };
    }

    // Validate file
    const validation = await validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join("; "),
        warnings: validation.warnings,
      };
    }

    // Upload document
    const context: DocumentContext = {
      type: contextType,
      id: contextId,
      folder,
    };

    // Parse tags safely
    let parsedTags: string[] | undefined;
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (parseError) {
        console.error("❌ Failed to parse tags:", parseError);
        return {
          success: false,
          error: "Invalid tags format",
        };
      }
    }

    const options: UploadOptions = {
      companyId: targetCompanyId,
      context,
      description,
      tags: parsedTags,
    };

    const result = await uploadDocumentService(file, options);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        warnings: result.warnings,
      };
    }

    // Log action
    await logDocumentAction(
      targetCompanyId,
      access.userId,
      "document_uploaded",
      {
        attachmentId: result.attachmentId,
        fileName: file.name,
        fileSize: file.size,
        context,
      }
    );

    // Revalidate relevant paths
    revalidatePath("/dashboard/documents");
    if (contextType === "customer" && contextId) {
      revalidatePath(`/dashboard/customers/${contextId}`);
    } else if (contextType === "job" && contextId) {
      revalidatePath(`/dashboard/work/${contextId}`);
    }

    return {
      success: true,
      data: {
        attachmentId: result.attachmentId!,
        fileName: file.name,
        fileSize: file.size,
        storageUrl: result.storageUrl!,
      },
      warnings: result.warnings,
    };
  } catch (error) {
    console.error("Upload document error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload multiple documents
 */
export async function uploadDocuments(
  formData: FormData
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
      if (result.success) {
        successfulUploads.push({
          attachmentId: result.attachmentId!,
          fileName: files[index].name,
          fileSize: files[index].size,
          storageUrl: result.storageUrl!,
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
      }
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
    console.error("Upload documents error:", error);
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
export async function getDocumentDownloadUrl(
  attachmentId: string
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
      }
    );

    return {
      success: true,
      data: result.url!,
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
export async function deleteDocument(
  attachmentId: string
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
      }
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
export async function bulkDeleteDocuments(
  attachmentIds: string[]
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
export async function updateDocument(
  attachmentId: string,
  updates: {
    description?: string;
    tags?: string[];
    isPublic?: boolean;
    isInternal?: boolean;
    isFavorite?: boolean;
  }
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
      }
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
export async function moveDocument(
  attachmentId: string,
  newFolderPath: string
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
      }
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
export async function listDocuments(
  options: ListFilesOptions
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
export async function createFolder(
  companyId: string,
  name: string,
  parentId?: string,
  contextType?: string,
  contextId?: string
): Promise<ActionResult<{ folderId: string }>> {
  try {
    const access = await verifyCompanyAccess(companyId);
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
export async function deleteFolder(folderId: string): Promise<ActionResult> {
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
      }
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
export async function getDocumentStatistics(
  companyId: string
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
