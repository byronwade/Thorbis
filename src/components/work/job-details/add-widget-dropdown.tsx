"use client";

/**
 * Add Widget Dropdown - Client Component
 *
 * Displays all available widgets in a compact dropdown menu
 * Organized by category with search functionality
 * Pattern matches PresetReportsDropdown for consistency
 */

import { ChevronRight, Plus, Search } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type JobWidgetType,
  useJobDetailsLayoutStore,
  WIDGET_METADATA,
} from "@/lib/stores/job-details-layout-store";
import { cn } from "@/lib/utils";

type WidgetCategory = {
  label: string;
  items: {
    type: JobWidgetType;
    title: string;
    description: string;
    badge?: string;
  }[];
};

export function AddWidgetDropdown() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const widgets = useJobDetailsLayoutStore((state) => state.widgets);
  const addWidget = useJobDetailsLayoutStore((state) => state.addWidget);

  // Get available widgets (not already added)
  const availableWidgets = Object.entries(WIDGET_METADATA).filter(
    ([widgetType]) => !widgets.some((w) => w.type === widgetType)
  );

  // Group widgets by category
  const widgetsByCategory: WidgetCategory[] = [
    {
      label: "Core",
      items: availableWidgets
        .filter(([_, metadata]) => metadata.category === "core")
        .map(([type, metadata]) => ({
          type: type as JobWidgetType,
          title: metadata.title,
          description: metadata.description,
        })),
    },
    {
      label: "Financial",
      items: availableWidgets
        .filter(([_, metadata]) => metadata.category === "financial")
        .map(([type, metadata]) => ({
          type: type as JobWidgetType,
          title: metadata.title,
          description: metadata.description,
        })),
    },
    {
      label: "Project Management",
      items: availableWidgets
        .filter(([_, metadata]) => metadata.category === "project")
        .map(([type, metadata]) => ({
          type: type as JobWidgetType,
          title: metadata.title,
          description: metadata.description,
        })),
    },
    {
      label: "Documentation",
      items: availableWidgets
        .filter(([_, metadata]) => metadata.category === "documentation")
        .map(([type, metadata]) => ({
          type: type as JobWidgetType,
          title: metadata.title,
          description: metadata.description,
        })),
    },
    {
      label: "Analytics",
      items: availableWidgets
        .filter(([_, metadata]) => metadata.category === "analytics")
        .map(([type, metadata]) => ({
          type: type as JobWidgetType,
          title: metadata.title,
          description: metadata.description,
        })),
    },
    {
      label: "Industry-Specific",
      items: availableWidgets
        .filter(([_, metadata]) => metadata.category === "industry")
        .map(([type, metadata]) => ({
          type: type as JobWidgetType,
          title: metadata.title,
          description: metadata.description,
        })),
    },
  ].filter((category) => category.items.length > 0);

  // Filter widgets based on search
  const filteredCategories = widgetsByCategory
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  const handleAddWidget = (widgetType: JobWidgetType) => {
    addWidget(widgetType);
    setOpen(false);
    setSearchQuery("");
  };

  const totalAvailable = widgetsByCategory.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-md px-2 py-2",
            "font-medium text-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          type="button"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Widget</span>
          </div>
          <ChevronRight
            className={cn("h-4 w-4 transition-transform", open && "rotate-90")}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[320px]" side="right">
        {/* Search */}
        <div className="p-2">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-2 h-4 w-4 text-muted-foreground" />
            <Input
              className="h-9 pl-8"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search widgets..."
              value={searchQuery}
            />
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* Widget Categories */}
        <ScrollArea className="h-[400px]">
          {filteredCategories.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-sm">
              {totalAvailable === 0 ? "All widgets added" : "No widgets found"}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredCategories.map((category) => (
                <div
                  className="relative flex w-full min-w-0 flex-col p-2"
                  key={category.label}
                >
                  {/* Category Label - matches SidebarGroupLabel styling */}
                  <div className="flex h-8 shrink-0 items-center rounded-md px-2 font-medium text-muted-foreground text-xs">
                    {category.label}
                  </div>

                  {/* Widget Items */}
                  <div className="flex flex-col gap-0.5">
                    {category.items.map((widget) => (
                      <button
                        className={cn(
                          "flex flex-col gap-1 rounded-md p-2 text-left outline-hidden transition-all",
                          "focus-visible:ring-2 focus-visible:ring-ring",
                          "hover:bg-accent hover:text-accent-foreground",
                          "min-h-[44px] w-full border border-transparent"
                        )}
                        key={widget.type}
                        onClick={() => handleAddWidget(widget.type)}
                        type="button"
                      >
                        <span className="font-medium text-[0.8rem]">
                          {widget.title}
                        </span>
                        <span className="text-[0.7rem] text-muted-foreground leading-tight">
                          {widget.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <DropdownMenuSeparator />
        <div className="p-2 text-center text-muted-foreground text-xs">
          {totalAvailable} widget{totalAvailable !== 1 ? "s" : ""} available
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
