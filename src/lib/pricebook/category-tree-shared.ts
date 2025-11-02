/**
 * Shared Category Tree Utilities
 *
 * Pure utility functions for building and navigating category trees.
 * Can be imported by both server and client code.
 */

import type { CategoryNode } from "@/components/pricebook/drill-down-view";

export type DatabaseCategory = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  path: string;
  level: number;
  sort_order: number;
  item_count: number;
  descendant_item_count: number;
};

/**
 * Build hierarchical category tree from flat list
 */
export function buildCategoryTree(
  categories: DatabaseCategory[]
): CategoryNode[] {
  // Create a map for quick lookup
  const categoryMap = new Map<
    string,
    CategoryNode & { parent_id: string | null }
  >();

  // First pass: Create all nodes
  categories.forEach((cat) => {
    categoryMap.set(cat.id, {
      name: cat.name,
      count: cat.descendant_item_count, // Use descendant count for tree display
      imageUrl: undefined, // Could be added to schema later
      children: [],
      parent_id: cat.parent_id,
    });
  });

  // Second pass: Build tree structure
  const rootNodes: CategoryNode[] = [];

  categoryMap.forEach((node, id) => {
    if (node.parent_id === null) {
      // Root level category
      const { parent_id, ...cleanNode } = node;
      rootNodes.push(cleanNode);
    } else {
      // Child category - add to parent's children
      const parent = categoryMap.get(node.parent_id);
      if (parent && parent.children) {
        const { parent_id, ...cleanNode } = node;
        parent.children.push(cleanNode);
      }
    }
  });

  return rootNodes;
}

/**
 * Get categories at a specific path level
 * Example: ["HVAC", "Heating"] returns children of HVAC > Heating
 */
export function getCategoriesAtPath(
  tree: CategoryNode[],
  path: string[]
): CategoryNode[] {
  let current = tree;

  for (const segment of path) {
    const found = current.find((cat) => cat.name === segment);
    if (!(found && found.children)) {
      return [];
    }
    current = found.children;
  }

  return current;
}
