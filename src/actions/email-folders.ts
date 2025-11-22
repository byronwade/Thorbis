"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { z } from "zod";

const createFolderSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(500).optional(),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
	icon: z.string().optional(),
});

const updateFolderSchema = createFolderSchema.partial().extend({
	id: z.string().uuid(),
	sort_order: z.number().int().optional(),
});

const deleteFolderSchema = z.object({
	id: z.string().uuid(),
});

export type EmailFolder = {
	id: string;
	company_id: string;
	name: string;
	slug: string;
	description: string | null;
	color: string | null;
	icon: string | null;
	sort_order: number;
	is_system: boolean;
	is_active: boolean;
	created_by: string | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
};

/**
 * Get all email folders for the active company
 */
export async function getEmailFoldersAction(): Promise<{
	success: boolean;
	folders?: EmailFolder[];
	error?: string;
}> {
	try {
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const { data, error } = await supabase
			.from("email_folders")
			.select("*")
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.eq("is_active", true)
			.order("sort_order", { ascending: true })
			.order("name", { ascending: true });

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, folders: data || [] };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Create a new email folder
 */
export async function createEmailFolderAction(
	input: z.infer<typeof createFolderSchema>
): Promise<{
	success: boolean;
	folder?: EmailFolder;
	error?: string;
}> {
	try {
		const validated = createFolderSchema.parse(input);
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Generate slug from name
		const slug = validated.name
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

		// Check if slug already exists
		const { data: existing } = await supabase
			.from("email_folders")
			.select("id")
			.eq("company_id", companyId)
			.eq("slug", slug)
			.is("deleted_at", null)
			.single();

		if (existing) {
			return { success: false, error: "A folder with this name already exists" };
		}

		// Get max sort_order
		const { data: maxOrder } = await supabase
			.from("email_folders")
			.select("sort_order")
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.order("sort_order", { ascending: false })
			.limit(1)
			.single();

		const { data, error } = await supabase
			.from("email_folders")
			.insert({
				company_id: companyId,
				name: validated.name,
				slug,
				description: validated.description || null,
				color: validated.color || null,
				icon: validated.icon || null,
				sort_order: (maxOrder?.sort_order || 0) + 1,
				created_by: user.id,
			})
			.select()
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, folder: data };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
			};
		}
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Update an email folder
 * @deprecated Unused
 */
async function updateEmailFolderAction(
	input: z.infer<typeof updateFolderSchema>
): Promise<{
	success: boolean;
	folder?: EmailFolder;
	error?: string;
}> {
	try {
		const validated = updateFolderSchema.parse(input);
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		// Check folder exists and belongs to company
		const { data: existing, error: fetchError } = await supabase
			.from("email_folders")
			.select("id, is_system")
			.eq("id", validated.id)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.single();

		if (fetchError || !existing) {
			return { success: false, error: "Folder not found" };
		}

		if (existing.is_system) {
			return { success: false, error: "Cannot update system folders" };
		}

		// If name is being updated, regenerate slug
		const updateData: Record<string, unknown> = {};
		if (validated.name) {
			updateData.name = validated.name;
			updateData.slug = validated.name
				.toLowerCase()
				.trim()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "");
		}
		if (validated.description !== undefined) updateData.description = validated.description;
		if (validated.color !== undefined) updateData.color = validated.color;
		if (validated.icon !== undefined) updateData.icon = validated.icon;
		if (validated.sort_order !== undefined) updateData.sort_order = validated.sort_order;

		const { data, error } = await supabase
			.from("email_folders")
			.update(updateData)
			.eq("id", validated.id)
			.eq("company_id", companyId)
			.select()
			.single();

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true, folder: data };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
			};
		}
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Delete an email folder (soft delete)
 */
export async function deleteEmailFolderAction(
	input: z.infer<typeof deleteFolderSchema>
): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		const validated = deleteFolderSchema.parse(input);
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: "Not authenticated" };
		}

		// Check folder exists and belongs to company
		const { data: existing, error: fetchError } = await supabase
			.from("email_folders")
			.select("id, is_system")
			.eq("id", validated.id)
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.single();

		if (fetchError || !existing) {
			return { success: false, error: "Folder not found" };
		}

		if (existing.is_system) {
			return { success: false, error: "Cannot delete system folders" };
		}

		// Soft delete
		const { error } = await supabase
			.from("email_folders")
			.update({
				deleted_at: new Date().toISOString(),
				deleted_by: user.id,
				is_active: false,
			})
			.eq("id", validated.id)
			.eq("company_id", companyId);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
			};
		}
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

