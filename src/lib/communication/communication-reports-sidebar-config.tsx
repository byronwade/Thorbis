import {
	BarChart3,
	Clock,
	Mail,
	MessageSquare,
	Phone,
	TrendingUp,
	Users,
	Activity,
	PieChart,
	LineChart,
} from "lucide-react";
import type { CommunicationSidebarConfig } from "@/components/communication/communication-sidebar";

/**
 * Get communication reports sidebar configuration
 * Shows different report types users can view
 */
export function getCommunicationReportsSidebarConfig(): CommunicationSidebarConfig {
	return {
		navGroups: [
			{
				label: "Overview",
				items: [
					{
						title: "Dashboard",
						url: "/dashboard/communication",
						icon: BarChart3,
					},
					{
						title: "Activity Summary",
						url: "/dashboard/communication?report=activity",
						icon: Activity,
					},
				],
			},
			{
				label: "Channel Analytics",
				items: [
					{
						title: "Email Analytics",
						url: "/dashboard/communication?report=email",
						icon: Mail,
					},
					{
						title: "SMS Analytics",
						url: "/dashboard/communication?report=sms",
						icon: MessageSquare,
					},
					{
						title: "Call Analytics",
						url: "/dashboard/communication?report=calls",
						icon: Phone,
					},
				],
			},
			{
				label: "Performance Metrics",
				items: [
					{
						title: "Response Times",
						url: "/dashboard/communication?report=response-times",
						icon: Clock,
					},
					{
						title: "Team Performance",
						url: "/dashboard/communication?report=team",
						icon: Users,
					},
					{
						title: "Trends & Growth",
						url: "/dashboard/communication?report=trends",
						icon: TrendingUp,
					},
				],
			},
			{
				label: "Distribution",
				items: [
					{
						title: "Channel Distribution",
						url: "/dashboard/communication?report=distribution",
						icon: PieChart,
					},
					{
						title: "Time Series",
						url: "/dashboard/communication?report=time-series",
						icon: LineChart,
					},
				],
			},
		],
		primaryAction: null, // No primary action for reports
		additionalSections: [],
	};
}







