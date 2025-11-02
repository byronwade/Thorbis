"use client";

/**
 * Item Detail Toolbar Wrapper - Client Component
 *
 * Extracts item ID from URL and passes to ItemDetailToolbarActions
 * This allows the layout config to remain static while getting dynamic params
 */

import { useParams } from "next/navigation";
import { ItemDetailToolbarActions } from "./item-detail-toolbar-actions";

export function ItemDetailToolbarWrapper() {
  const params = useParams();
  const itemId = params.id as string;

  // TODO: Could fetch item data here to get isActive status
  // For now, default to active
  return <ItemDetailToolbarActions isActive={true} itemId={itemId} />;
}
