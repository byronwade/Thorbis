import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

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
	const safePathname = pathname || "/dashboard";

	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => {
					// Check if current path matches this item or its detail pages
					const isExactMatch = safePathname === item.url;
					const isDetailPage = safePathname.startsWith(`${item.url}/`);
					const hasActiveSubItem = item.items?.some(
						(subItem) => safePathname === subItem.url || safePathname.startsWith(`${subItem.url}/`)
					);
					const isActive = isExactMatch || isDetailPage || hasActiveSubItem;

					// If item has sub-items, render parent + children
					if (item.items && item.items.length > 0) {
						return (
							<Collapsible asChild defaultOpen={true} key={item.title} open={true}>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton
											isActive={isActive && safePathname === item.url}
											tooltip={item.title}
										>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items.map((subItem) => {
												const isSubActive =
													safePathname === subItem.url ||
													safePathname.startsWith(`${subItem.url}/`);
												return (
													<SidebarMenuSubItem key={subItem.title}>
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

					// Regular menu item without sub-items
					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
								<Link href={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
