"use client";

import { ChevronRight, type LucideIcon, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import { NavGrouped } from "@/components/layout/nav-grouped";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebarScroll } from "@/hooks/use-sidebar-scroll";

/**
 * Navigation group configuration for communication sidebar
 */
export type CommunicationNavGroup = {
	label: string;
	badge?: number | string; // Badge for the collapsible group header
	collapsible?: boolean; // Whether the group is collapsible
	defaultOpen?: boolean; // Default open state for collapsible groups
	items: Array<{
		title: string;
		url: string;
		icon: LucideIcon;
		badge?: number | string;
		items?: Array<{
			title: string;
			url: string;
			badge?: number | string;
		}>;
	}>;
};

/**
 * Additional section configuration (e.g., Labels, Tags, etc.)
 */
export type CommunicationAdditionalSection = {
	label: string;
	items: Array<{
		title: string;
		icon?: LucideIcon;
		onClick?: () => void;
		url?: string;
		badge?: number | string;
		folderId?: string; // For delete functionality
		onDelete?: (folderId: string) => void; // Delete handler
		items?: Array<{
			title: string;
			url?: string;
			badge?: number | string;
		}>; // Nested sub-items
	}>;
	onAddClick?: () => void;
	addButton?: React.ReactNode; // Custom add button component (e.g., CreateFolderDialog)
	scrollable?: boolean;
	scrollHeight?: string;
	defaultOpen?: boolean; // Whether the section should be open by default
};

/**
 * Primary action button configuration
 */
export type CommunicationPrimaryAction = {
	label: string;
	icon: LucideIcon;
	onClick?: () => void;
	href?: string;
	variant?:
		| "default"
		| "outline"
		| "ghost"
		| "secondary"
		| "destructive"
		| "link";
};

/**
 * Navigation item configuration (for top-level items)
 */
export type CommunicationNavItem = {
	title: string;
	url: string;
	icon: LucideIcon;
	badge?: number | string;
};

/**
 * Communication sidebar configuration
 */
export type CommunicationSidebarConfig = {
	/** Top-level item (e.g., "All Messages") displayed right after primary action */
	topLevelItem?: CommunicationNavItem;
	/** Navigation groups to display */
	navGroups: CommunicationNavGroup[];
	/** Primary action button (e.g., "New email", "New text") */
	primaryAction?: CommunicationPrimaryAction;
	/** Additional sections (e.g., Labels, Tags) */
	additionalSections?: CommunicationAdditionalSection[];
};

export type CommunicationSidebarProps = ComponentProps<typeof Sidebar> & {
	config: CommunicationSidebarConfig;
};

/**
 * CommunicationSidebar - Reusable sidebar layout for all communication pages
 *
 * Provides a consistent layout structure with:
 * - Communication switcher at the top
 * - Primary action button
 * - Navigation groups
 * - Optional additional sections (labels, tags, etc.)
 *
 * @example
 * ```tsx
 * <CommunicationSidebar
 *   config={{
 *     navGroups: [
 *       {
 *         label: "Core",
 *         items: [
 *           { title: "Inbox", url: "/email", icon: Inbox, badge: 42 }
 *         ]
 *       }
 *     ],
 *     primaryAction: {
 *       label: "New email",
 *       icon: Plus,
 *       onClick: () => handleNewEmail()
 *     }
 *   }}
 * />
 * ```
 */
