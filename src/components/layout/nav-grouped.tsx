import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavItem = {
	title: string;
	url: string;
	icon?: LucideIcon;
	highlight?: "yellow";
	badge?: number | string;
	onClick?: () => void;
	items?: {
		title: string;
		url: string;
	}[];
};

type NavGroup = {
	label?: string;
	items: NavItem[];
};

export function NavGrouped({
	groups,
	pathname = "/dashboard",
	className,
}: {
	groups: NavGroup[];
	pathname?: string;
	className?: string;
}) {
	const safePathname = pathname || "/dashboard";

	// Guard against undefined or null groups
	if (!Array.isArray(groups)) {
		return null;
	}

	// Known work subpaths that should NOT mark Jobs (/dashboard/work) as active
	const workSubpaths = [
		"/team",
		"/invoices",
		"/estimates",
		"/contracts",
		"/appointments",
		"/payments",
		"/purchase-orders",
		"/maintenance-plans",
		"/service-agreements",
		"/materials",
		"/equipment",
		"/pricebook",
		"/schedule",
	];

	return (
		<>
			{groups.map((group, groupIndex) => {
				// Skip groups without items array
				if (!Array.isArray(group?.items)) {
					return null;
				}

				return (
					<SidebarGroup key={`${group.label || "group"}-${groupIndex}`} className={className}>
						{group.label && (
							<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
						)}
						<SidebarMenu>
							{group.items.map((item) => {
								// Check if current path matches this item or its detail pages
								const isExactMatch = safePathname === item.url;

								// Special handling for Jobs (/dashboard/work) to exclude known work subpaths
								let isDetailPage = safePathname.startsWith(`${item.url}/`);
								if (item.url === "/dashboard/work" && isDetailPage) {
									// Check if pathname matches any known work subpath
									const pathAfterWork = safePathname.replace(
										"/dashboard/work",
										"",
									);
									const isKnownSubpath = workSubpaths.some((subpath) =>
										pathAfterWork.startsWith(subpath),
									);
									if (isKnownSubpath) {
										isDetailPage = false; // Don't mark Jobs as active for known subpaths
									}
								}

								const hasActiveSubItem = item.items?.some(
									(subItem) => safePathname === subItem.url,
								);
								const isActive =
									isExactMatch || isDetailPage || hasActiveSubItem;

								// If item has sub-items, render parent + children (always open, no chevron)
								if (item.items && item.items.length > 0) {
									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild
												isActive={isActive && safePathname === item.url}
												tooltip={item.title}
											>
												<Link href={item.url}>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
											<SidebarMenuSub>
												{item.items.map((subItem) => {
													const isSubActive =
														safePathname === subItem.url ||
														safePathname.startsWith(`${subItem.url}/`);
													return (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton
																asChild
																isActive={isSubActive}
															>
																<Link href={subItem.url}>
																	<span>{subItem.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													);
												})}
											</SidebarMenuSub>
										</SidebarMenuItem>
									);
								}

								// Regular menu item without sub-items
								const isAnchorLink = item.url.startsWith("#");
								const highlightClass =
									item.highlight === "yellow"
										? "ring-2 ring-yellow-500/50 hover:ring-yellow-500/70 dark:ring-yellow-500/50 dark:hover:ring-yellow-500/70"
										: "";

								// If onClick is provided, use button instead of Link
								if (item.onClick) {
									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												className={highlightClass}
												isActive={isActive}
												onClick={item.onClick}
												tooltip={item.title}
											>
												{item.icon && <item.icon />}
												<span>{item.title}</span>
											</SidebarMenuButton>
											{item.badge !== undefined && (
												<SidebarMenuBadge>
													{typeof item.badge === "number"
														? item.badge.toLocaleString()
														: item.badge}
												</SidebarMenuBadge>
											)}
										</SidebarMenuItem>
									);
								}

								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											className={highlightClass}
											isActive={isActive}
											tooltip={item.title}
										>
											{isAnchorLink ? (
												<a href={item.url}>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
												</a>
											) : (
												<Link href={item.url}>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
												</Link>
											)}
										</SidebarMenuButton>
										{item.badge !== undefined && (
											<SidebarMenuBadge>
												{typeof item.badge === "number"
													? item.badge.toLocaleString()
													: item.badge}
											</SidebarMenuBadge>
										)}
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroup>
				);
			})}
		</>
	);
}
