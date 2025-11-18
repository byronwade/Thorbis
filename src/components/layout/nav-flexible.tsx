"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type {
	FilterSidebarItem,
	LinkSidebarItem,
	SidebarConfig,
	SidebarGroup as SidebarGroupType,
	SidebarItem,
	TabSidebarItem,
} from "@/lib/sidebar/types";

type NavFlexibleProps = {
	config?: SidebarConfig;
	groups?: SidebarGroupType[];
	items?: SidebarItem[];
};

export function NavFlexible({ config, groups, items }: NavFlexibleProps) {
	const pathname = usePathname();
	const activeValue = config?.activeValue;
	const setActiveValue = config?.onValueChange;

	// If items are provided directly, wrap them in a single group
	const normalizedGroups = groups || (items ? [{ items }] : []);

	const renderItem = (item: SidebarItem) => {
		// Link mode - traditional navigation
		if (item.mode === "link") {
			const linkItem = item as LinkSidebarItem;
			const isActive = pathname === linkItem.url;

			// If has sub-items, render as collapsible
			if (linkItem.items && linkItem.items.length > 0) {
				return (
					<Collapsible
						asChild
						className="group/collapsible"
						defaultOpen={isActive}
						key={linkItem.url}
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={linkItem.title}>
									{linkItem.icon && <linkItem.icon />}
									<span>{linkItem.title}</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{linkItem.items.map((subItem) => {
										const isSubActive = pathname === subItem.url;
										return (
											<SidebarMenuSubItem key={subItem.url}>
												<SidebarMenuSubButton asChild isActive={isSubActive}>
													<Link href={subItem.url}>
														<span>{subItem.title}</span>
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

			// Regular link item
			return (
				<SidebarMenuItem key={linkItem.url}>
					<SidebarMenuButton
						asChild
						isActive={isActive}
						tooltip={linkItem.title}
					>
						<Link href={linkItem.url}>
							{linkItem.icon && <linkItem.icon />}
							<span>{linkItem.title}</span>
							{linkItem.badge && (
								<span className="bg-primary text-primary-foreground ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium">
									{linkItem.badge}
								</span>
							)}
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			);
		}

		// Tab mode - view switching
		if (item.mode === "tab") {
			const tabItem = item as TabSidebarItem;
			const isActive =
				activeValue === tabItem.value ||
				(activeValue === undefined && config?.defaultValue === tabItem.value);

			return (
				<SidebarMenuItem key={tabItem.value}>
					<SidebarMenuButton
						isActive={isActive}
						onClick={() => setActiveValue?.(tabItem.value)}
						tooltip={tabItem.title}
					>
						{tabItem.icon && <tabItem.icon />}
						<span>{tabItem.title}</span>
						{tabItem.badge && (
							<span className="bg-primary text-primary-foreground ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium">
								{tabItem.badge}
							</span>
						)}
					</SidebarMenuButton>
				</SidebarMenuItem>
			);
		}

		// Filter mode - data filtering
		if (item.mode === "filter") {
			const filterItem = item as FilterSidebarItem;
			const isActive =
				activeValue === filterItem.value ||
				(activeValue === undefined &&
					config?.defaultValue === filterItem.value);

			return (
				<SidebarMenuItem key={filterItem.value}>
					<SidebarMenuButton
						isActive={isActive}
						onClick={() => setActiveValue?.(filterItem.value)}
						tooltip={filterItem.title}
					>
						{filterItem.icon && <filterItem.icon />}
						<span>{filterItem.title}</span>
						{filterItem.count !== undefined && (
							<span className="text-muted-foreground ml-auto text-xs">
								{filterItem.count}
							</span>
						)}
					</SidebarMenuButton>
				</SidebarMenuItem>
			);
		}

		return null;
	};

	return (
		<>
			{normalizedGroups.map((group, index) => (
				<SidebarGroup key={group.label || `group-${index}`}>
					{group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
					<SidebarMenu>{group.items.map(renderItem)}</SidebarMenu>
				</SidebarGroup>
			))}
		</>
	);
}
