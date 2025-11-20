import {
	Bell,
	Code,
	Database,
	Mail,
	MessageSquare,
	Phone,
	Settings,
	TestTube,
	Webhook,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface DevFeature {
	title: string;
	description: string;
	href: string;
	icon: React.ReactNode;
	status: "complete" | "partial" | "planned";
	badge?: string;
}

const DEV_FEATURES: DevFeature[] = [
	{
		title: "Notification Testing",
		description:
			"Test and monitor all notification types across email, SMS, in-app, and push channels. Preview templates, send test notifications, and track delivery status.",
		href: "/dashboard/settings/notifications/testing",
		icon: <Bell className="h-5 w-5" />,
		status: "complete",
		badge: "NEW",
	},
	{
		title: "Telnyx Configuration",
		description:
			"Configure and test Telnyx SMS and voice services. Verify 10DLC registration, check phone numbers, and validate webhook setup.",
		href: "/dashboard/settings/telnyx-verification",
		icon: <Phone className="h-5 w-5" />,
		status: "complete",
	},
	{
		title: "10DLC Registration Testing",
		description:
			"Test and debug 10DLC (A2P) registration for SMS messaging. Submit brand and campaign verification to Telnyx.",
		href: "/test-10dlc-register",
		icon: <MessageSquare className="h-5 w-5" />,
		status: "complete",
	},
	{
		title: "Telnyx Setup Wizard",
		description:
			"Step-by-step wizard for configuring Telnyx phone numbers, messaging profiles, and webhooks.",
		href: "/test-telnyx-setup",
		icon: <Settings className="h-5 w-5" />,
		status: "complete",
	},
	{
		title: "Telnyx Configuration Test",
		description:
			"Comprehensive testing interface for Telnyx settings. Check API keys, phone numbers, and messaging profiles.",
		href: "/test-telnyx-config",
		icon: <Code className="h-5 w-5" />,
		status: "complete",
	},
	{
		title: "Telnyx Diagnostics",
		description:
			"Debug Telnyx integration issues. View API status, webhook logs, and message delivery reports.",
		href: "/test-telnyx-debug",
		icon: <TestTube className="h-5 w-5" />,
		status: "complete",
	},
	{
		title: "Telnyx Status Monitor",
		description:
			"Real-time monitoring of Telnyx service status. Check connectivity, API health, and webhook delivery.",
		href: "/test-telnyx-status",
		icon: <Database className="h-5 w-5" />,
		status: "complete",
	},
	{
		title: "Send Test SMS",
		description:
			"Send test SMS messages through Telnyx. Verify message delivery and check delivery receipts.",
		href: "/test-telnyx-send",
		icon: <MessageSquare className="h-5 w-5" />,
		status: "complete",
	},
	{
		title: "Webhook Testing",
		description:
			"Test and debug webhook endpoints. Verify webhook signatures and payload processing.",
		href: "/test-webhook-fix",
		icon: <Webhook className="h-5 w-5" />,
		status: "complete",
	},
	{
		title: "Email Template Preview",
		description:
			"Preview all React Email templates with live data. Test email rendering across different email clients.",
		href: "/emails/preview/welcome",
		icon: <Mail className="h-5 w-5" />,
		status: "complete",
	},
	{
		title: "Authentication Testing",
		description:
			"Test authentication flows including login, signup, password reset, and email verification.",
		href: "/test-auth",
		icon: <Code className="h-5 w-5" />,
		status: "complete",
	},
];

export async function DevelopmentData() {
	const completeFeatures = DEV_FEATURES.filter(
		(f) => f.status === "complete",
	).length;
	const totalFeatures = DEV_FEATURES.length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Development & Testing
					</h1>
					<p className="text-muted-foreground mt-2">
						Access development tools, testing interfaces, and debugging
						utilities
					</p>
				</div>
				<Badge variant="outline" className="text-sm">
					{completeFeatures}/{totalFeatures} Features Available
				</Badge>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-muted-foreground text-sm font-medium">
							Available Tools
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{completeFeatures}</div>
						<p className="text-muted-foreground mt-1 text-xs">Ready to use</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-muted-foreground text-sm font-medium">
							Categories
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">5</div>
						<p className="text-muted-foreground mt-1 text-xs">
							Notifications, Telnyx, Email, Auth, Webhooks
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-muted-foreground text-sm font-medium">
							Most Recent
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-lg font-bold">Notification Testing</div>
						<p className="text-muted-foreground mt-1 text-xs">Added Nov 2025</p>
					</CardContent>
				</Card>
			</div>

			{/* Features Grid */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{DEV_FEATURES.map((feature) => (
					<Card
						key={feature.href}
						className="transition-shadow hover:shadow-md"
					>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 text-primary rounded-lg p-2">
										{feature.icon}
									</div>
									<div>
										<CardTitle className="text-base">{feature.title}</CardTitle>
										{feature.badge && (
											<Badge variant="secondary" className="mt-1 text-xs">
												{feature.badge}
											</Badge>
										)}
									</div>
								</div>
							</div>
							<CardDescription className="mt-2 line-clamp-3">
								{feature.description}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<StatusBadge status={feature.status} />
								<Button asChild size="sm" variant="outline">
									<Link href={feature.href}>Open Tool</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Additional Information */}
			<Card className="bg-muted/50">
				<CardHeader>
					<CardTitle>About Development Tools</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground text-sm">
						These development and testing tools are designed for administrators
						and developers to:
					</p>
					<ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
						<li>
							Test notification delivery across all channels (email, SMS,
							in-app, push)
						</li>
						<li>
							Configure and verify third-party integrations (Telnyx, Resend,
							etc.)
						</li>
						<li>Debug webhook endpoints and API connections</li>
						<li>Preview email templates with live data</li>
						<li>Test authentication flows and user permissions</li>
						<li>Monitor service health and API status</li>
					</ul>
					<div className="border-t pt-4">
						<p className="text-muted-foreground text-xs">
							<strong>Note:</strong> These tools are for development and testing
							purposes. Some features may require proper configuration of
							environment variables and API keys. Always test in a safe
							environment before deploying to production.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function StatusBadge({
	status,
}: {
	status: "complete" | "partial" | "planned";
}) {
	const config = {
		complete: {
			label: "Available",
			className:
				"bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300",
		},
		partial: {
			label: "Partial",
			className:
				"bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300",
		},
		planned: {
			label: "Planned",
			className:
				"bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900 dark:text-gray-300",
		},
	};

	const { label, className } = config[status];

	return (
		<Badge variant="outline" className={className}>
			{label}
		</Badge>
	);
}
