import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
		badge?: number | string;
	}[];
};

type NavGroup = {
	label?: string;
	items: NavItem[];
};

export function NavGrouped({
	groups,
	pathname = "/dashboard",
	searchParams,
	className,
}: {
	groups: NavGroup[];
	pathname?: string;
	searchParams?: URLSearchParams;
	className?: string;
}) {
	const router = useRouter();
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
					<SidebarGroup
						key={`${group.label || "group"}-${groupIndex}`}
						className={className}
					>
						{group.label && (
							<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
						)}
						<SidebarMenu>
							{group.items.map((item) => {
								// Extract pathname and query params from item.url
								const itemUrl = new URL(item.url, "http://localhost");
								const itemPathname = itemUrl.pathname;
								const itemSearchParams = itemUrl.searchParams;

								// Check if pathname matches
								const pathnameMatches = safePathname === itemPathname;

								// Check if query params match (if item has query params)
								let queryParamsMatch = true;
								if (itemSearchParams.toString() && searchParams) {
									for (const [key, value] of itemSearchParams.entries()) {
										if (searchParams.get(key) !== value) {
											queryParamsMatch = false;
											break;
										}
									}
								} else if (itemSearchParams.toString() && !searchParams) {
									// Item has query params but current page doesn't
									queryParamsMatch = false;
								}

								// Check if current path matches this item or its detail pages
								const isExactMatch = pathnameMatches && queryParamsMatch;

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
									(subItem) => {
										const subItemUrl = new URL(subItem.url, "http://localhost");
										const subItemPathname = subItemUrl.pathname;
										const subItemSearchParams = subItemUrl.searchParams;
										
										// Check pathname match
										if (safePathname !== subItemPathname) {
											return false;
										}
										
										// Check query params match
										if (subItemSearchParams.toString() && searchParams) {
											for (const [key, value] of subItemSearchParams.entries()) {
												if (searchParams.get(key) !== value) {
													return false;
												}
											}
										} else if (subItemSearchParams.toString() && !searchParams) {
											return false;
										}
										
										return true;
									}
								);
								const isActive =
									isExactMatch || isDetailPage || hasActiveSubItem;

								// If item has sub-items, render as collapsible
								if (item.items && item.items.length > 0) {
									return (
										<Collapsible
											key={item.title}
											defaultOpen={hasActiveSubItem}
											className="group/collapsible"
										>
											<SidebarMenuItem>
												<div className="flex items-center w-full relative group/item">
													<SidebarMenuButton
														asChild
														isActive={isActive && safePathname === item.url}
														tooltip={item.title}
														className={cn(
															"flex-1 relative",
															item.badge !== undefined ? "pr-10" : "pr-8"
														)}
													>
														<Link href={item.url} className="flex items-center w-full">
															{item.icon && <item.icon className="shrink-0" />}
															<span className="flex-1 min-w-0 truncate">{item.title}</span>
															{item.badge !== undefined && (
																<SidebarMenuBadge>
																	{typeof item.badge === "number"
																		? item.badge.toLocaleString()
																		: item.badge}
																</SidebarMenuBadge>
															)}
														</Link>
													</SidebarMenuButton>
													<CollapsibleTrigger asChild>
														<SidebarMenuButton
															variant="ghost"
															size="icon"
															className={cn(
																"h-8 w-6 shrink-0 absolute",
																item.badge !== undefined ? "right-10" : "right-2"
															)}
															type="button"
															aria-label="Toggle submenu"
														>
															<ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
														</SidebarMenuButton>
													</CollapsibleTrigger>
												</div>
												<CollapsibleContent>
													<SidebarMenuSub>
														{item.items.map((subItem) => {
															const subItemUrl = new URL(subItem.url, "http://localhost");
															const subItemPathname = subItemUrl.pathname;
															const subItemSearchParams = subItemUrl.searchParams;
															
															// Check if pathname matches
															const subPathnameMatches = safePathname === subItemPathname;
															
															// Check if query params match
															let subQueryParamsMatch = true;
															if (subItemSearchParams.toString() && searchParams) {
																for (const [key, value] of subItemSearchParams.entries()) {
																	if (searchParams.get(key) !== value) {
																		subQueryParamsMatch = false;
																		break;
																	}
																}
															} else if (subItemSearchParams.toString() && !searchParams) {
																subQueryParamsMatch = false;
															}
															
															const isSubActive = subPathnameMatches && subQueryParamsMatch;
															
															return (
																<SidebarMenuSubItem key={subItem.title}>
																	<SidebarMenuSubButton
																		asChild
																		isActive={isSubActive}
																	>
																		<Link href={subItem.url}>
																			<span>{subItem.title}</span>
																			{subItem.badge !== undefined && subItem.badge > 0 && (
																				<SidebarMenuBadge>
																					{typeof subItem.badge === "number"
																						? subItem.badge.toLocaleString()
																						: subItem.badge}
																				</SidebarMenuBadge>
																			)}
																		</Link>
																	</SidebarMenuSubButton>
																</SidebarMenuSubItem>
															);
														})}
													</SidebarMenuSub>
												</CollapsibleContent>
											</SidebarMenuItem>
										</Collapsible>
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
