import { Building2, CreditCard, HelpCircle, LifeBuoy, UserPlus, Users } from "lucide-react";
import Link from "next/link";

/**
 * Work Section - Company Management Overview
 */
export default function WorkPage() {
	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">Work</h1>
				<p className="text-muted-foreground">
					Manage companies, users, subscriptions, and support
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<SectionCard
					title="Companies"
					description="View and manage all contractor companies"
					href="/dashboard/work/companies"
					icon={Building2}
					count="--"
				/>
				<SectionCard
					title="Users"
					description="Manage user accounts across all companies"
					href="/dashboard/work/users"
					icon={Users}
					count="--"
				/>
				<SectionCard
					title="Subscriptions"
					description="Manage subscription plans and billing"
					href="/dashboard/work/subscriptions"
					icon={CreditCard}
					count="--"
				/>
				<SectionCard
					title="Support Tickets"
					description="Handle customer support requests"
					href="/dashboard/work/support"
					icon={LifeBuoy}
					count="--"
				/>
				<SectionCard
					title="Onboarding"
					description="Track new company onboarding progress"
					href="/dashboard/work/onboarding"
					icon={UserPlus}
					count="--"
				/>
				<SectionCard
					title="Help Center"
					description="Manage help articles and documentation"
					href="/dashboard/work/help-center"
					icon={HelpCircle}
					count="--"
				/>
			</div>
		</div>
	);
}

function SectionCard({
	title,
	description,
	href,
	icon: Icon,
	count,
}: {
	title: string;
	description: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	count: string;
}) {
	return (
		<Link
			href={href}
			className="flex flex-col rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
		>
			<div className="flex items-center justify-between mb-4">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
					<Icon className="size-5 text-primary" />
				</div>
				<span className="text-2xl font-bold">{count}</span>
			</div>
			<h3 className="font-semibold mb-1">{title}</h3>
			<p className="text-sm text-muted-foreground">{description}</p>
		</Link>
	);
}
