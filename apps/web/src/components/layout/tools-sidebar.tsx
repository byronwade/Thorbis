"use client";

/**
 * Tools Sidebar Navigation - Client Component
 *
 * Uses unified NavGrouped component for consistent design and behavior.
 */

import { NavGrouped } from "@/components/layout/nav-grouped";

const sidebarGroups = [
	{
		label: "Sections",
		items: [
			{ title: "Overview", url: "/tools" },
			{ title: "Marketing", url: "/tools/marketing" },
			{ title: "Business Setup", url: "/tools/business" },
			{ title: "Financing", url: "/tools/financing" },
			{ title: "Networks", url: "/tools/networks" },
			{ title: "Training", url: "/tools/training" },
			{ title: "Calculators", url: "/tools/calculators" },
		],
	},
	{
		label: "Marketing & Social Media",
		items: [
			{
				title: "Google Business Profile",
				url: "/tools/marketing/google-business",
				badge: "Essential",
			},
			{
				title: "Local Services Ads",
				url: "/tools/marketing/local-services",
				badge: "Recommended",
			},
			{ title: "Facebook Business", url: "/tools/marketing/facebook" },
			{ title: "Instagram", url: "/tools/marketing/instagram" },
			{ title: "X (Twitter)", url: "/tools/marketing/twitter" },
			{ title: "LinkedIn", url: "/tools/marketing/linkedin" },
		],
	},
	{
		label: "Business Setup & Legal",
		items: [
			{
				title: "Business Registration",
				url: "/tools/business/registration",
				badge: "Required",
			},
			{
				title: "Licensing & Permits",
				url: "/tools/business/licensing",
				badge: "Required",
			},
			{
				title: "Business Insurance",
				url: "/tools/business/insurance",
				badge: "Essential",
			},
			{ title: "Banking & Payroll", url: "/tools/business/banking" },
			{ title: "Legal Resources", url: "/tools/business/legal" },
		],
	},
	{
		label: "Financing & Payments",
		items: [
			{
				title: "Consumer Financing",
				url: "/tools/financing/consumer",
				badge: "Popular",
			},
			{ title: "Business Loans", url: "/tools/financing/business-loans" },
			{ title: "Equipment Financing", url: "/tools/financing/equipment" },
			{ title: "Credit Card Processing", url: "/tools/financing/credit-card" },
		],
	},
	{
		label: "Networks & Associations",
		items: [
			{
				title: "Nexstar Network",
				url: "/tools/networks/nexstar",
				badge: "Premium",
			},
			{
				title: "Service Nation",
				url: "/tools/networks/service-nation",
				badge: "Premium",
			},
			{ title: "ACCA", url: "/tools/networks/acca" },
			{ title: "PHCC", url: "/tools/networks/phcc" },
			{ title: "NECA", url: "/tools/networks/neca" },
		],
	},
	{
		label: "Training & Certification",
		items: [
			{ title: "Trade Certifications", url: "/tools/training/certifications" },
			{
				title: "OSHA Safety Training",
				url: "/tools/training/osha",
				badge: "Required",
			},
			{ title: "EPA Certifications", url: "/tools/training/epa" },
			{ title: "Business Management", url: "/tools/training/business" },
		],
	},
	{
		label: "Business Calculators",
		items: [
			{
				title: "Hourly Rate Calculator",
				url: "/tools/calculators/hourly-rate",
				badge: "Popular",
			},
			{
				title: "Job Pricing Calculator",
				url: "/tools/calculators/job-pricing",
				badge: "Essential",
			},
			{
				title: "Profit & Loss Calculator",
				url: "/tools/calculators/profit-loss",
				badge: "Popular",
			},
			{ title: "Commission Calculator", url: "/tools/calculators/commission" },
			{ title: "Break-Even Calculator", url: "/tools/calculators/break-even" },
			{
				title: "Industry Pricing Standards",
				url: "/tools/calculators/industry-pricing",
				badge: "Premium",
			},
		],
	},
	{
		label: "Resources",
		items: [
			{ title: "Industry News", url: "/tools/resources/news" },
			{ title: "Vendor Directories", url: "/tools/resources/vendors" },
			{ title: "Emergency Services", url: "/tools/resources/emergency" },
		],
	},
];

export function ToolsSidebar() {
	return <NavGrouped groups={sidebarGroups} />;
}
