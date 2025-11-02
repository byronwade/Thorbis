"use client";

/**
 * Price Book Filters Sidebar
 *
 * Clear filtering interface with active filter indicators:
 * - Item type filtering with counts
 * - Nested category tree with drill-down
 * - Active filters shown as removable badges
 * - Quick action buttons
 */

import {
  ArrowLeft,
  Box,
  Calculator,
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  List,
  Package,
  Plus,
  Settings,
  TrendingUp,
  Upload,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePriceBookStore } from "@/lib/stores/pricebook-store";
import { cn } from "@/lib/utils";

type ItemTypeOption = {
  value: "all" | "service" | "material" | "equipment";
  label: string;
  icon: typeof Box;
  color: string;
  count: number; // Number of items of this type
};

const itemTypes: ItemTypeOption[] = [
  {
    value: "all",
    label: "All Items",
    icon: List,
    color: "text-foreground",
    count: 206,
  },
  {
    value: "service",
    label: "Services",
    icon: Wrench,
    color: "text-blue-600 dark:text-blue-400",
    count: 89,
  },
  {
    value: "material",
    label: "Materials",
    icon: Package,
    color: "text-purple-600 dark:text-purple-400",
    count: 73,
  },
  {
    value: "equipment",
    label: "Equipment",
    icon: Box,
    color: "text-orange-600 dark:text-orange-400",
    count: 44,
  },
];

type CategoryNode = {
  name: string;
  icon: typeof Wrench;
  color: string;
  count: number;
  children?: CategoryNode[];
};

const categories: CategoryNode[] = [
  {
    name: "HVAC",
    icon: Zap,
    color: "text-blue-600 dark:text-blue-400",
    count: 67,
    children: [
      {
        name: "Heating",
        icon: Wrench,
        color: "text-blue-600 dark:text-blue-400",
        count: 23,
        children: [
          {
            name: "Furnaces",
            icon: Wrench,
            color: "text-blue-600 dark:text-blue-400",
            count: 12,
          },
          {
            name: "Heat Pumps",
            icon: Wrench,
            color: "text-blue-600 dark:text-blue-400",
            count: 8,
          },
          {
            name: "Boilers",
            icon: Wrench,
            color: "text-blue-600 dark:text-blue-400",
            count: 3,
          },
        ],
      },
      {
        name: "Cooling",
        icon: Wrench,
        color: "text-blue-600 dark:text-blue-400",
        count: 19,
        children: [
          {
            name: "Central AC",
            icon: Wrench,
            color: "text-blue-600 dark:text-blue-400",
            count: 11,
          },
          {
            name: "Ductless Mini-Split",
            icon: Wrench,
            color: "text-blue-600 dark:text-blue-400",
            count: 8,
          },
        ],
      },
      {
        name: "Air Quality",
        icon: Wrench,
        color: "text-blue-600 dark:text-blue-400",
        count: 15,
      },
      {
        name: "Ductwork",
        icon: Wrench,
        color: "text-blue-600 dark:text-blue-400",
        count: 10,
      },
    ],
  },
  {
    name: "Plumbing",
    icon: Wrench,
    color: "text-green-600 dark:text-green-400",
    count: 82,
    children: [
      {
        name: "Fixtures",
        icon: Wrench,
        color: "text-green-600 dark:text-green-400",
        count: 28,
        children: [
          {
            name: "Faucets",
            icon: Wrench,
            color: "text-green-600 dark:text-green-400",
            count: 12,
          },
          {
            name: "Toilets",
            icon: Wrench,
            color: "text-green-600 dark:text-green-400",
            count: 9,
          },
          {
            name: "Sinks",
            icon: Wrench,
            color: "text-green-600 dark:text-green-400",
            count: 7,
          },
        ],
      },
      {
        name: "Garbage Disposals",
        icon: Wrench,
        color: "text-green-600 dark:text-green-400",
        count: 15,
        children: [
          {
            name: "1/3 HP",
            icon: Wrench,
            color: "text-green-600 dark:text-green-400",
            count: 5,
          },
          {
            name: "1/2 HP",
            icon: Wrench,
            color: "text-green-600 dark:text-green-400",
            count: 6,
          },
          {
            name: "3/4 HP",
            icon: Wrench,
            color: "text-green-600 dark:text-green-400",
            count: 4,
          },
        ],
      },
      {
        name: "Water Heaters",
        icon: Wrench,
        color: "text-green-600 dark:text-green-400",
        count: 22,
        children: [
          {
            name: "Tank",
            icon: Wrench,
            color: "text-green-600 dark:text-green-400",
            count: 14,
          },
          {
            name: "Tankless",
            icon: Wrench,
            color: "text-green-600 dark:text-green-400",
            count: 8,
          },
        ],
      },
      {
        name: "Pipes & Fittings",
        icon: Wrench,
        color: "text-green-600 dark:text-green-400",
        count: 17,
      },
    ],
  },
  {
    name: "Electrical",
    icon: Zap,
    color: "text-yellow-600 dark:text-yellow-400",
    count: 41,
    children: [
      {
        name: "Panels",
        icon: Zap,
        color: "text-yellow-600 dark:text-yellow-400",
        count: 12,
      },
      {
        name: "Outlets & Switches",
        icon: Zap,
        color: "text-yellow-600 dark:text-yellow-400",
        count: 18,
      },
      {
        name: "Lighting",
        icon: Zap,
        color: "text-yellow-600 dark:text-yellow-400",
        count: 11,
      },
    ],
  },
  {
    name: "General",
    icon: Package,
    color: "text-gray-600 dark:text-gray-400",
    count: 16,
  },
];

