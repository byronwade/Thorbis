import type { LucideIcon } from "lucide-react";
import { NavGrouped } from "@/components/layout/nav-grouped";

/**
 * NavMain - Simplified navigation for single-group layouts
 *
 * Uses NavGrouped internally with a single group (no label).
 * This maintains backward compatibility while using the unified system.
 */
export function NavMain({
	items,
	pathname = "/dashboard",
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
	pathname?: string;
}) {
	// Convert NavMain items format to NavGrouped format
	const groups = [
		{
			// No label - single group without header
			items: items.map((item) => ({
				title: item.title,
				url: item.url,
				icon: item.icon,
				items: item.items?.map((subItem) => ({
					title: subItem.title,
					url: subItem.url,
				})),
			})),
		},
	];

	return <NavGrouped groups={groups} pathname={pathname} />;
}
