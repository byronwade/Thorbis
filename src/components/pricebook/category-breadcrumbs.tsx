"use client";

/**
 * Category Breadcrumbs Component
 *
 * Shows navigation path through categories using drill-down system:
 * - Home > HVAC > Heating > Furnaces
 * - Each segment clickable to navigate back via URL
 * - Auto-updates from Zustand navigationPath
 * - Mobile: Collapses to "< Back" + current level
 *
 * Uses Next.js router for navigation to maintain URL consistency
 */

import { ChevronRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { buildCategoryUrl } from "@/lib/pricebook/utils";
import { usePriceBookStore } from "@/lib/stores/pricebook-store";

export function CategoryBreadcrumbs() {
	const router = useRouter();
	const navigationPath = usePriceBookStore((state) => state.navigationPath);

	// Build breadcrumb segments from navigation path
	const segments: Array<{ label: string; onClick?: () => void }> = [
		{
			label: "All Items",
			onClick: () => router.push("/dashboard/work/pricebook"),
		},
	];

	// Add each path segment
	navigationPath.forEach((segment, index) => {
		const isLast = index === navigationPath.length - 1;
		segments.push({
			label: segment,
			onClick: isLast
				? undefined
				: () => {
						// Navigate back to this level using URL
						const targetPath = navigationPath.slice(0, index + 1);
						const url = buildCategoryUrl(targetPath);
						router.push(url);
					},
		});
	});

	// If only one segment (All Items), don't show breadcrumbs
	if (segments.length === 1) {
		return null;
	}

	return (
		<div className="flex items-center gap-2">
			{/* Desktop: Full Breadcrumbs */}
			<Breadcrumb className="hidden md:flex">
				<BreadcrumbList>
					{segments.map((segment, index) => {
						const isLast = index === segments.length - 1;

						return (
							<div className="flex items-center" key={index}>
								{index > 0 && (
									<BreadcrumbSeparator>
										<ChevronRight className="size-4" />
									</BreadcrumbSeparator>
								)}
								<BreadcrumbItem>
									{isLast ? (
										<BreadcrumbPage>{segment.label}</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<button className="hover:underline" onClick={segment.onClick} type="button">
												{index === 0 && <Home className="mr-1 inline size-3" />}
												{segment.label}
											</button>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</div>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>

			{/* Mobile: Back Button + Current */}
			<div className="flex items-center gap-2 md:hidden">
				{segments.length > 1 && (
					<>
						<Button
							onClick={() => {
								// Navigate back one level
								const backPath = navigationPath.slice(0, -1);
								const url = buildCategoryUrl(backPath);
								router.push(url);
							}}
							size="sm"
							variant="ghost"
						>
							← Back
						</Button>
						<span className="font-medium text-sm">{segments.at(-1).label}</span>
					</>
				)}
			</div>
		</div>
	);
}
