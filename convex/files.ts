/**
 * File storage queries and mutations
 * Replaces Supabase Storage with Convex File Storage
 */
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import {
  requireCompanyAccess,
  requirePermission,
  hasMinimumRole,
  excludeDeleted,
  createAuditLog,
} from "./lib/auth";
import { attachmentEntityType, attachmentCategory } from "./lib/validators";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Determine if file is an image
 */
function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * Determine if file is a document
 */
function isDocumentFile(mimeType: string): boolean {
  const docTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ];
  return docTypes.includes(mimeType);
}

/**
 * Determine if file is a video
 */
function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List attachments for a company
 */
export const list = query({
  args: {
    companyId: v.id("companies"),
    entityType: v.optional(attachmentEntityType),
    entityId: v.optional(v.string()),
    category: v.optional(attachmentCategory),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    let query = ctx.db
      .query("attachments")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.entityType && args.entityId) {
      query = ctx.db
        .query("attachments")
        .withIndex("by_entity", (q) =>
          q.eq("entityType", args.entityType!).eq("entityId", args.entityId!)
        );
    }

    let attachments = await query.collect();

    // Filter by company if using entity index
    if (args.entityType && args.entityId) {
      attachments = attachments.filter((a) => a.companyId === args.companyId);
    }

    attachments = excludeDeleted(attachments);

    if (args.category) {
      attachments = attachments.filter((a) => a.category === args.category);
    }

    const limit = args.limit ?? 50;
    attachments = attachments.slice(0, limit);

    return attachments;
  },
});

/**
 * List attachments for an entity
 */
export const listForEntity = query({
  args: {
    entityType: attachmentEntityType,
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    const attachments = await ctx.db
      .query("attachments")
      .withIndex("by_entity", (q) =>
        q.eq("entityType", args.entityType).eq("entityId", args.entityId)
      )
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    // Get URLs for each attachment
    const withUrls = await Promise.all(
      attachments.map(async (attachment) => {
        const url = await ctx.storage.getUrl(attachment.storageId);
        return { ...attachment, url };
      })
    );

    return withUrls;
  },
});

/**
 * Get a single attachment
 */
export const get = query({
  args: { attachmentId: v.id("attachments") },
  handler: async (ctx, args) => {
    const attachment = await ctx.db.get(args.attachmentId);
    if (!attachment) {
      throw new Error("Attachment not found");
    }

    await requireCompanyAccess(ctx, attachment.companyId);

    if (attachment.deletedAt) {
      throw new Error("Attachment not found");
    }

    const url = await ctx.storage.getUrl(attachment.storageId);
    return { ...attachment, url };
  },
});

/**
 * Get file URL
 */
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});

/**
 * Get attachment stats for company
 */
export const getStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);

    const attachments = await ctx.db
      .query("attachments")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .collect();

    const totalSize = attachments.reduce((sum, a) => sum + a.fileSize, 0);
    const images = attachments.filter((a) => a.isImage);
    const documents = attachments.filter((a) => a.isDocument);
    const videos = attachments.filter((a) => a.isVideo);

    // Group by entity type
    const byEntityType: Record<string, number> = {};
    for (const a of attachments) {
      byEntityType[a.entityType] = (byEntityType[a.entityType] || 0) + 1;
    }

    return {
      totalFiles: attachments.length,
      totalSize,
      totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
      images: images.length,
      documents: documents.length,
      videos: videos.length,
      other: attachments.length - images.length - documents.length - videos.length,
      byEntityType,
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Generate an upload URL
 */
export const generateUploadUrl = mutation({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    await requireCompanyAccess(ctx, args.companyId);
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Save uploaded file metadata
 */
export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    companyId: v.id("companies"),

    // File info
    fileName: v.string(),
    originalFileName: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),

    // Entity reference
    entityType: attachmentEntityType,
    entityId: v.string(),

    // Optional metadata
    category: v.optional(attachmentCategory),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
    isInternal: v.optional(v.boolean()),

    // Image dimensions (optional)
    width: v.optional(v.number()),
    height: v.optional(v.number()),

    // Video duration (optional)
    duration: v.optional(v.number()),

    // Additional metadata
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const authCtx = await requireCompanyAccess(ctx, args.companyId);
    requirePermission(authCtx, "upload_photos");

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (args.fileSize > maxSize) {
      throw new Error("File size exceeds maximum allowed (100MB)");
    }

    const fileExtension = getFileExtension(args.originalFileName);
    const isImage = isImageFile(args.mimeType);
    const isDocument = isDocumentFile(args.mimeType);
    const isVideo = isVideoFile(args.mimeType);

    const attachmentId = await ctx.db.insert("attachments", {
      companyId: args.companyId,
      storageId: args.storageId,
      entityType: args.entityType,
      entityId: args.entityId,
      fileName: args.fileName,
      originalFileName: args.originalFileName,
      fileSize: args.fileSize,
      mimeType: args.mimeType,
      fileExtension,
      isImage,
      isDocument,
      isVideo,
      width: args.width,
      height: args.height,
      duration: args.duration,
      category: args.category ?? (isImage ? "photo" : isDocument ? "document" : "other"),
      description: args.description,
      tags: args.tags ?? [],
      isPublic: args.isPublic ?? false,
      isInternal: args.isInternal ?? false,
      uploadedBy: authCtx.userId,
      uploadedAt: Date.now(),
      metadata: args.metadata,
    });

    await createAuditLog(ctx, {
      companyId: args.companyId,
      userId: authCtx.userId,
      action: "upload",
      entityType: "attachment",
      entityId: attachmentId,
      metadata: {
        fileName: args.originalFileName,
        fileSize: args.fileSize,
        entityType: args.entityType,
        entityId: args.entityId,
      },
    });

    return attachmentId;
  },
});