// Recursive component for rendering nested categories
function CategoryTree({
  node,
  level = 0,
  parentPath = "",
  selectedPath,
  onSelect,
  expandedNodes,
  onToggle,
}: {
  node: CategoryNode;
  level?: number;
  parentPath?: string;
  selectedPath: string | null;
  onSelect: (path: string) => void;
  expandedNodes: Set<string>;
  onToggle: (path: string) => void;
}) {
  const currentPath = parentPath ? `${parentPath} > ${node.name}` : node.name;
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(currentPath);
  const isSelected = selectedPath === currentPath;
  const Icon = node.icon;

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          className={cn(
            "group justify-between",
            isSelected && "bg-accent font-medium",
            level > 0 && "text-sm"
          )}
          onClick={() => onSelect(currentPath)}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
        >
          <div className="flex items-center gap-2">
            {level === 0 && <Icon className={cn("size-4", node.color)} />}
            <span>{node.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge className="h-5 px-1.5 text-xs" variant="secondary">
              {node.count}
            </Badge>
            {hasChildren && (
              <button
                className="p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(currentPath);
                }}
                type="button"
              >
                {isExpanded ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </button>
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {hasChildren && isExpanded && (
        <>
          {node.children!.map((child) => (
            <CategoryTree
              expandedNodes={expandedNodes}
              key={child.name}
              level={level + 1}
              node={child}
              onSelect={onSelect}
              onToggle={onToggle}
              parentPath={currentPath}
              selectedPath={selectedPath}
            />
          ))}
        </>
      )}
    </>
  );
}

export function PriceBookFiltersSidebar() {
  const itemTypeFilter = usePriceBookStore((state) => state.itemTypeFilter);
  const categoryFilter = usePriceBookStore((state) => state.categoryFilter);
  const setItemTypeFilter = usePriceBookStore(
    (state) => state.setItemTypeFilter
  );
  const setCategoryFilter = usePriceBookStore(
    (state) => state.setCategoryFilter
  );
  const clearAllFilters = usePriceBookStore((state) => state.clearAllFilters);
  const hasActiveFilters = usePriceBookStore((state) =>
    state.hasActiveFilters()
  );

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Auto-expand parent categories when a deep category is selected
  useEffect(() => {
    if (categoryFilter.category) {
      const path = categoryFilter.category;
      const segments = path.split(" > ");
      const parentsToExpand = new Set<string>();

      // Build all parent paths
      for (let i = 0; i < segments.length; i++) {
        const parentPath = segments.slice(0, i + 1).join(" > ");
        parentsToExpand.add(parentPath);
      }

      setExpandedNodes((prev) => new Set([...prev, ...parentsToExpand]));
    }
  }, [categoryFilter.category]);

  const handleCategorySelect = (path: string) => {
    // For now, just store the full path in category
    // Later we can split this into category/subcategory
    setCategoryFilter(path);
  };

  const toggleNode = (path: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const removeItemTypeFilter = () => {
    setItemTypeFilter("all");
  };

  const removeCategoryFilter = () => {
    setCategoryFilter(null);
  };

  // Build active filters array for display
  const activeFilters: Array<{ label: string; onRemove: () => void }> = [];

  if (itemTypeFilter !== "all") {
    const type = itemTypes.find((t) => t.value === itemTypeFilter);
    if (type) {
      activeFilters.push({
        label: type.label,
        onRemove: removeItemTypeFilter,
      });
    }
  }

  if (categoryFilter.category) {
    activeFilters.push({
      label: categoryFilter.category,
      onRemove: removeCategoryFilter,
    });
  }

  return (
    <div className="flex h-full flex-col">
      {/* Back Button */}
      <div className="p-3">
        <Button
          asChild
          className="w-full justify-start"
          size="sm"
          variant="ghost"
        >
          <Link href="/dashboard/work">
            <ArrowLeft className="mr-2 size-4" />
            Back to Work
          </Link>
        </Button>
      </div>

      {/* Active Filters - Show what's currently filtering */}
      {hasActiveFilters && (
        <div className="space-y-2 bg-accent/50 p-3">
          <div className="flex items-center gap-2 font-medium text-muted-foreground text-xs">
            <Filter className="size-3" />
            <span>Active Filters</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeFilters.map((filter, index) => (
              <Badge className="gap-1 pr-1" key={index} variant="secondary">
                <span>{filter.label}</span>
                <button
                  className="rounded-sm hover:bg-accent"
                  onClick={filter.onRemove}
                  type="button"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Button
            className="w-full text-xs"
            onClick={clearAllFilters}
            size="sm"
            variant="outline"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Item Type Filter */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Filter className="size-3" />
            Filter by Type
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = itemTypeFilter === type.value;

                return (
                  <SidebarMenuItem key={type.value}>
                    <SidebarMenuButton
                      className={cn(
                        "justify-between",
                        isSelected && "bg-accent font-medium"
                      )}
                      onClick={() => setItemTypeFilter(type.value)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={cn("size-4", type.color)} />
                        <span>{type.label}</span>
                      </div>
                      <Badge className="h-5 px-1.5 text-xs" variant="secondary">
                        {type.count}
                      </Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories with Nested Tree */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Filter className="size-3" />
            Filter by Category
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <CategoryTree
                  expandedNodes={expandedNodes}
                  key={category.name}
                  node={category}
                  onSelect={handleCategorySelect}
                  onToggle={toggleNode}
                  selectedPath={categoryFilter.category}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/work/pricebook/new">
                    <Plus className="size-4" />
                    <span>Add Item</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/work/pricebook/labor-calculator">
                    <Calculator className="size-4" />
                    <span>Labor Calculator</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/work/pricebook/mass-update">
                    <TrendingUp className="size-4" />
                    <span>Mass Update</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/work/pricebook/import">
                    <Upload className="size-4" />
                    <span>Import</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/work/pricebook/export">
                    <Download className="size-4" />
                    <span>Export</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/settings/pricebook">
                    <Settings className="size-4" />
                    <span>Price Book Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
    </div>
  );
}
