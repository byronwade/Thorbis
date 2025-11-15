import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { MaterialPageContent } from "@/components/work/materials/material-page-content";
import {
  getActiveCompanyId,
  isActiveCompanyOnboardingComplete,
} from "@/lib/auth/company-context";
import { generateMaterialStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type MaterialStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "on-order"
  | "inactive";

type PriceBookItemRow = {
  id: string;
  name: string | null;
  description: string | null;
  sku: string | null;
  unit: string | null;
  category: string | null;
  subcategory: string | null;
};

type InventoryRow = {
  id: string;
  company_id: string;
  price_book_item_id: string | null;
  quantity_on_hand: number | null;
  quantity_reserved: number | null;
  quantity_available: number | null;
  minimum_quantity: number | null;
  maximum_quantity: number | null;
  reorder_point: number | null;
  reorder_quantity: number | null;
  cost_per_unit: number | null;
  total_cost_value: number | null;
  last_purchase_cost: number | null;
  warehouse_location: string | null;
  primary_location: string | null;
  status: string | null;
  notes: string | null;
  is_low_stock: boolean | null;
  low_stock_alert_sent: boolean | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  price_book_item: PriceBookItemRow | null;
};

type ActivityLogRow = {
  id: string;
  entity_type: string | null;
  entity_id: string | null;
  action: string | null;
  description: string | null;
  created_at: string;
  user: {
    id: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    avatar: string | null;
  } | null;
};

type ActivityLogUser = NonNullable<ActivityLogRow["user"]>;

type ActivityLogRaw = Omit<ActivityLogRow, "user"> & {
  user: ActivityLogUser | ActivityLogUser[] | null;
};

type NoteRow = {
  id: string;
  content: string | null;
  created_at: string;
};

type AttachmentRow = {
  id: string;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  url: string | null;
  created_at: string;
};

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: materialId } = await params;

  const supabase = await createClient();
  if (!supabase) {
    return notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const isOnboardingComplete = await isActiveCompanyOnboardingComplete();
  if (!isOnboardingComplete) {
    redirect("/dashboard/welcome");
  }

  const activeCompanyId = await getActiveCompanyId();
  if (!activeCompanyId) {
    redirect("/dashboard/welcome");
  }

  const { data: materialRow, error: materialError } = await supabase
    .from("inventory")
    .select(
      `
        id,
        company_id,
        price_book_item_id,
        quantity_on_hand,
        quantity_reserved,
        quantity_available,
        minimum_quantity,
        maximum_quantity,
        reorder_point,
        reorder_quantity,
        cost_per_unit,
        total_cost_value,
        last_purchase_cost,
        warehouse_location,
        primary_location,
        status,
        notes,
        is_low_stock,
        low_stock_alert_sent,
        created_at,
        updated_at,
        deleted_at,
        price_book_item:price_book_item_id (
          id,
          name,
          description,
          sku,
          unit,
          category,
          subcategory
        )
      `
    )
    .eq("id", materialId)
    .maybeSingle<InventoryRow>();

  if (materialError || !materialRow) {
    return notFound();
  }

  if (materialRow.company_id !== activeCompanyId || materialRow.deleted_at) {
    return notFound();
  }

  const status =
    (materialRow.status as MaterialStatus | null) ??
    (materialRow.is_low_stock ? "low-stock" : "in-stock");

  const quantityOnHand = materialRow.quantity_on_hand ?? 0;
  const quantityReserved = materialRow.quantity_reserved ?? 0;
  const quantityAvailable = materialRow.quantity_available ?? quantityOnHand;
  const minimumQuantity = materialRow.minimum_quantity ?? 0;
  const reorderPoint = materialRow.reorder_point ?? null;
  const reorderQuantity = materialRow.reorder_quantity ?? null;
  const costPerUnit = materialRow.cost_per_unit ?? 0;
  const totalCostValue =
    materialRow.total_cost_value ??
    costPerUnit * (materialRow.quantity_on_hand ?? 0);

  const material = {
    id: materialRow.id,
    name:
      materialRow.price_book_item?.name ??
      materialRow.price_book_item?.sku ??
      "Material",
    sku: materialRow.price_book_item?.sku,
    description:
      materialRow.price_book_item?.description ?? materialRow.notes ?? "",
    status,
    quantityOnHand,
    quantityReserved,
    quantityAvailable,
    minimumQuantity,
    maximumQuantity: materialRow.maximum_quantity,
    reorderPoint,
    reorderQuantity,
    costPerUnit,
    totalCostValue,
    lastPurchaseCost: materialRow.last_purchase_cost,
    warehouseLocation: materialRow.warehouse_location,
    primaryLocation: materialRow.primary_location,
    notes: materialRow.notes,
    isLowStock: materialRow.is_low_stock ?? false,
    lowStockAlertSent: materialRow.low_stock_alert_sent ?? false,
    createdAt: materialRow.created_at,
    updatedAt: materialRow.updated_at,
  };

  const priceBookItem = materialRow.price_book_item
    ? {
        id: materialRow.price_book_item.id,
        name: materialRow.price_book_item.name,
        description: materialRow.price_book_item.description,
        sku: materialRow.price_book_item.sku,
        unit: materialRow.price_book_item.unit,
        category: materialRow.price_book_item.category,
        subcategory: materialRow.price_book_item.subcategory,
      }
    : undefined;

  const [
    { data: activitiesRaw },
    { data: notesRaw },
    { data: attachmentsRaw },
  ] = await Promise.all([
    supabase
      .from("activity_log")
      .select(
        `
          id,
          entity_type,
          entity_id,
          action,
          description,
          created_at,
          user:users!user_id (
            id,
            first_name,
            last_name,
            email,
            avatar
          )
        `
      )
      .eq("entity_type", "material")
      .eq("entity_id", materialId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("notes")
      .select("id, content, created_at")
      .eq("entity_type", "material")
      .eq("entity_id", materialId)
      .order("created_at", { ascending: false }),
    supabase
      .from("attachments")
      .select("id, file_name, file_size, file_type, url, created_at")
      .eq("entity_type", "material")
      .eq("entity_id", materialId)
      .order("created_at", { ascending: false }),
  ]);

  const rawActivities = (activitiesRaw ?? []) as ActivityLogRaw[];

  const activities = rawActivities.map((activity) => {
    const resolvedUser = Array.isArray(activity.user)
      ? (activity.user[0] ?? null)
      : activity.user;

    return {
      id: activity.id,
      entityType: activity.entity_type,
      entityId: activity.entity_id,
      action: activity.action,
      description: activity.description,
      createdAt: activity.created_at,
      user: resolvedUser
        ? {
            id: resolvedUser.id,
            name:
              `${resolvedUser.first_name ?? ""} ${resolvedUser.last_name ?? ""}`.trim() ||
              resolvedUser.email,
            avatar: resolvedUser.avatar ?? null,
          }
        : null,
    };
  });

  const notes =
    notesRaw?.map((note) => {
      const entry = note as NoteRow;
      return {
        id: entry.id,
        content: entry.content,
        created_at: entry.created_at,
        user: null,
      };
    }) ?? [];

  const attachments =
    attachmentsRaw?.map((attachment) => {
      const entry = attachment as AttachmentRow;
      return {
        id: entry.id,
        file_name: entry.file_name,
        file_size: entry.file_size,
        file_type: entry.file_type,
        url: entry.url,
        created_at: entry.created_at,
      };
    }) ?? [];

  const metrics = {
    quantityOnHand,
    quantityReserved,
    quantityAvailable,
    minimumQuantity,
    reorderPoint,
    totalValue: totalCostValue,
    status,
  };

  const stats = generateMaterialStats(metrics);

  return (
    <ToolbarStatsProvider stats={stats}>
      <div className="flex h-full w-full flex-col overflow-auto">
        <div className="mx-auto w-full max-w-7xl">
          <MaterialPageContent
            entityData={{
              material,
              priceBookItem,
              activities,
              notes,
              attachments,
            }}
          />
        </div>
      </div>
    </ToolbarStatsProvider>
  );
}
