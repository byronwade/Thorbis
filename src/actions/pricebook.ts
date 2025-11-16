/**
 * Price Book Server Actions
 *
 * Comprehensive price book management with:
 * - Hierarchical category management (Materialized Path pattern)
 * - Item CRUD operations (services, materials, packages)
 * - Bulk operations for mass updates
 * - Price history tracking
 * - Category tree operations
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ERROR_CODES, ERROR_MESSAGES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	assertExists,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const categorySchema = z.object({
	name: z.string().min(1, "Category name is required").max(100, "Name too long"),
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
	description: z.string().optional(),
	parentId: z.string().uuid().optional().nullable(),
	sortOrder: z.number().int().min(0).default(0),
	icon: z.string().optional(),
	color: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color")
		.optional(),
	isActive: z.boolean().default(true),
});

const priceBookItemSchema = z.object({
	categoryId: z.string().uuid("Category is required"),
	itemType: z.enum(["service", "material", "package"], {
		message: "Item type is required",
	}),
	name: z.string().min(1, "Item name is required").max(200, "Name too long"),
	description: z.string().optional(),
	sku: z.string().max(50, "SKU too long").optional(),
	cost: z.number().int().min(0, "Cost must be positive").default(0), // In cents
	price: z.number().int().min(0, "Price must be positive"), // In cents
	markupPercent: z.number().int().min(0).max(10_000).default(0), // 0-10000 (0-100.00%)
	unit: z.string().min(1, "Unit is required").default("each"),
	minimumQuantity: z.number().int().min(1).default(1),
	isActive: z.boolean().default(true),
	isTaxable: z.boolean().default(true),
	supplierId: z.string().uuid().optional().nullable(),
	supplierSku: z.string().max(100).optional(),
	imageUrl: z.string().url().optional().nullable(),
	tags: z.array(z.string()).optional(),
	notes: z.string().optional(),
});

const bulkUpdatePriceSchema = z.object({
	itemIds: z.array(z.string().uuid()).min(1, "At least one item required"),
	updateType: z.enum(["increase_price", "decrease_price", "set_markup", "increase_markup", "decrease_markup"]),
	value: z.number().min(0, "Value must be positive"), // Percentage or amount based on updateType
	isPercentage: z.boolean().default(true),
	reason: z.string().optional(),
});

const moveCategorySchema = z.object({
	categoryId: z.string().uuid(),
	newParentId: z.string().uuid().optional().nullable(),
	newSortOrder: z.number().int().min(0).optional(),
});

// ============================================================================
// CATEGORY OPERATIONS
// ============================================================================

/**
 * Create a new price book category
 */
export async function createCategory(formData: FormData): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		// Get current user and company
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Validate input
		const data = categorySchema.parse({
			name: formData.get("name"),
			slug: formData.get("slug"),
			description: formData.get("description") || undefined,
			parentId: formData.get("parentId") || null,
			sortOrder: formData.get("sortOrder") ? Number(formData.get("sortOrder")) : 0,
			icon: formData.get("icon") || undefined,
			color: formData.get("color") || undefined,
			isActive: formData.get("isActive") ? formData.get("isActive") === "true" : true,
		});

		// Check if slug already exists for this company
		const { data: existingSlug } = await supabase
			.from("price_book_categories")
			.select("id")
			.eq("company_id", teamMember.company_id)
			.eq("slug", data.slug)
			.single();

		if (existingSlug) {
			throw new ActionError("A category with this slug already exists", ERROR_CODES.DB_DUPLICATE_ENTRY);
		}

		// Calculate level and path
		let level = 0;
		let path = "";

		if (data.parentId) {
			// Verify parent exists and belongs to same company
			const { data: parent } = await supabase
				.from("price_book_categories")
				.select("id, level, path, company_id")
				.eq("id", data.parentId)
				.single();

			assertExists(parent, "Parent category");

			if (parent.company_id !== teamMember.company_id) {
				throw new ActionError("Parent category not found", ERROR_CODES.AUTH_FORBIDDEN, 403);
			}

			level = parent.level + 1;
			path = parent.path ? `${parent.path}.${data.parentId}` : data.parentId;
		}

		// Create category
		const { data: category, error: createError } = await supabase
			.from("price_book_categories")
			.insert({
				company_id: teamMember.company_id,
				name: data.name,
				slug: data.slug,
				description: data.description,
				parent_id: data.parentId,
				path,
				level,
				sort_order: data.sortOrder,
				icon: data.icon,
				color: data.color,
				is_active: data.isActive,
				item_count: 0,
				descendant_item_count: 0,
			})
			.select("id")
			.single();

		if (createError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("create category"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/work/pricebook");
		revalidatePath("/dashboard/settings/pricebook");
		return category.id;
	});
}

