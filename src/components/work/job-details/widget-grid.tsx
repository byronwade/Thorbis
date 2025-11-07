"use client";

/**
 * Widget Grid - Client Component
 *
 * Client-side features:
 * - Drag-and-drop functionality using @dnd-kit
 * - Dynamic grid layout with responsive columns
 * - Widget resizing and repositioning
 * - Real-time layout updates
 *
 * Performance optimizations:
 * - Zustand for state management (selective subscriptions)
 * - CSS Grid for efficient layout
 * - Debounced resize handlers
 * - Memoized widget components
 */

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  type DropAnimation,
  defaultDropAnimationSideEffects,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import type { Job, Property, User } from "@/lib/db/schema";
import type { PropertyEnrichment } from "@/lib/services/property-enrichment";
import { useEditModeStore } from "@/lib/stores/edit-mode-store";
import {
  useJobDetailsLayoutStore,
  WIDGET_METADATA,
} from "@/lib/stores/job-details-layout-store";
import { WidgetContainer } from "./widget-container";
import { WidgetRenderer } from "./widget-renderer";

// ============================================================================
// Props Types
// ============================================================================

interface WidgetGridProps {
  job: Job;
  property?: Property;
  customer?: User;
  propertyEnrichment?: PropertyEnrichment | null;
  // Additional data for widgets
  invoices?: unknown[];
  estimates?: unknown[];
  photos?: unknown[];
  documents?: unknown[];
  communications?: unknown[];
  teamAssignments?: unknown[];
  materials?: unknown[];
  activities?: unknown[];
}

// ============================================================================
// Widget Grid Component
// ============================================================================

export function WidgetGrid({
  job,
  property,
  customer,
  propertyEnrichment,
  invoices = [],
  estimates = [],
  photos = [],
  documents = [],
  communications = [],
  teamAssignments = [],
  materials = [],
  activities = [],
}: WidgetGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<string[]>([]);

  // Get edit mode from Zustand store
  const isEditMode = useEditModeStore((state) => state.isEditMode);

  // Get widgets from store (cache the filter result)
  const allWidgets = useJobDetailsLayoutStore((state) => state.widgets);
  const updateWidget = useJobDetailsLayoutStore((state) => state.updateWidget);

  // Filter only by visibility (no collapse state)
  const widgets = useMemo(
    () => allWidgets.filter((w) => w.isVisible),
    [allWidgets]
  );

  // Initialize items array with widget IDs in current order
  useMemo(() => {
    if (items.length === 0) {
      setItems(widgets.map((w) => w.id));
    }
  }, [widgets, items.length]);

  // Get widgets in the current drag order
  const orderedWidgets = useMemo(
    () =>
      items
        .map((id) => widgets.find((w) => w.id === id))
        .filter((w): w is NonNullable<typeof w> => w !== undefined),
    [items, widgets]
  );

  // Configure drag sensors with reduced activation distance for better responsiveness
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced from 8px for more responsive drag start
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Drop animation configuration for smooth transitions
  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  // Get the active widget for drag overlay
  const activeWidget = useMemo(
    () => orderedWidgets.find((w) => w.id === activeId),
    [activeId, orderedWidgets]
  );

  // ============================================================================
  // Drag Handlers
  // ============================================================================

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.indexOf(active.id as string);
        const newIndex = prevItems.indexOf(over.id as string);

        // Only move if both indices are valid
        if (oldIndex === -1 || newIndex === -1) {
          return prevItems;
        }

        // Only move one position at a time to prevent jumping
        if (Math.abs(newIndex - oldIndex) > 1) {
          const direction = newIndex > oldIndex ? 1 : -1;
          return arrayMove(prevItems, oldIndex, oldIndex + direction);
        }

        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Commit the new order to the store
      items.forEach((id, index) => {
        updateWidget(id, {
          position: {
            x: index % 2,
            y: Math.floor(index / 2),
          },
        });
      });
    }

    setActiveId(null);
  }

  // ============================================================================
  // Layout Calculation
  // ============================================================================

  /**
   * Masonry-style grid layout
   * Widgets can be either half-width or full-width
   * Uses CSS Grid with 2 columns for half-width flexibility
   */
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.5rem",
    width: "100%",
    gridAutoRows: "min-content",
  };

  // ============================================================================
  // Render
  // ============================================================================

  if (orderedWidgets.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No widgets to display</p>
          <p className="text-muted-foreground text-sm">
            Add widgets from the customization panel
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="relative" style={gridStyle}>
          {orderedWidgets.map((widget) => {
            // Determine if widget is full width or half width
            const isFullWidth = widget.size.width >= 2;

            // Get widget metadata for category
            const metadata = WIDGET_METADATA[widget.type];

            return (
              <div
                className="min-h-[200px]"
                data-widget-category={metadata?.category || "core"}
                data-widget-type={widget.type}
                id={`widget-${widget.id}`}
                key={widget.id}
                style={{
                  gridColumn: isFullWidth ? "1 / -1" : "span 1",
                }}
              >
                <WidgetContainer
                  isDragging={activeId === widget.id}
                  isEditMode={isEditMode}
                  widget={widget}
                >
                  <WidgetRenderer
                    communications={communications}
                    customer={customer}
                    documents={documents}
                    estimates={estimates}
                    invoices={invoices}
                    job={job}
                    photos={photos}
                    property={property}
                    propertyEnrichment={propertyEnrichment}
                    widget={widget}
                    teamAssignments={teamAssignments}
                    materials={materials}
                    activities={activities}
                  />
                </WidgetContainer>
              </div>
            );
          })}
        </div>
      </SortableContext>

      {/* Drag Overlay - Shows widget being dragged with cursor */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeWidget ? (
          <div
            className="cursor-grabbing opacity-95 shadow-2xl"
            style={{
              width: activeWidget.size.width >= 2 ? "800px" : "400px",
              maxWidth: "90vw",
            }}
          >
            <div className="rounded-lg border-2 border-primary bg-card">
              <div className="border-b bg-primary/5 px-4 py-2">
                <h3 className="font-semibold text-sm">{activeWidget.title}</h3>
              </div>
              <div className="p-4">
                <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">
                  Moving {activeWidget.title}...
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
