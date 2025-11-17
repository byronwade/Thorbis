/**
 * Miscellaneous Settings Server Actions
 *
 * Handles tags, checklists, lead sources, and data import/export settings
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ERROR_CODES, ERROR_MESSAGES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getCompanyId(supabase: any, userId: string): Promise<string> {
	const { data: teamMember } = await supabase
		.from("team_members")
		.select("company_id")
		.eq("user_id", userId)
		.eq("status", "active")
		.single();

	if (!teamMember?.company_id) {
		throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
	}

	return teamMember.company_id;
}

// ============================================================================
// TAG SETTINGS
// ============================================================================

const tagSettingsSchema = z.object({
	allowCustomTags: z.boolean().default(true),
	requireTagApproval: z.boolean().default(false),
	maxTagsPerItem: z.coerce.number().default(10),
	useColorCoding: z.boolean().default(true),
	autoAssignColors: z.boolean().default(true),
});

export async function updateTagSettings(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = tagSettingsSchema.parse({
			allowCustomTags: formData.get("allowCustomTags") !== "false",
			requireTagApproval: formData.get("requireTagApproval") === "true",
			maxTagsPerItem: formData.get("maxTagsPerItem") || "10",
			useColorCoding: formData.get("useColorCoding") !== "false",
			autoAssignColors: formData.get("autoAssignColors") !== "false",
		});

		const { error } = await supabase.from("tag_settings").upsert({
			company_id: companyId,
			allow_custom_tags: data.allowCustomTags,
			require_tag_approval: data.requireTagApproval,
			max_tags_per_item: data.maxTagsPerItem,
			use_color_coding: data.useColorCoding,
			auto_assign_colors: data.autoAssignColors,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update tag settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/tags");
	});
}

export async function getTagSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("tag_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch tag settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// CHECKLIST SETTINGS
// ============================================================================

const checklistSettingsSchema = z.object({
	requireChecklistCompletion: z.boolean().default(false),
	allowSkipItems: z.boolean().default(true),
	requirePhotosForChecklist: z.boolean().default(false),
	autoAssignByJobType: z.boolean().default(true),
});

export async function updateChecklistSettings(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = checklistSettingsSchema.parse({
			requireChecklistCompletion: formData.get("requireChecklistCompletion") === "true",
			allowSkipItems: formData.get("allowSkipItems") !== "false",
			requirePhotosForChecklist: formData.get("requirePhotosForChecklist") === "true",
			autoAssignByJobType: formData.get("autoAssignByJobType") !== "false",
		});

		const { error } = await supabase.from("checklist_settings").upsert({
			company_id: companyId,
			require_checklist_completion: data.requireChecklistCompletion,
			allow_skip_items: data.allowSkipItems,
			require_photos_for_checklist: data.requirePhotosForChecklist,
			auto_assign_by_job_type: data.autoAssignByJobType,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update checklist settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/checklists");
	});
}

export async function getChecklistSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("checklist_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch checklist settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}

// ============================================================================
// LEAD SOURCES
// ============================================================================

const leadSourceSchema = z.object({
	name: z.string().min(1, "Name is required"),
	category: z.string().optional(),
	isActive: z.boolean().default(true),
});

export async function createLeadSource(formData: FormData): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = leadSourceSchema.parse({
			name: formData.get("name"),
			category: formData.get("category") || undefined,
			isActive: formData.get("isActive") !== "false",
		});

		const { data: newSource, error } = await supabase
			.from("lead_sources")
			.insert({
				company_id: companyId,
				name: data.name,
				category: data.category,
				is_active: data.isActive,
			})
			.select("id")
			.single();

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("create lead source"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/lead-sources");
		return newSource.id;
	});
}

export async function updateLeadSource(
	sourceId: string,
	formData: FormData
): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = leadSourceSchema.parse({
			name: formData.get("name"),
			category: formData.get("category") || undefined,
			isActive: formData.get("isActive") !== "false",
		});

		const { error } = await supabase
			.from("lead_sources")
			.update({
				name: data.name,
				category: data.category,
				is_active: data.isActive,
			})
			.eq("id", sourceId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update lead source"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/lead-sources");
	});
}

export async function deleteLeadSource(sourceId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { error } = await supabase
			.from("lead_sources")
			.delete()
			.eq("id", sourceId)
			.eq("company_id", companyId);

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("delete lead source"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/lead-sources");
	});
}

export async function getLeadSources(): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("lead_sources")
			.select("*")
			.eq("company_id", companyId)
			.order("name", { ascending: true });

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch lead sources"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || [];
	});
}

// ============================================================================
// DATA IMPORT/EXPORT SETTINGS
// ============================================================================

const importExportSettingsSchema = z.object({
	allowBulkImport: z.boolean().default(true),
	requireImportApproval: z.boolean().default(false),
	autoDeduplicate: z.boolean().default(true),
	defaultExportFormat: z.enum(["csv", "excel", "json", "pdf"]).default("csv"),
	includeMetadata: z.boolean().default(true),
	autoExportEnabled: z.boolean().default(false),
	autoExportFrequency: z.string().optional(),
	autoExportEmail: z.string().optional(),
});

export async function updateImportExportSettings(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const data = importExportSettingsSchema.parse({
			allowBulkImport: formData.get("allowBulkImport") !== "false",
			requireImportApproval: formData.get("requireImportApproval") === "true",
			autoDeduplicate: formData.get("autoDeduplicate") !== "false",
			defaultExportFormat: formData.get("defaultExportFormat") || "csv",
			includeMetadata: formData.get("includeMetadata") !== "false",
			autoExportEnabled: formData.get("autoExportEnabled") === "true",
			autoExportFrequency: formData.get("autoExportFrequency") || undefined,
			autoExportEmail: formData.get("autoExportEmail") || undefined,
		});

		const { error } = await supabase.from("data_import_export_settings").upsert({
			company_id: companyId,
			allow_bulk_import: data.allowBulkImport,
			require_import_approval: data.requireImportApproval,
			auto_deduplicate: data.autoDeduplicate,
			default_export_format: data.defaultExportFormat,
			include_metadata: data.includeMetadata,
			auto_export_enabled: data.autoExportEnabled,
			auto_export_frequency: data.autoExportFrequency,
			auto_export_email: data.autoExportEmail,
		});

		if (error) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("update import/export settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/settings/data-import-export");
	});
}

export async function getImportExportSettings(): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const companyId = await getCompanyId(supabase, user.id);

		const { data, error } = await supabase
			.from("data_import_export_settings")
			.select("*")
			.eq("company_id", companyId)
			.single();

		if (error && error.code !== "PGRST116") {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed("fetch import/export settings"),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		return data || null;
	});
}