/**
 * Update an existing category
 */
export async function updateCategory(categoryId: string, formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Verify category exists and belongs to company
		const { data: category } = await supabase
			.from("price_book_categories")
			.select("id, company_id, slug")
			.eq("id", categoryId)
			.single();

		assertExists(category, "Category");

		if (category.company_id !== teamMember.company_id) {
			throw new ActionError("Category not found", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Validate input (excluding parentId - use moveCategory for that)
		const data = categorySchema.omit({ parentId: true }).parse({
			name: formData.get("name"),
			slug: formData.get("slug"),
			description: formData.get("description") || undefined,
			sortOrder: formData.get("sortOrder") ? Number(formData.get("sortOrder")) : 0,
			icon: formData.get("icon") || undefined,
			color: formData.get("color") || undefined,
			isActive: formData.get("isActive") ? formData.get("isActive") === "true" : true,
		});

		// Check if slug already exists (excluding current category)
		if (data.slug !== category.slug) {
			const { data: existingSlug } = await supabase
				.from("price_book_categories")
				.select("id")
				.eq("company_id", teamMember.company_id)
				.eq("slug", data.slug)
				.neq("id", categoryId)
				.single();

			if (existingSlug) {
				throw new ActionError("A category with this slug already exists", ERROR_CODES.DB_DUPLICATE_ENTRY);
			}
		}

		// Update category
		const { error: updateError } = await supabase
			.from("price_book_categories")
			.update({
				name: data.name,
				slug: data.slug,
				description: data.description,
				sort_order: data.sortOrder,
				icon: data.icon,
				color: data.color,
				is_active: data.isActive,
			})
			.eq("id", categoryId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update category"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/work/pricebook");
		revalidatePath("/dashboard/settings/pricebook");
	});
}

/**
 * Move a category to a new parent or reorder within same level
 * This updates the materialized path for the category and all descendants
 */
