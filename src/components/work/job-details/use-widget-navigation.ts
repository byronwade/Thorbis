"use client";

/**
 * useWidgetNavigation Hook
 *
 * Generates navigation data structure for job details widgets
 * that matches the existing NavGrouped format used throughout the app.
 *
 * Returns navigation groups in the exact format expected by NavGrouped:
 * - label: Group name (Overview, Financials, etc.)
 * - items: Array of navigation items with title, url (anchor), and icon
 */

import type { LucideIcon } from "lucide-react";
import {
	Activity,
	Building2,
	CircleDollarSign,
	FileText,
	Image,
	MessageSquare,
	Package,
	PieChart,
	Users,
	Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
	type JobWidget,
	type JobWidgetType,
	useJobDetailsLayoutStore,
	WIDGET_METADATA,
} from "@/lib/stores/job-details-layout-store";

// ============================================================================
// Icon Mapping
// ============================================================================

const WIDGET_ICONS: Record<JobWidgetType, LucideIcon> = {
	"job-financials": CircleDollarSign,
	"customer-info": Users,
	"job-details": FileText,
	"property-enrichment": Building2,
	"property-details": Building2,
	photos: Image,
	invoices: CircleDollarSign,
	estimates: FileText,
	"job-costing": PieChart,
	profitability: PieChart,
	communications: MessageSquare,
	documents: FileText,
	schedule: Activity,
	"time-tracking": Activity,
	"team-assignments": Users,
	"materials-list": Package,
	"equipment-list": Wrench,
	"activity-log": Activity,
	"location-map": Building2,
	"purchase-orders": Package,
	"hvac-equipment": Wrench,
	"job-header": FileText,
	"payment-tracker": CircleDollarSign,
	permits: FileText,
	"plumbing-fixtures": Wrench,
	"electrical-panels": Wrench,
	"roofing-materials": Package,
	"landscape-zones": Building2,
	"labor-hours": Activity,
	"material-costs": Package,
	"change-orders": FileText,
};

// ============================================================================
// Navigation Group Type (matches NavGrouped expectations)
// ============================================================================

type NavItem = {
	title: string;
	url: string;
	icon?: LucideIcon;
};

type NavGroup = {
	label?: string;
	items: NavItem[];
};

// ============================================================================
// Hook
// ============================================================================

export function useWidgetNavigation(): NavGroup[] {
	// Track if we're on the client to avoid SSR hydration issues
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	// Get visible widgets from store with stable reference
	const allWidgets = useJobDetailsLayoutStore((state) => state.widgets);

	// Filter visible widgets in useMemo to maintain stable reference
	const visibleWidgets = useMemo(
		() => (isClient ? allWidgets.filter((w) => w.isVisible) : []),
		[allWidgets, isClient]
	);

	// Generate navigation groups dynamically based on visible widgets
	const navigationGroups = useMemo(() => {
		// Category labels for display
		const categoryLabels: Record<string, string> = {
			core: "Overview",
			financial: "Financials",
			project: "Project Management",
			documentation: "Documentation",
			analytics: "Analytics",
			industry: "Industry-Specific",
		};

		// Group widgets by category
		const widgetsByCategory: Record<string, JobWidget[]> = {};

		for (const widget of visibleWidgets) {
			const metadata = WIDGET_METADATA[widget.type];
			const category = metadata?.category || "core";

			if (!widgetsByCategory[category]) {
				widgetsByCategory[category] = [];
			}

			widgetsByCategory[category].push(widget);
		}

		// Convert to NavGrouped format
		const groups: NavGroup[] = [];

		// Note: Back button is provided by app-sidebar.tsx static navigation
		// No need to add it here as it would create a duplicate

		// Add widget navigation groups
		for (const [category, widgets] of Object.entries(widgetsByCategory)) {
			if (widgets.length === 0) {
				continue;
			}

			groups.push({
				label: categoryLabels[category] || category,
				items: widgets.map((widget) => ({
					title: widget.title,
					url: `#widget-${widget.id}`,
					icon: WIDGET_ICONS[widget.type] || FileText,
				})),
			});
		}

		return groups;
	}, [visibleWidgets]);

	return navigationGroups;
}
