/**
 * Pin Board / Content Portal Server Actions
 *
 * Company-wide content management for SOPs, contractor lists, sales papers, etc.
 * - Posts can be pinned to appear first
 * - Categories for organization
 * - File attachments support
 * - View tracking for read receipts
 * - Admin/Owner only create/edit
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const categorySchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	slug: z
		.string()
		.min(1)
		.max(100)
		.regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
	description: z.string().max(500).optional(),
	icon: z.string().max(50).default("folder"),
	color: z.string().max(20).default("blue"),
	sortOrder: z.number().int().min(0).default(0),
});

const postSchema = z.object({
	title: z.string().min(1, "Title is required").max(200),
	content: z.string().optional(),
	excerpt: z.string().max(500).optional(),
	categoryId: z.string().uuid().optional().nullable(),
	isPinned: z.boolean().default(false),
	isPublished: z.boolean().default(true),
	priority: z.number().int().min(0).max(100).default(0),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function assertAdminOrOwner(
	supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
	companyId: string,
) {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("You must be logged in");
	}

	const { data: membership } = await supabase
		.from("company_memberships")
		.select("role")
		.eq("user_id", user.id)
		.eq("company_id", companyId)
		.single();

	if (!membership || !["owner", "admin"].includes(membership.role || "")) {
		throw new Error("Only admins and owners can manage pin board content");
	}

	return user;
}

// ============================================================================
// CATEGORY ACTIONS
// ============================================================================

async function createPinBoardCategory(
	data: z.infer<typeof categorySchema>,
) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		await assertAdminOrOwner(supabase, companyId);
		const validated = categorySchema.parse(data);

		const { data: category, error } = await supabase
			.from("pin_board_categories")
			.insert({
				company_id: companyId,
				name: validated.name,
				slug: validated.slug,
				description: validated.description,
				icon: validated.icon,
				color: validated.color,
				sort_order: validated.sortOrder,
			})
			.select()
			.single();

		if (error) throw error;

		revalidatePath("/dashboard");
		return { success: true, data: category };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to create category",
		};
	}
}

async function updatePinBoardCategory(
	id: string,
	data: Partial<z.infer<typeof categorySchema>>,
) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		await assertAdminOrOwner(supabase, companyId);

		const updateData: Record<string, unknown> = {};
		if (data.name) updateData.name = data.name;
		if (data.slug) updateData.slug = data.slug;
		if (data.description !== undefined)
			updateData.description = data.description;
		if (data.icon) updateData.icon = data.icon;
		if (data.color) updateData.color = data.color;
		if (data.sortOrder !== undefined) updateData.sort_order = data.sortOrder;

		const { data: category, error } = await supabase
			.from("pin_board_categories")
			.update(updateData)
			.eq("id", id)
			.eq("company_id", companyId)
			.select()
			.single();

		if (error) throw error;

		revalidatePath("/dashboard");
		return { success: true, data: category };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to update category",
		};
	}
}

async function deletePinBoardCategory(id: string) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		await assertAdminOrOwner(supabase, companyId);

		const { error } = await supabase
			.from("pin_board_categories")
			.delete()
			.eq("id", id)
			.eq("company_id", companyId);

		if (error) throw error;

		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to delete category",
		};
	}
}

// ============================================================================
// POST ACTIONS
// ============================================================================

export async function createPinBoardPost(data: z.infer<typeof postSchema>) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		const user = await assertAdminOrOwner(supabase, companyId);
		const validated = postSchema.parse(data);

		// Generate excerpt from content if not provided
		let excerpt = validated.excerpt;
		if (!excerpt && validated.content) {
			// Strip HTML tags and truncate
			const plainText = validated.content.replace(/<[^>]*>/g, "");
			excerpt =
				plainText.substring(0, 200) + (plainText.length > 200 ? "..." : "");
		}

		const { data: post, error } = await supabase
			.from("pin_board_posts")
			.insert({
				company_id: companyId,
				category_id: validated.categoryId,
				title: validated.title,
				content: validated.content,
				excerpt,
				is_pinned: validated.isPinned,
				is_published: validated.isPublished,
				priority: validated.priority,
				created_by: user.id,
				updated_by: user.id,
				published_at: validated.isPublished ? new Date().toISOString() : null,
			})
			.select(`
        *,
        category:pin_board_categories(id, name, slug, icon, color),
        author:profiles!pin_board_posts_created_by_fkey(id, full_name, avatar_url)
      `)
			.single();

		if (error) throw error;

		revalidatePath("/dashboard");
		return { success: true, data: post };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create post",
		};
	}
}

export async function updatePinBoardPost(
	id: string,
	data: Partial<z.infer<typeof postSchema>>,
) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		const user = await assertAdminOrOwner(supabase, companyId);

		const updateData: Record<string, unknown> = {
			updated_by: user.id,
		};

		if (data.title) updateData.title = data.title;
		if (data.content !== undefined) updateData.content = data.content;
		if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
		if (data.categoryId !== undefined) updateData.category_id = data.categoryId;
		if (data.isPinned !== undefined) updateData.is_pinned = data.isPinned;
		if (data.isPublished !== undefined) {
			updateData.is_published = data.isPublished;
			if (data.isPublished) {
				updateData.published_at = new Date().toISOString();
			}
		}
		if (data.priority !== undefined) updateData.priority = data.priority;

		// Increment version
		const { data: currentPost } = await supabase
			.from("pin_board_posts")
			.select("version")
			.eq("id", id)
			.single();

		if (currentPost) {
			updateData.version = (currentPost.version || 1) + 1;
		}

		const { data: post, error } = await supabase
			.from("pin_board_posts")
			.update(updateData)
			.eq("id", id)
			.eq("company_id", companyId)
			.select(`
        *,
        category:pin_board_categories(id, name, slug, icon, color),
        author:profiles!pin_board_posts_created_by_fkey(id, full_name, avatar_url)
      `)
			.single();

		if (error) throw error;

		revalidatePath("/dashboard");
		return { success: true, data: post };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update post",
		};
	}
}

export async function deletePinBoardPost(id: string) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		await assertAdminOrOwner(supabase, companyId);

		const { error } = await supabase
			.from("pin_board_posts")
			.delete()
			.eq("id", id)
			.eq("company_id", companyId);

		if (error) throw error;

		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to delete post",
		};
	}
}

export async function togglePinBoardPostPin(id: string) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		await assertAdminOrOwner(supabase, companyId);

		// Get current pin status
		const { data: currentPost } = await supabase
			.from("pin_board_posts")
			.select("is_pinned")
			.eq("id", id)
			.eq("company_id", companyId)
			.single();

		if (!currentPost) {
			return { success: false, error: "Post not found" };
		}

		const { data: post, error } = await supabase
			.from("pin_board_posts")
			.update({ is_pinned: !currentPost.is_pinned })
			.eq("id", id)
			.eq("company_id", companyId)
			.select()
			.single();

		if (error) throw error;

		revalidatePath("/dashboard");
		return { success: true, data: post };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to toggle pin",
		};
	}
}

// ============================================================================
// VIEW TRACKING
// ============================================================================

export async function markPostAsViewed(postId: string) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase || !companyId) {
		return { success: false };
	}

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return { success: false };

		// Upsert to handle idempotency
		await supabase.from("pin_board_views").upsert(
			{
				post_id: postId,
				user_id: user.id,
				company_id: companyId,
				viewed_at: new Date().toISOString(),
			},
			{ onConflict: "post_id,user_id" },
		);

		return { success: true };
	} catch {
		return { success: false };
	}
}

// ============================================================================
// ATTACHMENT ACTIONS
// ============================================================================

export async function addPinBoardAttachment(
	postId: string,
	file: {
		fileName: string;
		fileType: string;
		fileSize: number;
		fileUrl: string;
		description?: string;
	},
) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		const user = await assertAdminOrOwner(supabase, companyId);

		const { data: attachment, error } = await supabase
			.from("pin_board_attachments")
			.insert({
				post_id: postId,
				company_id: companyId,
				file_name: file.fileName,
				file_type: file.fileType,
				file_size: file.fileSize,
				file_url: file.fileUrl,
				description: file.description,
				uploaded_by: user.id,
			})
			.select()
			.single();

		if (error) throw error;

		revalidatePath("/dashboard");
		return { success: true, data: attachment };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to add attachment",
		};
	}
}

async function deletePinBoardAttachment(id: string) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		await assertAdminOrOwner(supabase, companyId);

		const { error } = await supabase
			.from("pin_board_attachments")
			.delete()
			.eq("id", id)
			.eq("company_id", companyId);

		if (error) throw error;

		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to delete attachment",
		};
	}
}

// ============================================================================
// SEED DEFAULT CATEGORIES
// ============================================================================

// ============================================================================
// FILE UPLOAD
// ============================================================================

export async function uploadPinBoardFile(formData: FormData) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		const user = await assertAdminOrOwner(supabase, companyId);
		const file = formData.get("file") as File;
		const postId = formData.get("postId") as string | null;

		if (!file) {
			return { success: false, error: "No file provided" };
		}

		// Validate file size (50MB max)
		if (file.size > 50 * 1024 * 1024) {
			return { success: false, error: "File too large (max 50MB)" };
		}

		// Create unique file path
		const timestamp = Date.now();
		const randomStr = Math.random().toString(36).substring(2, 8);
		const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
		const filePath = `${companyId}/pin-board/${timestamp}-${randomStr}-${sanitizedName}`;

		// Upload to Supabase Storage (company-files bucket)
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from("company-files")
			.upload(filePath, file, {
				contentType: file.type,
				upsert: false,
			});

		if (uploadError) {
			console.error("Upload error:", uploadError);
			return { success: false, error: "Failed to upload file" };
		}

		// Get public URL (or signed URL for private files)
		const { data: urlData } = supabase.storage
			.from("company-files")
			.getPublicUrl(filePath);

		const fileUrl = urlData.publicUrl;

		// If postId provided, create attachment record
		let attachmentId: string | null = null;
		if (postId) {
			const { data: attachment, error: attachmentError } = await supabase
				.from("pin_board_attachments")
				.insert({
					post_id: postId,
					company_id: companyId,
					file_name: file.name,
					file_type: file.type,
					file_size: file.size,
					file_url: fileUrl,
					uploaded_by: user.id,
				})
				.select()
				.single();

			if (attachmentError) {
				console.error("Attachment record error:", attachmentError);
			} else {
				attachmentId = attachment.id;
			}
		}

		return {
			success: true,
			data: {
				id: attachmentId || `temp-${timestamp}`,
				url: fileUrl,
				fileName: file.name,
				fileType: file.type,
				fileSize: file.size,
				storagePath: filePath,
			},
		};
	} catch (error) {
		console.error("Upload error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to upload file",
		};
	}
}

async function getPinBoardFileUrl(attachmentId: string) {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		// Get attachment record
		const { data: attachment, error } = await supabase
			.from("pin_board_attachments")
			.select("file_url")
			.eq("id", attachmentId)
			.eq("company_id", companyId)
			.single();

		if (error || !attachment) {
			return { success: false, error: "Attachment not found" };
		}

		// For private files, generate a signed URL
		// For now, return the stored URL directly
		return { success: true, url: attachment.file_url };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to get file URL",
		};
	}
}

// ============================================================================
// SEED DEFAULT CATEGORIES
// ============================================================================

async function seedDefaultCategories() {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase) {
		return { success: false, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, error: "No active company" };
	}

	try {
		await assertAdminOrOwner(supabase, companyId);

		const defaultCategories = [
			{
				name: "SOPs & Procedures",
				slug: "sops",
				icon: "file-text",
				color: "blue",
				sort_order: 0,
			},
			{
				name: "Contractors & Partners",
				slug: "contractors",
				icon: "users",
				color: "green",
				sort_order: 1,
			},
			{
				name: "Sales Materials",
				slug: "sales",
				icon: "briefcase",
				color: "purple",
				sort_order: 2,
			},
			{
				name: "Company Announcements",
				slug: "announcements",
				icon: "megaphone",
				color: "orange",
				sort_order: 3,
			},
			{
				name: "Training & Resources",
				slug: "training",
				icon: "graduation-cap",
				color: "cyan",
				sort_order: 4,
			},
		];

		const { error } = await supabase.from("pin_board_categories").upsert(
			defaultCategories.map((cat) => ({
				...cat,
				company_id: companyId,
				is_default: true,
			})),
			{ onConflict: "company_id,slug" },
		);

		if (error) throw error;

		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to seed categories",
		};
	}
}