export async function moveCategory(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		const data = moveCategorySchema.parse({
			categoryId: formData.get("categoryId"),
			newParentId: formData.get("newParentId") || null,
			newSortOrder: formData.get("newSortOrder") ? Number(formData.get("newSortOrder")) : undefined,
		});

		// Get the category being moved
		const { data: category } = await supabase
			.from("price_book_categories")
			.select("*")
			.eq("id", data.categoryId)
			.single();

		assertExists(category, "Category");

		if (category.company_id !== teamMember.company_id) {
			throw new ActionError("Category not found", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Prevent moving a category to one of its descendants (creates circular reference)
		if (data.newParentId) {
			const { data: newParent } = await supabase
				.from("price_book_categories")
				.select("path, company_id")
				.eq("id", data.newParentId)
				.single();

			assertExists(newParent, "New parent category");

			if (newParent.company_id !== teamMember.company_id) {
				throw new ActionError("Parent category not found", ERROR_CODES.AUTH_FORBIDDEN, 403);
			}

			// Check if newParent is a descendant of category
			if (newParent.path.includes(data.categoryId)) {
				throw new ActionError("Cannot move a category to one of its descendants", ERROR_CODES.BUSINESS_RULE_VIOLATION);
			}
		}

		// Calculate new level and path
		let newLevel = 0;
		let newPath = "";

		if (data.newParentId) {
			const { data: parent } = await supabase
				.from("price_book_categories")
				.select("level, path")
				.eq("id", data.newParentId)
				.single();

			assertExists(parent, "Parent category");

			newLevel = parent.level + 1;
			newPath = parent.path ? `${parent.path}.${data.newParentId}` : data.newParentId;
		}

		const oldPath = category.path;
		const oldLevel = category.level;
		const levelDiff = newLevel - oldLevel;

		// Update the category itself
		const updateData: any = {
			parent_id: data.newParentId,
			level: newLevel,
			path: newPath,
		};

		if (data.newSortOrder !== undefined) {
			updateData.sort_order = data.newSortOrder;
		}

		const { error: updateError } = await supabase
			.from("price_book_categories")
			.update(updateData)
			.eq("id", data.categoryId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("move category"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Update all descendants (if any)
		// Find all categories where path starts with the old path of the moved category
		const { data: descendants } = await supabase
			.from("price_book_categories")
			.select("id, path, level")
			.eq("company_id", teamMember.company_id)
			.like("path", `${oldPath}.${data.categoryId}%`);

		if (descendants && descendants.length > 0) {
			// Update each descendant's path and level
			for (const descendant of descendants) {
				// Replace the old path prefix with the new path
				const descendantPathSuffix = descendant.path.substring(oldPath.length);
				const newDescendantPath = newPath ? `${newPath}${descendantPathSuffix}` : descendantPathSuffix.substring(1); // Remove leading dot
				const newDescendantLevel = descendant.level + levelDiff;

				await supabase
					.from("price_book_categories")
					.update({
						path: newDescendantPath,
						level: newDescendantLevel,
					})
					.eq("id", descendant.id);
			}
		}

		revalidatePath("/dashboard/work/pricebook");
		revalidatePath("/dashboard/settings/pricebook");
	});
}

/**
 * Delete a category (only if it has no items and no child categories)
 */
export async function deleteCategory(categoryId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Verify category exists and belongs to company
		const { data: category } = await supabase
			.from("price_book_categories")
			.select("id, company_id, item_count")
			.eq("id", categoryId)
			.single();

		assertExists(category, "Category");

		if (category.company_id !== teamMember.company_id) {
			throw new ActionError("Category not found", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Check if category has items
		if (category.item_count > 0) {
			throw new ActionError(
				"Cannot delete category with items. Move or delete items first.",
				ERROR_CODES.BUSINESS_RULE_VIOLATION
			);
		}

		// Check if category has children
		const { data: children } = await supabase
			.from("price_book_categories")
			.select("id")
			.eq("parent_id", categoryId)
			.limit(1);

		if (children && children.length > 0) {
			throw new ActionError(
				"Cannot delete category with subcategories. Delete or move subcategories first.",
				ERROR_CODES.BUSINESS_RULE_VIOLATION
			);
		}

		// Delete the category
		const { error: deleteError } = await supabase.from("price_book_categories").delete().eq("id", categoryId);

		if (deleteError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("delete category"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/work/pricebook");
		revalidatePath("/dashboard/settings/pricebook");
	});
}

/**
 * Get category tree for a company
 */
export async function getCategoryTree(): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Get all categories ordered by path (this naturally orders the tree)
		const { data: categories, error } = await supabase
			.from("price_book_categories")
			.select("*")
			.eq("company_id", teamMember.company_id)
			.eq("is_active", true)
			.order("path", { ascending: true });

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch categories"), ERROR_CODES.DB_QUERY_ERROR);
		}

		return categories || [];
	});
}

// ============================================================================
// ITEM OPERATIONS
// ============================================================================

/**
 * Create a new price book item
 */
