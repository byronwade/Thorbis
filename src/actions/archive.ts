/**
 * Archive Management Server Actions
 *
 * Unified archive management across all entities:
 * - Fetch archived items with filters
 * - Bulk restore operations
 * - Permanent deletion (admin only)
 * - Archive statistics
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ActionError,
  ERROR_CODES,
  ERROR_MESSAGES,
} from "@/lib/errors/action-error";
import {
  type ActionResult,
  assertAuthenticated,
  withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// Entity types that support archiving
export type ArchivableEntityType =
  | "invoice"
  | "estimate"
  | "contract"
  | "job"
  | "customer"
  | "property"
  | "equipment";

// Archived item representation
export type ArchivedItem = {
  id: string;
  entityType: ArchivableEntityType;
  entityNumber?: string; // invoice_number, job_number, etc.
  displayName: string; // Human-readable name
  deletedAt: string;
  deletedBy?: string;
  deletedByName?: string;
  archivedAt: string;
  permanentDeleteScheduledAt: string;
  daysUntilPermanentDelete: number;
  metadata?: Record<string, any>; // Entity-specific data
};

// Filter options for archive queries
const getArchivedItemsSchema = z.object({
  entityType: z
    .enum([
      "invoice",
      "estimate",
      "contract",
      "job",
      "customer",
      "property",
      "equipment",
      "all",
    ])
    .default("all"),
  dateRange: z.enum(["7days", "30days", "90days", "all"]).default("30days"),
  deletedBy: z.string().uuid().optional(),
  searchQuery: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

/**
 * Get archived items with filters
 */
export async function getArchivedItems(
  options: z.infer<typeof getArchivedItemsSchema>
): Promise<ActionResult<ArchivedItem[]>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const validated = getArchivedItemsSchema.parse(options);

    // Calculate date range filter
    let dateFilter: Date | null = null;
    if (validated.dateRange !== "all") {
      const days =
        validated.dateRange === "7days"
          ? 7
          : validated.dateRange === "30days"
            ? 30
            : 90;
      dateFilter = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    }

    const archivedItems: ArchivedItem[] = [];

    // Helper to fetch from a specific table
    const fetchArchived = async (
      table: string,
      entityType: ArchivableEntityType,
      numberField?: string
    ) => {
      let query = supabase
        .from(table)
        .select(
          `
          id,
          ${numberField ? `${numberField},` : ""}
          deleted_at,
          deleted_by,
          archived_at,
          permanent_delete_scheduled_at,
          *
        `
        )
        .eq("company_id", teamMember.company_id)
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });

      if (dateFilter) {
        query = query.gte("deleted_at", dateFilter.toISOString());
      }

      if (validated.deletedBy) {
        query = query.eq("deleted_by", validated.deletedBy);
      }

      const { data, error } = await query.limit(validated.limit);

      if (error) {
        console.error(`Error fetching archived ${table}:`, error);
        return [];
      }

      return (data || []).map((item: any) => {
        const now = new Date();
        const permanentDeleteDate = new Date(
          item.permanent_delete_scheduled_at || item.deleted_at
        );
        const daysUntil = Math.ceil(
          (permanentDeleteDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: item.id,
          entityType,
          entityNumber: numberField ? item[numberField] : undefined,
          displayName: getDisplayName(item, entityType),
          deletedAt: item.deleted_at,
          deletedBy: item.deleted_by,
          archivedAt: item.archived_at || item.deleted_at,
          permanentDeleteScheduledAt:
            item.permanent_delete_scheduled_at ||
            new Date(
              new Date(item.deleted_at).getTime() + 90 * 24 * 60 * 60 * 1000
            ).toISOString(),
          daysUntilPermanentDelete: Math.max(0, daysUntil),
          metadata: item,
        };
      });
    };

    // Fetch from requested entity types
    if (validated.entityType === "all" || validated.entityType === "invoice") {
      const items = await fetchArchived("invoices", "invoice", "invoice_number");
      archivedItems.push(...items);
    }

    if (validated.entityType === "all" || validated.entityType === "estimate") {
      const items = await fetchArchived("estimates", "estimate", "estimate_number");
      archivedItems.push(...items);
    }

    if (validated.entityType === "all" || validated.entityType === "contract") {
      const items = await fetchArchived("contracts", "contract", "contract_number");
      archivedItems.push(...items);
    }

    if (validated.entityType === "all" || validated.entityType === "job") {
      const items = await fetchArchived("jobs", "job", "job_number");
      archivedItems.push(...items);
    }

    if (validated.entityType === "all" || validated.entityType === "customer") {
      const items = await fetchArchived("customers", "customer");
      archivedItems.push(...items);
    }

    if (validated.entityType === "all" || validated.entityType === "property") {
      const items = await fetchArchived("properties", "property");
      archivedItems.push(...items);
    }

    if (validated.entityType === "all" || validated.entityType === "equipment") {
      const items = await fetchArchived(
        "equipment",
        "equipment",
        "equipment_number"
      );
      archivedItems.push(...items);
    }

    // Sort by most recently deleted
    archivedItems.sort(
      (a, b) =>
        new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
    );

    // Apply search filter if provided
    if (validated.searchQuery) {
      const query = validated.searchQuery.toLowerCase();
      return archivedItems.filter(
        (item) =>
          item.displayName.toLowerCase().includes(query) ||
          item.entityNumber?.toLowerCase().includes(query) ||
          item.entityType.toLowerCase().includes(query)
      );
    }

    return archivedItems;
  });
}

