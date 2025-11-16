"use client";

/**
 * Price Book Tree Sidebar Component
 *
 * Shows category hierarchy as a collapsible tree:
 * - Full category structure up to 5 levels deep
 * - Only shows categories (folders), not individual items
 * - Current location highlighted
 * - Click any category to navigate and see its items/subcategories
 * - Auto-expand to show current path
 * - Items are displayed in main content area (cards/table), not in tree
 */

import { ArrowLeft, ChevronRight, Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarRail,
} from "@/components/ui/sidebar";
import { getCategoryTreeClient } from "@/lib/pricebook/category-tree-client";
import { buildCategoryUrl } from "@/lib/pricebook/utils";
import { usePriceBookStore } from "@/lib/stores/pricebook-store";
import { cn } from "@/lib/utils";
import type { CategoryNode } from "./drill-down-view";

// TreeNode props type

type TreeNodeProps = {
	node: CategoryNode;
	parentPath: string[];
	depth?: number;
};

const MAX_TREE_DEPTH = 5;

function TreeNode({ node, parentPath, depth = 0 }: TreeNodeProps) {
	const router = useRouter();
	const navigationPath = usePriceBookStore((state) => state.navigationPath);

	const currentPath = [...parentPath, node.name];

	// Check if this node or any of its descendants is in the current path
	const isInPath = navigationPath.some((_segment, index) => {
		const checkPath = navigationPath.slice(0, index + 1);
		return checkPath.join(" > ").startsWith(currentPath.join(" > "));
	});

	const isActive =
		navigationPath.length === currentPath.length &&
		navigationPath.every((segment, index) => segment === currentPath[index]);

	const hasChildren = node.children && node.children.length > 0;
	const canShowChildren = hasChildren && depth < MAX_TREE_DEPTH;

	const handleClick = () => {
		// Navigate using Next.js router - this will update URL and trigger state sync
		const url = buildCategoryUrl(currentPath);
		router.push(url);
	};

	// Calculate left padding based on depth using inline style
	const indentStyle =
		depth > 0 ? { paddingLeft: `${depth * 1.5 + 0.5}rem` } : undefined;

	// Leaf node (no children) or max depth reached - show as simple folder button
	// Items will be shown in main content area, not in tree
	if (!canShowChildren) {
		return (
			<SidebarMenuItem>
				<SidebarMenuButton
					className={cn(
						"pr-8",
						isActive && "bg-primary/10 font-medium text-primary",
					)}
					isActive={isActive}
					onClick={handleClick}
					style={indentStyle}
					tooltip={{
						children: (
							<>
								<p className="font-medium">{node.name}</p>
								<p className="text-muted-foreground text-xs">
									{node.count} items
								</p>
							</>
						),
					}}
				>
					<Folder className="size-4 shrink-0" />
					{node.name}
				</SidebarMenuButton>
				<SidebarMenuBadge>{node.count}</SidebarMenuBadge>
			</SidebarMenuItem>
		);
	}

	// Parent node (has children and under depth limit)
	return (
		<SidebarMenuItem>
			<Collapsible
				className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
				defaultOpen={isInPath}
			>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton
						className={cn(
							"pr-8",
							isActive && "bg-primary/10 font-medium text-primary",
						)}
						isActive={isActive}
						onClick={handleClick}
						style={indentStyle}
						tooltip={{
							children: (
								<>
									<p className="font-medium">{node.name}</p>
									<p className="text-muted-foreground text-xs">
										{node.count} items
									</p>
								</>
							),
						}}
					>
						<ChevronRight className="shrink-0 transition-transform" />
						<Folder className="size-4 shrink-0" />
						{node.name}
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<SidebarMenuBadge>{node.count}</SidebarMenuBadge>
				<CollapsibleContent>
					<SidebarMenuSub className="mx-0 px-0">
						{node.children?.map((child) => (
							<TreeNode
								depth={depth + 1}
								key={child.name}
								node={child}
								parentPath={currentPath}
							/>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	);
}

type PriceBookTreeSidebarProps = React.ComponentProps<typeof Sidebar>;

export function PriceBookTreeSidebar(props: PriceBookTreeSidebarProps) {
	const router = useRouter();
	const navigationPath = usePriceBookStore((state) => state.navigationPath);
	const isAtRoot = navigationPath.length === 0;

	const [categories, setCategories] = useState<CategoryNode[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch categories on mount
	useEffect(() => {
		async function loadCategories() {
			try {
				setIsLoading(true);
				const tree = await getCategoryTreeClient();
				setCategories(tree);
			} catch (_error) {
			} finally {
				setIsLoading(false);
			}
		}

		loadCategories();
	}, []);

	const handleRootClick = () => {
		router.push("/dashboard/work/pricebook");
	};

	const handleBackClick = () => {
		router.push("/dashboard/work");
	};

	return (
		<Sidebar collapsible="offcanvas" variant="inset" {...props}>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									onClick={handleBackClick}
									tooltip="Return to Work"
									type="button"
								>
									<ArrowLeft className="size-4 shrink-0" />
									Back to Work
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Categories</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{/* All Items */}
							<SidebarMenuItem>
								<SidebarMenuButton
									className={cn(
										isAtRoot && "bg-primary/10 font-medium text-primary",
									)}
									isActive={isAtRoot}
									onClick={handleRootClick}
									tooltip="Browse all categories"
								>
									<Folder className="size-4 shrink-0" />
									All Items
								</SidebarMenuButton>
							</SidebarMenuItem>

							{/* Category Tree - Max 5 levels deep */}
							{isLoading ? (
								// Loading skeleton
								<div className="space-y-2 px-2 py-2">
									{[...new Array(3)].map((_, i) => (
										<div
											className="h-8 animate-pulse rounded bg-muted"
											key={i}
										/>
									))}
								</div>
							) : (
								categories.map((category) => (
									<TreeNode
										depth={0}
										key={category.name}
										node={category}
										parentPath={[]}
									/>
								))
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