export async function createPriceBookItem(formData: FormData): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Parse tags if provided
		let tags: string[] | undefined;
		const tagsString = formData.get("tags");
		if (tagsString && typeof tagsString === "string") {
			try {
				tags = JSON.parse(tagsString);
			} catch {
				tags = tagsString.split(",").map((t) => t.trim());
			}
		}

		// Validate input
		const data = priceBookItemSchema.parse({
			categoryId: formData.get("categoryId"),
			itemType: formData.get("itemType"),
			name: formData.get("name"),
			description: formData.get("description") || undefined,
			sku: formData.get("sku") || undefined,
			cost: formData.get("cost") ? Number(formData.get("cost")) : 0,
			price: formData.get("price") ? Number(formData.get("price")) : 0,
			markupPercent: formData.get("markupPercent") ? Number(formData.get("markupPercent")) : 0,
			unit: formData.get("unit") || "each",
			minimumQuantity: formData.get("minimumQuantity") ? Number(formData.get("minimumQuantity")) : 1,
			isActive: formData.get("isActive") ? formData.get("isActive") === "true" : true,
			isTaxable: formData.get("isTaxable") ? formData.get("isTaxable") === "true" : true,
			supplierId: formData.get("supplierId") || null,
			supplierSku: formData.get("supplierSku") || undefined,
			imageUrl: formData.get("imageUrl") || null,
			tags,
			notes: formData.get("notes") || undefined,
		});

		// Verify category exists and belongs to company
		const { data: category } = await supabase
			.from("price_book_categories")
			.select("id, company_id")
			.eq("id", data.categoryId)
			.single();

		assertExists(category, "Category");

		if (category.company_id !== teamMember.company_id) {
			throw new ActionError("Category not found", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Check if SKU already exists (if provided)
		if (data.sku) {
			const { data: existingSku } = await supabase
				.from("price_book_items")
				.select("id")
				.eq("company_id", teamMember.company_id)
				.eq("sku", data.sku)
				.single();

			if (existingSku) {
				throw new ActionError("An item with this SKU already exists", ERROR_CODES.DB_DUPLICATE_ENTRY);
			}
		}

		// Create item
		const { data: item, error: createError } = await supabase
			.from("price_book_items")
			.insert({
				company_id: teamMember.company_id,
				category_id: data.categoryId,
				item_type: data.itemType,
				name: data.name,
				description: data.description,
				sku: data.sku,
				cost: data.cost,
				price: data.price,
				markup_percent: data.markupPercent,
				unit: data.unit,
				minimum_quantity: data.minimumQuantity,
				is_active: data.isActive,
				is_taxable: data.isTaxable,
				supplier_id: data.supplierId,
				supplier_sku: data.supplierSku,
				image_url: data.imageUrl,
				tags: data.tags,
				notes: data.notes,
			})
			.select("id")
			.single();

		if (createError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("create item"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Update category item count
		await supabase.rpc("increment_category_item_count", {
			category_id: data.categoryId,
		});

		revalidatePath("/dashboard/work/pricebook");
		return item.id;
	});
}

/**
 * Update an existing price book item
 */
export async function updatePriceBookItem(itemId: string, formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Verify item exists and belongs to company
		const { data: item } = await supabase
			.from("price_book_items")
			.select("id, company_id, category_id, sku, cost, price, markup_percent")
			.eq("id", itemId)
			.single();

		assertExists(item, "Item");

		if (item.company_id !== teamMember.company_id) {
			throw new ActionError("Item not found", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Parse tags if provided
		let tags: string[] | undefined;
		const tagsString = formData.get("tags");
		if (tagsString && typeof tagsString === "string") {
			try {
				tags = JSON.parse(tagsString);
			} catch {
				tags = tagsString.split(",").map((t) => t.trim());
			}
		}

		// Validate input
		const data = priceBookItemSchema.parse({
			categoryId: formData.get("categoryId"),
			itemType: formData.get("itemType"),
			name: formData.get("name"),
			description: formData.get("description") || undefined,
			sku: formData.get("sku") || undefined,
			cost: formData.get("cost") ? Number(formData.get("cost")) : 0,
			price: formData.get("price") ? Number(formData.get("price")) : 0,
			markupPercent: formData.get("markupPercent") ? Number(formData.get("markupPercent")) : 0,
			unit: formData.get("unit") || "each",
			minimumQuantity: formData.get("minimumQuantity") ? Number(formData.get("minimumQuantity")) : 1,
			isActive: formData.get("isActive") ? formData.get("isActive") === "true" : true,
			isTaxable: formData.get("isTaxable") ? formData.get("isTaxable") === "true" : true,
			supplierId: formData.get("supplierId") || null,
			supplierSku: formData.get("supplierSku") || undefined,
			imageUrl: formData.get("imageUrl") || null,
			tags,
			notes: formData.get("notes") || undefined,
		});

		// Check if SKU already exists (excluding current item)
		if (data.sku && data.sku !== item.sku) {
			const { data: existingSku } = await supabase
				.from("price_book_items")
				.select("id")
				.eq("company_id", teamMember.company_id)
				.eq("sku", data.sku)
				.neq("id", itemId)
				.single();

			if (existingSku) {
				throw new ActionError("An item with this SKU already exists", ERROR_CODES.DB_DUPLICATE_ENTRY);
			}
		}

		// Track price changes for history
		const priceChanged =
			data.cost !== item.cost || data.price !== item.price || data.markupPercent !== item.markup_percent;

		// Update item
		const { error: updateError } = await supabase
			.from("price_book_items")
			.update({
				category_id: data.categoryId,
				item_type: data.itemType,
				name: data.name,
				description: data.description,
				sku: data.sku,
				cost: data.cost,
				price: data.price,
				markup_percent: data.markupPercent,
				unit: data.unit,
				minimum_quantity: data.minimumQuantity,
				is_active: data.isActive,
				is_taxable: data.isTaxable,
				supplier_id: data.supplierId,
				supplier_sku: data.supplierSku,
				image_url: data.imageUrl,
				tags: data.tags,
				notes: data.notes,
			})
			.eq("id", itemId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("update item"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// If category changed, update item counts
		if (data.categoryId !== item.category_id) {
			// Decrement old category
			await supabase.rpc("decrement_category_item_count", {
				category_id: item.category_id,
			});

			// Increment new category
			await supabase.rpc("increment_category_item_count", {
				category_id: data.categoryId,
			});
		}

		// Record price change in history
		if (priceChanged) {
			await supabase.from("price_history").insert({
				item_id: itemId,
				company_id: teamMember.company_id,
				old_cost: item.cost,
				new_cost: data.cost,
				old_price: item.price,
				new_price: data.price,
				old_markup_percent: item.markup_percent,
				new_markup_percent: data.markupPercent,
				change_type: "manual",
				changed_by: user.id,
			});
		}

		revalidatePath("/dashboard/work/pricebook");
	});
}

/**
 * Delete a price book item
 */
export async function deletePriceBookItem(itemId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Verify item exists and belongs to company
		const { data: item } = await supabase
			.from("price_book_items")
			.select("id, company_id, category_id")
			.eq("id", itemId)
			.single();

		assertExists(item, "Item");

		if (item.company_id !== teamMember.company_id) {
			throw new ActionError("Item not found", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// TODO: Check if item is used in any jobs, estimates, or invoices
		// For now, we'll allow deletion but this should be restricted in production

		// Delete the item
		const { error: deleteError } = await supabase.from("price_book_items").delete().eq("id", itemId);

		if (deleteError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("delete item"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Update category item count
		await supabase.rpc("decrement_category_item_count", {
			category_id: item.category_id,
		});

		revalidatePath("/dashboard/work/pricebook");
	});
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk update prices for multiple items
 */
export async function bulkUpdatePrices(formData: FormData): Promise<ActionResult<number>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Parse item IDs
		const itemIdsString = formData.get("itemIds") as string;
		let itemIds: string[];
		try {
			itemIds = JSON.parse(itemIdsString);
		} catch {
			throw new ActionError("Invalid item IDs format", ERROR_CODES.VALIDATION_FAILED);
		}

		// Validate input
		const data = bulkUpdatePriceSchema.parse({
			itemIds,
			updateType: formData.get("updateType"),
			value: Number(formData.get("value")),
			isPercentage: formData.get("isPercentage") ? formData.get("isPercentage") === "true" : true,
			reason: formData.get("reason") || undefined,
		});

		// Fetch all items to update
		const { data: items, error: fetchError } = await supabase
			.from("price_book_items")
			.select("id, company_id, cost, price, markup_percent")
			.eq("company_id", teamMember.company_id)
			.in("id", data.itemIds);

		if (fetchError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch items"), ERROR_CODES.DB_QUERY_ERROR);
		}

		if (!items || items.length === 0) {
			throw new ActionError("No items found to update", ERROR_CODES.DB_RECORD_NOT_FOUND);
		}

		// Update each item based on update type
		let updatedCount = 0;
		for (const item of items) {
			const newCost = item.cost;
			let newPrice = item.price;
			let newMarkup = item.markup_percent;

			switch (data.updateType) {
				case "increase_price":
					if (data.isPercentage) {
						newPrice = Math.round(item.price * (1 + data.value / 100));
					} else {
						newPrice = item.price + data.value;
					}
					break;

				case "decrease_price":
					if (data.isPercentage) {
						newPrice = Math.round(item.price * (1 - data.value / 100));
					} else {
						newPrice = Math.max(0, item.price - data.value);
					}
					break;

				case "set_markup":
					newMarkup = Math.round(data.value * 100); // Convert to basis points
					newPrice = Math.round(item.cost * (1 + data.value / 100));
					break;

				case "increase_markup":
					newMarkup = item.markup_percent + Math.round(data.value * 100);
					newPrice = Math.round(item.cost * (1 + newMarkup / 10_000));
					break;

				case "decrease_markup":
					newMarkup = Math.max(0, item.markup_percent - Math.round(data.value * 100));
					newPrice = Math.round(item.cost * (1 + newMarkup / 10_000));
					break;
			}

			// Update the item
			const { error: updateError } = await supabase
				.from("price_book_items")
				.update({
					cost: newCost,
					price: newPrice,
					markup_percent: newMarkup,
				})
				.eq("id", item.id);

			if (updateError) {
				continue;
			}

			// Record price change in history
			await supabase.from("price_history").insert({
				item_id: item.id,
				company_id: teamMember.company_id,
				old_cost: item.cost,
				new_cost: newCost,
				old_price: item.price,
				new_price: newPrice,
				old_markup_percent: item.markup_percent,
				new_markup_percent: newMarkup,
				change_type: "bulk_update",
				change_reason: data.reason,
				changed_by: user.id,
			});

			updatedCount++;
		}

		revalidatePath("/dashboard/work/pricebook");
		return updatedCount;
	});
}

/**
 * Bulk activate/deactivate items
 */
export async function bulkToggleActiveStatus(itemIds: string[], isActive: boolean): Promise<ActionResult<number>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		if (!itemIds || itemIds.length === 0) {
			throw new ActionError("No items provided", ERROR_CODES.VALIDATION_FAILED);
		}

		// Update items
		const { error: updateError, count } = await supabase
			.from("price_book_items")
			.update({ is_active: isActive })
			.eq("company_id", teamMember.company_id)
			.in("id", itemIds);

		if (updateError) {
			throw new ActionError(
				ERROR_MESSAGES.operationFailed(`${isActive ? "activate" : "deactivate"} items`),
				ERROR_CODES.DB_QUERY_ERROR
			);
		}

		revalidatePath("/dashboard/work/pricebook");
		return count || 0;
	});
}