/**
 * Helper to get display name for different entity types
 */
function getDisplayName(item: any, entityType: ArchivableEntityType): string {
  switch (entityType) {
    case "invoice":
      return `Invoice ${item.invoice_number}`;
    case "estimate":
      return `Estimate ${item.estimate_number}`;
    case "contract":
      return `Contract ${item.contract_number || item.title || item.id}`;
    case "job":
      return `Job ${item.job_number} - ${item.title || "Untitled"}`;
    case "customer":
      return (
        item.display_name ||
        `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
        "Unknown Customer"
      );
    case "property":
      return item.name || item.address || "Unknown Property";
    case "equipment":
      return `${item.equipment_number || ""} ${item.name || "Unknown Equipment"}`.trim();
    default:
      return "Unknown Item";
  }
}

/**
 * Get archive statistics
 */
export async function getArchiveStats(): Promise<
  ActionResult<Record<ArchivableEntityType, number>>
> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Count archived items for each entity type
    const countArchived = async (table: string) => {
      const { count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true })
        .eq("company_id", teamMember.company_id)
        .not("deleted_at", "is", null);

      return count || 0;
    };

    const [
      invoiceCount,
      estimateCount,
      contractCount,
      jobCount,
      customerCount,
      propertyCount,
      equipmentCount,
    ] = await Promise.all([
      countArchived("invoices"),
      countArchived("estimates"),
      countArchived("contracts"),
      countArchived("jobs"),
      countArchived("customers"),
      countArchived("properties"),
      countArchived("equipment"),
    ]);

    return {
      invoice: invoiceCount,
      estimate: estimateCount,
      contract: contractCount,
      job: jobCount,
      customer: customerCount,
      property: propertyCount,
      equipment: equipmentCount,
    };
  });
}

/**
 * Bulk restore multiple items
 */
export async function bulkRestore(
  itemIds: string[],
  entityType: ArchivableEntityType
): Promise<ActionResult<{ restored: number; failed: number }>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Map entity type to table name
    const tableMap: Record<ArchivableEntityType, string> = {
      invoice: "invoices",
      estimate: "estimates",
      contract: "contracts",
      job: "jobs",
      customer: "customers",
      property: "properties",
      equipment: "equipment",
    };

    const tableName = tableMap[entityType];

    // Restore items
    const { error, count } = await supabase
      .from(tableName)
      .update({
        deleted_at: null,
        deleted_by: null,
        archived_at: null,
        permanent_delete_scheduled_at: null,
      })
      .in("id", itemIds)
      .eq("company_id", teamMember.company_id)
      .not("deleted_at", "is", null); // Only restore actually archived items

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("restore items"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/archive");
    revalidatePath("/dashboard/work");
    revalidatePath("/dashboard/customers");

    return {
      restored: count || 0,
      failed: itemIds.length - (count || 0),
    };
  });
}

/**
 * Permanent delete (hard delete) - Admin only, after 90 days
 */
export async function permanentDelete(
  itemId: string,
  entityType: ArchivableEntityType
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Map entity type to table name
    const tableMap: Record<ArchivableEntityType, string> = {
      invoice: "invoices",
      estimate: "estimates",
      contract: "contracts",
      job: "jobs",
      customer: "customers",
      property: "properties",
      equipment: "equipment",
    };

    const tableName = tableMap[entityType];

    // Verify item is archived and past 90 days
    const { data: item } = await supabase
      .from(tableName)
      .select("deleted_at, archived_at, permanent_delete_scheduled_at")
      .eq("id", itemId)
      .eq("company_id", teamMember.company_id)
      .single();

    if (!item || !item.deleted_at) {
      throw new ActionError(
        "Item is not archived",
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Check if 90 days have passed (or scheduled date is in past)
    const now = new Date();
    const scheduledDate = new Date(
      item.permanent_delete_scheduled_at || item.deleted_at
    );

    if (scheduledDate > now) {
      throw new ActionError(
        `Cannot permanently delete until ${scheduledDate.toLocaleDateString()}. Items can only be permanently deleted after 90 days.`,
        ERROR_CODES.OPERATION_NOT_ALLOWED
      );
    }

    // Permanently delete
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq("id", itemId)
      .eq("company_id", teamMember.company_id);

    if (deleteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("permanently delete item"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/archive");
  });
}
