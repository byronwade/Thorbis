"use client";

/**
 * Category Tree Navigator - Infinite Nested Categories UI
 *
 * Features:
 * - Collapsible tree view
 * - Breadcrumb navigation
 * - Item counts on each category
 * - Drag & drop to move items/categories (future)
 * - Search/filter
 * - Icons and colors per category
 *
 * UI Pattern: Similar to file explorer
 * - Left: Collapsible tree
 * - Top: Breadcrumbs showing current path
 * - Right: Items in selected category
 */

import {
  ChevronDown,
  ChevronRight,
  Edit,
  Folder,
  FolderOpen,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Category type (matches schema)
export type Category = {
  id: string;
  name: string;
  slug: string;
  path: string;
  level: number;
  parentId: string | null;
  icon?: string | null;
  color?: string | null;
  itemCount: number;
  descendantItemCount: number;
  isActive: boolean;
  children?: Category[]; // Populated in UI
};

type CategoryTreeNavigatorProps = {
  categories: Category[];
  selectedCategoryId?: string | null;
  onCategorySelect: (category: Category | null) => void;
  onCategoryCreate?: (parentId: string | null) => void;
  onCategoryEdit?: (category: Category) => void;
  onCategoryDelete?: (category: Category) => void;
};

/**
 * Build tree structure from flat list with materialized path
 */
function buildTree(flatCategories: Category[]): Category[] {
  // Sort by path to ensure parents come before children
  const sorted = [...flatCategories].sort((a, b) =>
    a.path.localeCompare(b.path)
  );

  // Map to store categories by ID
  const map = new Map<string, Category>();

  // Initialize all categories
  sorted.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  const tree: Category[] = [];

  // Build tree structure
  sorted.forEach((cat) => {
    const node = map.get(cat.id)!;

    if (cat.parentId) {
      // Find parent and add as child
      const parent = map.get(cat.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      }
    } else {
      // Root level
      tree.push(node);
    }
  });

  return tree;
}

/**
 * Get breadcrumb path for a category
 */
function getBreadcrumbs(
  category: Category | null,
  allCategories: Category[]
): Category[] {
  if (!category) return [];

  const breadcrumbs: Category[] = [];
  const categoryMap = new Map(allCategories.map((c) => [c.id, c]));

  let current: Category | undefined = category;
  while (current) {
    breadcrumbs.unshift(current);
    current = current.parentId ? categoryMap.get(current.parentId) : undefined;
  }

  return breadcrumbs;
}

export function CategoryTreeNavigator({
  categories,
  selectedCategoryId,
  onCategorySelect,
  onCategoryCreate,
  onCategoryEdit,
  onCategoryDelete,
}: CategoryTreeNavigatorProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Build tree structure
  const tree = buildTree(categories);

  // Find selected category
  const selectedCategory =
    categories.find((c) => c.id === selectedCategoryId) || null;

  // Get breadcrumbs for selected category
  const breadcrumbs = getBreadcrumbs(selectedCategory, categories);

  // Toggle expand/collapse
  const toggleExpand = (categoryId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Filter categories by search
  const filteredTree =
    searchQuery.trim() === ""
      ? tree
      : tree.filter((cat) => matchesSearch(cat, searchQuery));

  function matchesSearch(category: Category, query: string): boolean {
    const lowerQuery = query.toLowerCase();
    if (category.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    return category.children?.some((child) => matchesSearch(child, query)) ?? false;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Search Bar */}
      <div className="border-b p-3">
        <div className="relative">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            type="search"
            value={searchQuery}
          />
        </div>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="border-b bg-muted/30 px-3 py-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer text-sm"
                  onClick={() => onCategorySelect(null)}
                >
                  All Categories
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((cat, index) => (
                <div key={cat.id}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className={cn(
                        "cursor-pointer text-sm",
                        index === breadcrumbs.length - 1 &&
                          "font-semibold text-foreground"
                      )}
                      onClick={() => onCategorySelect(cat)}
                    >
                      {cat.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      {/* Category Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Root level option */}
        <CategoryNode
          category={null}
          isExpanded={true}
          isSelected={selectedCategoryId === null}
          level={0}
          onCategoryEdit={onCategoryEdit}
          onCategorySelect={() => onCategorySelect(null)}
          onToggleExpand={() => {}}
        >
          All Items
        </CategoryNode>

        {/* Recursive tree */}
        {filteredTree.map((category) => (
          <CategoryTreeNode
            category={category}
            expandedIds={expandedIds}
            key={category.id}
            onCategoryCreate={onCategoryCreate}
            onCategoryDelete={onCategoryDelete}
            onCategoryEdit={onCategoryEdit}
            onCategorySelect={onCategorySelect}
            onToggleExpand={toggleExpand}
            selectedCategoryId={selectedCategoryId}
          />
        ))}
      </div>

      {/* Add Root Category Button */}
      {onCategoryCreate && (
        <div className="border-t p-2">
          <Button
            className="w-full"
            onClick={() => onCategoryCreate(null)}
            size="sm"
            variant="outline"
          >
            <Plus className="mr-2 size-4" />
            Add Category
          </Button>
        </div>
      )}
    </div>
  );
}

type CategoryTreeNodeProps = {
  category: Category;
  selectedCategoryId?: string | null;
  expandedIds: Set<string>;
  onCategorySelect: (category: Category) => void;
  onToggleExpand: (id: string) => void;
  onCategoryCreate?: (parentId: string | null) => void;
  onCategoryEdit?: (category: Category) => void;
  onCategoryDelete?: (category: Category) => void;
};

function CategoryTreeNode({
  category,
  selectedCategoryId,
  expandedIds,
  onCategorySelect,
  onToggleExpand,
  onCategoryCreate,
  onCategoryEdit,
  onCategoryDelete,
}: CategoryTreeNodeProps) {
  const isExpanded = expandedIds.has(category.id);
  const isSelected = selectedCategoryId === category.id;
  const hasChildren = (category.children?.length || 0) > 0;

  return (
    <div>
      <CategoryNode
        category={category}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        isSelected={isSelected}
        level={category.level}
        onCategoryCreate={onCategoryCreate}
        onCategoryDelete={onCategoryDelete}
        onCategoryEdit={onCategoryEdit}
        onCategorySelect={() => onCategorySelect(category)}
        onToggleExpand={() => onToggleExpand(category.id)}
      />

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="ml-4">
          {category.children?.map((child) => (
            <CategoryTreeNode
              category={child}
              expandedIds={expandedIds}
              key={child.id}
              onCategoryCreate={onCategoryCreate}
              onCategoryDelete={onCategoryDelete}
              onCategoryEdit={onCategoryEdit}
              onCategorySelect={onCategorySelect}
              onToggleExpand={onToggleExpand}
              selectedCategoryId={selectedCategoryId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type CategoryNodeProps = {
  category: Category | null;
  isSelected: boolean;
  isExpanded: boolean;
  onCategorySelect: () => void;
  onToggleExpand: () => void;
  level: number;
  hasChildren?: boolean;
  children?: React.ReactNode;
  onCategoryCreate?: (parentId: string | null) => void;
  onCategoryEdit?: (category: Category) => void;
  onCategoryDelete?: (category: Category) => void;
};

function CategoryNode({
  category,
  isSelected,
  isExpanded,
  onCategorySelect,
  onToggleExpand,
  hasChildren,
  children,
  onCategoryCreate,
  onCategoryEdit,
  onCategoryDelete,
}: CategoryNodeProps) {
  const totalCount = category ? category.descendantItemCount : 0;
  const directCount = category ? category.itemCount : 0;

  return (
    <div
      className={cn(
        "group flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-accent",
        isSelected && "bg-accent font-medium"
      )}
    >
      {/* Expand/Collapse Button */}
      {hasChildren ? (
        <Button
          className="size-5 shrink-0 p-0"
          onClick={onToggleExpand}
          size="icon"
          variant="ghost"
        >
          {isExpanded ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
        </Button>
      ) : (
        <div className="size-5" />
      )}

      {/* Icon */}
      <div
        className="flex size-5 shrink-0 items-center justify-center rounded"
        style={{
          backgroundColor: category?.color ? `${category.color}15` : undefined,
          color: category?.color || undefined,
        }}
      >
        {isExpanded && hasChildren ? (
          <FolderOpen className="size-4" />
        ) : (
          <Folder className="size-4" />
        )}
      </div>

      {/* Name */}
      <button
        className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm"
        onClick={onCategorySelect}
        type="button"
      >
        <span className="truncate">{children || category?.name}</span>
        {totalCount > 0 && (
          <Badge className="shrink-0" variant="secondary">
            {totalCount}
          </Badge>
        )}
      </button>

      {/* Actions Menu */}
      {category && (onCategoryEdit || onCategoryDelete || onCategoryCreate) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="size-6 shrink-0 opacity-0 group-hover:opacity-100"
              size="icon"
              variant="ghost"
            >
              <MoreVertical className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onCategoryCreate && (
              <DropdownMenuItem onClick={() => onCategoryCreate(category.id)}>
                <Plus className="mr-2 size-4" />
                Add Subcategory
              </DropdownMenuItem>
            )}
            {onCategoryEdit && (
              <DropdownMenuItem onClick={() => onCategoryEdit(category)}>
                <Edit className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onCategoryEdit && <DropdownMenuSeparator />}
            {onCategoryDelete && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onCategoryDelete(category)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
