"use client";

import { CommunicationSwitcher } from "@/components/communication/communication-switcher";
import { NavGrouped } from "@/components/layout/nav-grouped";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { LucideIcon, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

/**
 * Navigation group configuration for communication sidebar
 */
export type CommunicationNavGroup = {
    label: string;
    items: Array<{
        title: string;
        url: string;
        icon: LucideIcon;
        badge?: number | string;
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
    }>;
    onAddClick?: () => void;
    scrollable?: boolean;
    scrollHeight?: string;
};

/**
 * Primary action button configuration
 */
export type CommunicationPrimaryAction = {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    href?: string;
    variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
};

/**
 * Communication sidebar configuration
 */
export type CommunicationSidebarConfig = {
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
    const { navGroups, primaryAction, additionalSections } = config;

    return (
        <Sidebar collapsible="offcanvas" variant="inset" {...props}>
            <SidebarHeader className="gap-3 px-3 pt-0 pb-2">
                <CommunicationSwitcher />
                {primaryAction && (
                    <Button
                        className="w-full h-9 font-medium"
                        variant={primaryAction.variant || "default"}
                        type="button"
                        onClick={primaryAction.onClick}
                        asChild={!!primaryAction.href}
                    >
                        {primaryAction.href ? (
                            <Link href={primaryAction.href}>
                                <primaryAction.icon className="size-4" />
                                {primaryAction.label}
                            </Link>
                        ) : (
                            <>
                                <primaryAction.icon className="size-4" />
                                {primaryAction.label}
                            </>
                        )}
                    </Button>
                )}
            </SidebarHeader>

            <SidebarContent>
                {/* Navigation Groups */}
                <NavGrouped groups={navGroups} pathname={pathname ?? undefined} />

                {/* Additional Sections (Labels, Tags, etc.) */}
                {additionalSections?.map((section, index) => (
                    <SidebarGroup key={index}>
                        <div className="flex items-center justify-between px-2">
                            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                            {section.onAddClick && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={section.onAddClick}
                                    type="button"
                                >
                                    <Plus className="size-4" />
                                </Button>
                            )}
                        </div>
                        <SidebarMenu>
                            {section.scrollable ? (
                                <ScrollArea
                                    className={section.scrollHeight || "h-[200px] w-full"}
                                >
                                    {section.items.map((item, itemIndex) => (
                                        <SidebarMenuItem key={itemIndex}>
                                            <SidebarMenuButton
                                                onClick={item.onClick}
                                                type={item.onClick ? "button" : undefined}
                                            >
                                                {item.icon && <item.icon className="size-4" />}
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </ScrollArea>
                            ) : (
                                section.items.map((item, itemIndex) => (
                                    <SidebarMenuItem key={itemIndex}>
                                        <SidebarMenuButton
                                            onClick={item.onClick}
                                            type={item.onClick ? "button" : undefined}
                                        >
                                            {item.icon && <item.icon className="size-4" />}
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}

