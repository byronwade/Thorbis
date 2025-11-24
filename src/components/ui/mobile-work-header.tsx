"use client";

import { Filter, Search, Plus, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * MobileWorkHeader - Feature-rich mobile toolbar for work pages
 *
 * Features:
 * - Quick search
 * - Filter button with active filter count badge
 * - Primary action button (e.g., "New Job")
 * - Additional actions menu
 * - Sticky positioning with safe area support
 * - WCAG-compliant touch targets (44px minimum)
 *
 * Usage:
 * ```tsx
 * <MobileWorkHeader
 *   title="Jobs"
 *   onSearch={(query) => setSearch(query)}
 *   onFilterClick={() => setShowFilter(true)}
 *   activeFilterCount={3}
 *   primaryAction={{
 *     label: "New Job",
 *     href: "/dashboard/work/jobs/new"
 *   }}
 * />
 * ```
 */

type MobileWorkHeaderProps = {
	/** Page title */
	title: string;
	/** Search handler */
	onSearch?: (query: string) => void;
	/** Filter button click handler */
	onFilterClick?: () => void;
	/** Active filter count (shows badge if > 0) */
	activeFilterCount?: number;
	/** Primary action button config */
	primaryAction?: {
		label: string;
		href?: string;
		onClick?: () => void;
		icon?: React.ElementType;
	};
	/** Additional action buttons (shown in overflow menu) */
	additionalActions?: Array<{
		label: string;
		icon: React.ElementType;
		onClick: () => void;
	}>;
	/** Optional subtitle/description */
	subtitle?: string;
	/** Optional className for customization */
	className?: string;
};

export function MobileWorkHeader({
	title,
	onSearch,
	onFilterClick,
	activeFilterCount = 0,
	primaryAction,
	additionalActions = [],
	subtitle,
	className,
}: MobileWorkHeaderProps) {
	const router = useRouter();
	const [showSearch, setShowSearch] = useState(false);
	const [showActions, setShowActions] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		onSearch?.(query);
	};

	const handlePrimaryAction = () => {
		if (primaryAction?.href) {
			router.push(primaryAction.href);
		} else if (primaryAction?.onClick) {
			primaryAction.onClick();
		}
	};

	return (
		<>
			<div className={cn(
				"safe-top sticky top-0 z-35 border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80",
				"md:hidden", // Only show on mobile
				className
			)}>
				{/* Title row */}
				<div className="flex items-center justify-between gap-3 px-4 py-3 border-b">
					<div className="flex-1 min-w-0">
						<h1 className="text-lg font-semibold truncate">{title}</h1>
						{subtitle && (
							<p className="text-xs text-muted-foreground truncate mt-0.5">
								{subtitle}
							</p>
						)}
					</div>

					{/* Primary action */}
					{primaryAction && (
						<Button
							className="h-10 px-4 shrink-0" // 40px touch target
							onClick={handlePrimaryAction}
							size="default"
							variant="default"
						>
							{primaryAction.icon && (
								<primaryAction.icon className="h-4 w-4 mr-2" />
							)}
							{primaryAction.label}
						</Button>
					)}
				</div>

				{/* Action buttons row */}
				<div className="flex items-center gap-2 px-4 py-2.5">
					{/* Search button */}
					{onSearch && (
						<Button
							className="h-10 w-10 p-0" // 40px touch target
							onClick={() => setShowSearch(true)}
							size="icon"
							variant="ghost"
						>
							<Search className="h-5 w-5" />
							<span className="sr-only">Search</span>
						</Button>
					)}

					{/* Filter button with count badge */}
					{onFilterClick && (
						<Button
							className="h-10 w-10 p-0 relative" // 40px touch target
							onClick={onFilterClick}
							size="icon"
							variant="ghost"
						>
							<Filter className="h-5 w-5" />
							{activeFilterCount > 0 && (
								<Badge className="absolute -top-1 -right-1 h-5 min-w-5 p-0 text-[0.6rem]" variant="destructive">
									{activeFilterCount}
								</Badge>
							)}
							<span className="sr-only">Filter</span>
						</Button>
					)}

					{/* Additional actions menu */}
					{additionalActions.length > 0 && (
						<Button
							className="h-10 w-10 p-0" // 40px touch target
							onClick={() => setShowActions(true)}
							size="icon"
							variant="ghost"
						>
							<MoreVertical className="h-5 w-5" />
							<span className="sr-only">More actions</span>
						</Button>
					)}
				</div>
			</div>

			{/* Search Sheet */}
			<Sheet open={showSearch} onOpenChange={setShowSearch}>
				<SheetContent side="top" className="h-[300px]">
					<SheetHeader>
						<SheetTitle>Search {title}</SheetTitle>
					</SheetHeader>
					<div className="mt-6 space-y-4">
						<Input
							autoFocus
							className="h-12" // Larger touch target
							onChange={(e) => handleSearch(e.target.value)}
							placeholder={`Search ${title.toLowerCase()}...`}
							type="search"
							value={searchQuery}
						/>
						{searchQuery && (
							<Button
								className="w-full h-11"
								onClick={() => {
									setSearchQuery("");
									handleSearch("");
									setShowSearch(false);
								}}
								variant="outline"
							>
								Clear Search
							</Button>
						)}
					</div>
				</SheetContent>
			</Sheet>

			{/* Additional Actions Sheet */}
			<Sheet open={showActions} onOpenChange={setShowActions}>
				<SheetContent side="bottom" className="h-auto max-h-[400px]">
					<SheetHeader>
						<SheetTitle>Actions</SheetTitle>
					</SheetHeader>
					<div className="mt-6 space-y-2">
						{additionalActions.map((action, index) => {
							const Icon = action.icon;
							return (
								<Button
									className="w-full h-12 justify-start" // 48px touch target
									key={index}
									onClick={() => {
										action.onClick();
										setShowActions(false);
									}}
									variant="outline"
								>
									<Icon className="h-5 w-5 mr-3" />
									{action.label}
								</Button>
							);
						})}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}
