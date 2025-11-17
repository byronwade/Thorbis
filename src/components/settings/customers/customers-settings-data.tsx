import { Bell, Settings, Shield, Star, Tag, UserCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const customerSections = [
	{
		title: "Customer Preferences",
		description: "Default settings for customer profiles and fields",
		icon: UserCircle,
		href: "/dashboard/settings/customers/preferences",
		color: "text-primary",
		bgColor: "bg-primary/10",
	},
	{
		title: "Loyalty & Rewards",
		description: "Customer loyalty programs and point systems",
		icon: Star,
		href: "/dashboard/settings/customers/loyalty",
		color: "text-warning",
		bgColor: "bg-warning/10",
	},
	{
		title: "Customer Notifications",
		description: "How customers receive updates and alerts",
		icon: Bell,
		href: "/dashboard/settings/customers/notifications",
		color: "text-success",
		bgColor: "bg-success/10",
	},
	{
		title: "Privacy & Consent",
		description: "GDPR, data retention, and consent management",
		icon: Shield,
		href: "/dashboard/settings/customers/privacy",
		color: "text-accent-foreground",
		bgColor: "bg-accent/10",
	},
	{
		title: "Custom Fields",
		description: "Add custom fields to customer profiles",
		icon: Tag,
		href: "/dashboard/settings/customers/custom-fields",
		color: "text-accent-foreground",
		bgColor: "bg-accent/10",
	},
];

/**
 * Settings > Customers Data - Async Server Component
 *
 * Currently static, but split out so we can attach real settings data
 * later without changing the PPR shell.
 */
export async function CustomersSettingsData() {
	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{customerSections.map((section) => {
					const Icon = section.icon;
					return (
						<Link href={section.href} key={section.title}>
							<Card className="group hover:border-primary/50 transition-all hover:shadow-md">
								<CardContent className="p-6">
									<div className="flex items-start gap-4">
										<div
											className={`flex size-12 items-center justify-center rounded-lg ${section.bgColor}`}
										>
											<Icon className={`size-6 ${section.color}`} />
										</div>
										<div className="flex-1 space-y-1">
											<h3 className="group-hover:text-primary font-semibold">{section.title}</h3>
											<p className="text-muted-foreground text-sm">{section.description}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</Link>
					);
				})}
			</div>

			<Card>
				<CardContent className="p-6">
					<div className="flex items-start gap-3">
						<Settings className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
						<div className="space-y-1">
							<p className="text-sm font-medium">Customer Settings Overview</p>
							<p className="text-muted-foreground text-sm">
								These settings control how customer data is managed, stored, and used throughout the
								system. Configure default preferences, set up loyalty programs, manage
								notifications, ensure privacy compliance, and customize customer profile fields to
								match your business needs.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
