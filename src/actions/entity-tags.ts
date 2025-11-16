/**
 * Entity Tags Actions - Server Actions
 * Generic tag management for any entity type
 */

"use server";

import { revalidatePath } from "next/cache";
import { withErrorHandling } from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Exclude<
  Awaited<ReturnType<typeof createClient>>,
  null
>;

export type TagWithColor = {
  label: string;
  color?: string;
};

export type EntityTag = string | TagWithColor;

type EntityType =
  | "customer"
  | "job"
  | "property"
  | "invoice"
  | "estimate"
  | "equipment"
  | "appointment"
  | "material"
  | "vendor";

const ENTITY_TAG_FIELD_MAP: Record<
  EntityType,
  { table: string; field: string; useMetadata: boolean }
> = {
  customer: { table: "customers", field: "tags", useMetadata: false },
  job: { table: "jobs", field: "metadata", useMetadata: true },
  property: { table: "properties", field: "metadata", useMetadata: true },
  invoice: { table: "invoices", field: "metadata", useMetadata: true },
  estimate: { table: "estimates", field: "metadata", useMetadata: true },
  equipment: { table: "equipment", field: "metadata", useMetadata: true },
  appointment: { table: "appointments", field: "metadata", useMetadata: true },
  material: { table: "job_materials", field: "metadata", useMetadata: true },
  vendor: { table: "vendors", field: "tags", useMetadata: false },
};

/**
 * Update tags for any entity type
 */
export function updateEntityTags(
  entityType: EntityType,
  entityId: string,
  tags: EntityTag[]
) {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Database connection not available");
    }

    const typedSupabase = supabase as SupabaseServerClient;
    await requireAuthenticatedUser(typedSupabase);

    const config = ENTITY_TAG_FIELD_MAP[entityType];
    if (!config) {
      throw new Error(`Unsupported entity type: ${entityType}`);
    }

    const updateData = await buildTagsUpdateData({
      supabase: typedSupabase,
      config,
      entityId,
      entityType,
      tags,
    });

    await applyTagUpdate({
      supabase: typedSupabase,
      config,
      entityId,
      entityType,
      updateData,
    });

    revalidateEntityPaths(entityType, entityId);

    return { entityId, entityType, tags };
  });
}

/**
 * Get the base path for an entity type
 */
function getPathForEntity(entityType: EntityType): string | null {
  const pathMap: Record<EntityType, string | null> = {
    customer: "customers",
    job: "work",
    property: "work/properties",
    invoice: "work/invoices",
    estimate: "work/estimates",
    equipment: "work/equipment",
    appointment: "schedule",
    material: null,
    vendor: "work/vendors",
  };
  return pathMap[entityType] ?? null;
}

const requireAuthenticatedUser = async (supabase: SupabaseServerClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user;
};

type TagUpdateConfig = (typeof ENTITY_TAG_FIELD_MAP)[EntityType];

type BuildTagsUpdateDataParams = {
  supabase: SupabaseServerClient;
  config: TagUpdateConfig;
  entityId: string;
  entityType: EntityType;
  tags: EntityTag[];
};

const buildTagsUpdateData = async ({
  supabase,
  config,
  entityId,
  entityType,
  tags,
}: BuildTagsUpdateDataParams): Promise<Record<string, unknown>> => {
  if (!config.useMetadata) {
    return {
      tags,
      updated_at: new Date().toISOString(),
    };
  }

  const { data: existingRecord, error: fetchError } = await supabase
    .from(config.table)
    .select("metadata")
    .eq("id", entityId)
    .single();

  if (fetchError) {
    throw new Error(
      `Failed to load ${entityType} metadata: ${fetchError.message}`
    );
  }

  const existingMetadata =
    existingRecord &&
    typeof existingRecord.metadata === "object" &&
    existingRecord.metadata !== null
      ? (existingRecord.metadata as Record<string, unknown>)
      : {};

  return {
    metadata: {
      ...existingMetadata,
      tags,
    },
    updated_at: new Date().toISOString(),
  };
};

type ApplyTagUpdateParams = {
  supabase: SupabaseServerClient;
  config: TagUpdateConfig;
  entityId: string;
  entityType: EntityType;
  updateData: Record<string, unknown>;
};

const applyTagUpdate = async ({
  supabase,
  config,
  entityId,
  entityType,
  updateData,
}: ApplyTagUpdateParams) => {
  const { error } = await supabase
    .from(config.table)
    .update(updateData)
    .eq("id", entityId);

  if (error) {
    throw new Error(`Failed to update ${entityType} tags: ${error.message}`);
  }
};

const revalidateEntityPaths = (entityType: EntityType, entityId: string) => {
  const basePath = getPathForEntity(entityType);
  if (basePath) {
    revalidatePath(`/dashboard/${basePath}/${entityId}`);
    revalidatePath(`/dashboard/${basePath}`);
  }

  revalidatePath("/dashboard");
};