/**
 * Bulk delete items
 */
export async function bulkDeleteItems(itemIds: string[]): Promise<ActionResult<number>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		if (!itemIds || itemIds.length === 0) {
			throw new ActionError("No items provided", ERROR_CODES.VALIDATION_FAILED);
		}

		// Get items with their categories for count updates
		const { data: items } = await supabase
			.from("price_book_items")
			.select("id, category_id")
			.eq("company_id", teamMember.company_id)
			.in("id", itemIds);

		if (!items || items.length === 0) {
			throw new ActionError("No items found to delete", ERROR_CODES.DB_RECORD_NOT_FOUND);
		}

		// Delete items
		const { error: deleteError, count } = await supabase
			.from("price_book_items")
			.delete()
			.eq("company_id", teamMember.company_id)
			.in("id", itemIds);

		if (deleteError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("delete items"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Update category counts
		const categoryIds = [...new Set(items.map((item) => item.category_id))];
		for (const categoryId of categoryIds) {
			const itemCount = items.filter((item) => item.category_id === categoryId).length;
			for (let i = 0; i < itemCount; i++) {
				await supabase.rpc("decrement_category_item_count", {
					category_id: categoryId,
				});
			}
		}

		revalidatePath("/dashboard/work/pricebook");
		return count || 0;
	});
}