/**
 * Update attachment metadata
 */
export const update = mutation({
  args: {
    attachmentId: v.id("attachments"),
    description: v.optional(v.string()),
    category: v.optional(attachmentCategory),
    tags: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
    isInternal: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { attachmentId, ...updates } = args;

    const attachment = await ctx.db.get(attachmentId);
    if (!attachment) {
      throw new Error("Attachment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, attachment.companyId);

    if (attachment.deletedAt) {
      throw new Error("Attachment not found");
    }

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(attachmentId, updateData);
    }

    return attachmentId;
  },
});

/**
 * Delete an attachment (soft delete)
 */
export const remove = mutation({
  args: {
    attachmentId: v.id("attachments"),
  },
  handler: async (ctx, args) => {
    const attachment = await ctx.db.get(args.attachmentId);
    if (!attachment) {
      throw new Error("Attachment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, attachment.companyId);

    // Only uploader or manager+ can delete
    if (attachment.uploadedBy !== authCtx.userId && !hasMinimumRole(authCtx, "manager")) {
      throw new Error("Access denied");
    }

    // Soft delete the record
    await ctx.db.patch(args.attachmentId, {
      deletedAt: Date.now(),
      deletedBy: authCtx.userId,
    });

    // Note: We don't delete the actual file from storage
    // This allows for recovery and audit trail
    // A scheduled job can clean up orphaned files later

    await createAuditLog(ctx, {
      companyId: attachment.companyId,
      userId: authCtx.userId,
      action: "delete",
      entityType: "attachment",
      entityId: args.attachmentId,
      metadata: { fileName: attachment.originalFileName },
    });

    return { success: true };
  },
});

/**
 * Delete attachment permanently (internal - for cleanup jobs)
 */
export const deletePermanently = internalMutation({
  args: { attachmentId: v.id("attachments") },
  handler: async (ctx, args) => {
    const attachment = await ctx.db.get(args.attachmentId);
    if (!attachment) return;

    // Delete from storage
    await ctx.storage.delete(attachment.storageId);

    // Delete thumbnail if exists
    if (attachment.thumbnailStorageId) {
      await ctx.storage.delete(attachment.thumbnailStorageId);
    }

    // Delete the record
    await ctx.db.delete(args.attachmentId);
  },
});

/**
 * Move attachment to different entity
 */
export const move = mutation({
  args: {
    attachmentId: v.id("attachments"),
    newEntityType: attachmentEntityType,
    newEntityId: v.string(),
  },
  handler: async (ctx, args) => {
    const attachment = await ctx.db.get(args.attachmentId);
    if (!attachment) {
      throw new Error("Attachment not found");
    }

    const authCtx = await requireCompanyAccess(ctx, attachment.companyId);

    if (!hasMinimumRole(authCtx, "manager")) {
      throw new Error("Only managers can move attachments");
    }

    await ctx.db.patch(args.attachmentId, {
      entityType: args.newEntityType,
      entityId: args.newEntityId,
    });

    await createAuditLog(ctx, {
      companyId: attachment.companyId,
      userId: authCtx.userId,
      action: "move",
      entityType: "attachment",
      entityId: args.attachmentId,
      metadata: {
        from: { entityType: attachment.entityType, entityId: attachment.entityId },
        to: { entityType: args.newEntityType, entityId: args.newEntityId },
      },
    });

    return args.attachmentId;
  },
});

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Delete multiple attachments
 */
export const removeMultiple = mutation({
  args: {
    attachmentIds: v.array(v.id("attachments")),
  },
  handler: async (ctx, args) => {
    const results: { id: string; success: boolean; error?: string }[] = [];

    for (const attachmentId of args.attachmentIds) {
      try {
        const attachment = await ctx.db.get(attachmentId);
        if (!attachment) {
          results.push({ id: attachmentId, success: false, error: "Not found" });
          continue;
        }

        const authCtx = await requireCompanyAccess(ctx, attachment.companyId);

        if (attachment.uploadedBy !== authCtx.userId && !hasMinimumRole(authCtx, "manager")) {
          results.push({ id: attachmentId, success: false, error: "Access denied" });
          continue;
        }

        await ctx.db.patch(attachmentId, {
          deletedAt: Date.now(),
          deletedBy: authCtx.userId,
        });

        results.push({ id: attachmentId, success: true });
      } catch (error) {
        results.push({
          id: attachmentId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return results;
  },
});

/**
 * Copy attachments to another entity
 */
export const copyToEntity = mutation({
  args: {
    attachmentIds: v.array(v.id("attachments")),
    targetEntityType: attachmentEntityType,
    targetEntityId: v.string(),
  },
  handler: async (ctx, args) => {
    const newAttachmentIds: string[] = [];

    for (const attachmentId of args.attachmentIds) {
      const attachment = await ctx.db.get(attachmentId);
      if (!attachment || attachment.deletedAt) continue;

      const authCtx = await requireCompanyAccess(ctx, attachment.companyId);

      // Create a copy of the attachment record (same storage file)
      const newAttachmentId = await ctx.db.insert("attachments", {
        companyId: attachment.companyId,
        storageId: attachment.storageId,
        entityType: args.targetEntityType,
        entityId: args.targetEntityId,
        fileName: attachment.fileName,
        originalFileName: attachment.originalFileName,
        fileSize: attachment.fileSize,
        mimeType: attachment.mimeType,
        fileExtension: attachment.fileExtension,
        isImage: attachment.isImage,
        isDocument: attachment.isDocument,
        isVideo: attachment.isVideo,
        width: attachment.width,
        height: attachment.height,
        duration: attachment.duration,
        thumbnailStorageId: attachment.thumbnailStorageId,
        category: attachment.category,
        tags: attachment.tags,
        description: attachment.description,
        isPublic: attachment.isPublic,
        isInternal: attachment.isInternal,
        uploadedBy: authCtx.userId,
        uploadedAt: Date.now(),
        metadata: { copiedFrom: attachmentId },
      });

      newAttachmentIds.push(newAttachmentId);
    }

    return { copiedCount: newAttachmentIds.length, newAttachmentIds };
  },
});

// ============================================================================
// MIGRATION
// ============================================================================

/**
 * Import attachment metadata from Supabase (file must be re-uploaded)
 */
export const importMetadata = internalMutation({
  args: {
    supabaseId: v.string(),
    companySupabaseId: v.string(),
    uploadedBySupabaseId: v.optional(v.string()),
    storageId: v.id("_storage"),
    entityType: v.string(),
    entityId: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    category: v.optional(v.string()),
    uploadedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const companyMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "companies").eq("supabaseId", args.companySupabaseId)
      )
      .unique();

    if (!companyMapping) {
      throw new Error(`Company not found: ${args.companySupabaseId}`);
    }

    // Look up user who uploaded
    let uploadedBy: string | null = null;
    if (args.uploadedBySupabaseId) {
      const userMapping = await ctx.db
        .query("migrationMappings")
        .withIndex("by_supabase_id", (q) =>
          q.eq("tableName", "users").eq("supabaseId", args.uploadedBySupabaseId!)
        )
        .unique();
      uploadedBy = userMapping?.convexId ?? null;
    }

    const existingMapping = await ctx.db
      .query("migrationMappings")
      .withIndex("by_supabase_id", (q) =>
        q.eq("tableName", "attachments").eq("supabaseId", args.supabaseId)
      )
      .unique();

    if (existingMapping) {
      return existingMapping.convexId;
    }

    const fileExtension = getFileExtension(args.fileName);
    const isImage = isImageFile(args.mimeType);
    const isDocument = isDocumentFile(args.mimeType);
    const isVideo = isVideoFile(args.mimeType);

    if (!uploadedBy) {
      throw new Error(`uploadedBy user not found for attachment ${args.supabaseId}`);
    }

    const attachmentId = await ctx.db.insert("attachments", {
      companyId: companyMapping.convexId as any,
      storageId: args.storageId,
      entityType: args.entityType as any,
      entityId: args.entityId,
      fileName: args.fileName,
      originalFileName: args.fileName,
      fileSize: args.fileSize,
      mimeType: args.mimeType,
      fileExtension,
      isImage,
      isDocument,
      isVideo,
      category: (args.category as any) ?? (isImage ? "photo" : isDocument ? "document" : "other"),
      tags: [],
      isPublic: false,
      isInternal: false,
      uploadedBy: uploadedBy as any,
      uploadedAt: args.uploadedAt,
    });

    await ctx.db.insert("migrationMappings", {
      tableName: "attachments",
      supabaseId: args.supabaseId,
      convexId: attachmentId,
      migratedAt: Date.now(),
    });

    return attachmentId;
  },
});
