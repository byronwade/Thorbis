"use client";

/**
 * Job Details Navigation - Client Component
 *
 * Provides navigation for job details widgets using the existing NavGrouped component.
 * Matches the design, structure, and behavior of all other sidebar navigations in the app.
 *
 * Features:
 * - Back button to jobs list
 * - Add Widget dropdown menu (matches PresetReportsDropdown pattern)
 * - Presets dropdown menu for layout presets
 * - Uses existing NavGrouped component for consistency
 * - Dynamic navigation based on visible widgets
 * - Scroll-spy highlighting (via scroll-utils)
 * - Proper anchor links (#widget-id)
 * - Grouped by category (Overview, Financials, Documentation, etc.)
 */

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { NavGrouped } from "@/components/layout/nav-grouped";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AddWidgetDropdown } from "./add-widget-dropdown";
import { PresetsDropdown } from "./presets-dropdown";
import { useWidgetNavigation } from "./use-widget-navigation";

export function JobDetailsNav() {
	// Get navigation groups dynamically from visible widgets
	const navigationGroups = useWidgetNavigation();

	return (
		<>
			{/* Back Button */}
			<SidebarGroup>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/dashboard/work">
								<ArrowLeft />
								<span>Back to Jobs</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>

			{/* Layout Controls */}
			<SidebarGroup>
				<SidebarGroupLabel>Layout</SidebarGroupLabel>
				<AddWidgetDropdown />
				<PresetsDropdown />
			</SidebarGroup>

			{/* Widget Navigation */}
			<NavGrouped groups={navigationGroups} />
		</>
	);
}