export function CommunicationSidebar({
	config,
	...props
}: CommunicationSidebarProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const scrollRef = useSidebarScroll();
	const { topLevelItem, navGroups, primaryAction, additionalSections } = config;

	// Helper to check if URL matches current pathname + searchParams
	const isUrlActive = (url: string): boolean => {
		const urlObj = new URL(url, "http://localhost");
		const urlPathname = urlObj.pathname;
		const urlSearchParams = urlObj.searchParams;

		// Check pathname match
		if (pathname !== urlPathname) {
			return false;
		}

		// If URL has query params, check if they match
		if (urlSearchParams.toString()) {
			for (const [key, value] of urlSearchParams.entries()) {
				if (searchParams.get(key) !== value) {
					return false;
				}
			}
		}

		return true;
	};

	return (
		<Sidebar collapsible="offcanvas" variant="inset" {...props}>
			<SidebarHeader className="gap-3 px-3 pt-4 md:pt-0 pb-2">
				{primaryAction && (
					<Button
						className="w-full h-11 md:h-9 font-medium text-base md:text-sm"
						variant={primaryAction.variant || "default"}
						type="button"
						onClick={primaryAction.onClick}
						asChild={!!primaryAction.href}
					>
						{primaryAction.href ? (
							<Link href={primaryAction.href}>
								<primaryAction.icon className="size-5 md:size-4" />
								{primaryAction.label}
							</Link>
						) : (
							<>
								<primaryAction.icon className="size-5 md:size-4" />
								{primaryAction.label}
							</>
						)}
					</Button>
				)}
			</SidebarHeader>

			<SidebarContent ref={scrollRef}>
				{/* Navigation Groups */}
				<NavGrouped
					groups={navGroups}
					pathname={pathname ?? undefined}
					searchParams={searchParams}
				/>

				{/* Additional Sections (Labels, Tags, etc.) */}
				{additionalSections?.map((section, index) => (
					<Collapsible
						key={index}
						defaultOpen={section.defaultOpen ?? true}
						className="group/collapsible"
					>
						<SidebarGroup>
							<CollapsibleTrigger asChild>
								<Button
									variant="ghost"
									className="w-full justify-start px-2 h-auto py-1.5 hover:bg-sidebar-accent/50"
									type="button"
								>
									<SidebarGroupLabel className="flex items-center gap-2 w-full">
										<ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										<span className="flex-1 text-left">{section.label}</span>
										{section.addButton ||
											(section.onAddClick && (
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6"
													onClick={(e) => {
														e.stopPropagation();
														section.onAddClick?.();
													}}
													type="button"
												>
													<Plus className="size-4" />
												</Button>
											))}
									</SidebarGroupLabel>
								</Button>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenu>
									{section.scrollable ? (
										<ScrollArea
											className={section.scrollHeight || "h-[200px] w-full"}
										>
											{section.items.map((item, itemIndex) => {
												const isActive = item.url ? isUrlActive(item.url) : false;
												const hasSubItems = item.items && item.items.length > 0;

												return (
													<SidebarMenuItem key={itemIndex}>
														<div className="group/item flex items-center w-full">
															{item.url ? (
																<SidebarMenuButton
																	asChild
																	className="flex-1"
																	isActive={isActive}
																>
																	<Link href={item.url}>
																		{item.icon && (
																			<item.icon className="size-4" />
																		)}
																		<span>{item.title}</span>
																		{item.badge !== undefined && (
																			<SidebarMenuBadge>
																				{typeof item.badge === "number"
																					? item.badge.toLocaleString()
																					: item.badge}
																			</SidebarMenuBadge>
																		)}
																	</Link>
																</SidebarMenuButton>
															) : (
																<SidebarMenuButton
																	onClick={item.onClick}
																	type={item.onClick ? "button" : undefined}
																	className="flex-1"
																>
																	{item.icon && <item.icon className="size-4" />}
																	<span>{item.title}</span>
																	{item.badge !== undefined && item.badge > 0 && (
																		<SidebarMenuBadge>
																			{typeof item.badge === "number"
																				? item.badge.toLocaleString()
																				: item.badge}
																		</SidebarMenuBadge>
																	)}
																</SidebarMenuButton>
															)}
															{item.folderId && item.onDelete && (
																<Button
																	variant="ghost"
																	size="icon"
																	className="h-6 w-6 opacity-0 group-hover/item:opacity-100 transition-opacity ml-auto"
																	onClick={(e) => {
																		e.preventDefault();
																		e.stopPropagation();
																		if (
																			confirm(
																				`Are you sure you want to delete "${item.title}"?`,
																			)
																		) {
																			item.onDelete?.(item.folderId!);
																		}
																	}}
																	title="Delete folder"
																>
																	<Trash2 className="h-3.5 w-3.5 text-destructive" />
																</Button>
															)}
														</div>
														{hasSubItems && (
															<SidebarMenuSub>
																{item.items!.map((subItem, subIndex) => {
																	const isSubActive = subItem.url
																		? isUrlActive(subItem.url)
																		: false;
																	return (
																		<SidebarMenuSubItem key={subIndex}>
																			<SidebarMenuSubButton
																				asChild
																				isActive={isSubActive}
																			>
																				<Link href={subItem.url || "#"}>
																					<span>{subItem.title}</span>
																					{subItem.badge !== undefined &&
																						subItem.badge > 0 && (
																							<SidebarMenuBadge>
																								{typeof subItem.badge ===
																								"number"
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
														)}
													</SidebarMenuItem>
												);
											})}
										</ScrollArea>
									) : (
										section.items.map((item, itemIndex) => {
											const isActive = item.url ? isUrlActive(item.url) : false;
											const hasSubItems = item.items && item.items.length > 0;

											return (
												<SidebarMenuItem key={itemIndex}>
													<div className="group/item flex items-center w-full">
														{item.url ? (
															<SidebarMenuButton
																asChild
																className="flex-1"
																isActive={isActive}
															>
																<Link href={item.url}>
																	{item.icon && <item.icon className="size-4" />}
																	<span>{item.title}</span>
																	{item.badge !== undefined && item.badge > 0 && (
																		<SidebarMenuBadge>
																			{typeof item.badge === "number"
																				? item.badge.toLocaleString()
																				: item.badge}
																		</SidebarMenuBadge>
																	)}
																</Link>
															</SidebarMenuButton>
														) : (
															<SidebarMenuButton
																onClick={item.onClick}
																type={item.onClick ? "button" : undefined}
																className="flex-1"
															>
																{item.icon && <item.icon className="size-4" />}
																<span>{item.title}</span>
																{item.badge !== undefined && (
																	<span className="ml-auto text-xs text-muted-foreground">
																		{item.badge}
																	</span>
																)}
															</SidebarMenuButton>
														)}
														{item.folderId && item.onDelete && (
															<Button
																variant="ghost"
																size="icon"
																className="h-6 w-6 opacity-0 group-hover/item:opacity-100 transition-opacity ml-auto"
																onClick={(e) => {
																	e.preventDefault();
																	e.stopPropagation();
																	if (
																		confirm(
																			`Are you sure you want to delete "${item.title}"?`,
																		)
																	) {
																		item.onDelete?.(item.folderId!);
																	}
																}}
																title="Delete folder"
															>
																<Trash2 className="h-3.5 w-3.5 text-destructive" />
															</Button>
														)}
													</div>
													{hasSubItems && (
														<SidebarMenuSub>
															{item.items!.map((subItem, subIndex) => {
																const isSubActive = subItem.url
																	? isUrlActive(subItem.url)
																	: false;
																return (
																	<SidebarMenuSubItem key={subIndex}>
																		<SidebarMenuSubButton
																			asChild
																			isActive={isSubActive}
																		>
																			<Link href={subItem.url || "#"}>
																				<span>{subItem.title}</span>
																				{subItem.badge !== undefined &&
																					subItem.badge > 0 && (
																						<SidebarMenuBadge>
																							{typeof subItem.badge ===
																							"number"
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
													)}
												</SidebarMenuItem>
											);
										})
									)}
								</SidebarMenu>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
