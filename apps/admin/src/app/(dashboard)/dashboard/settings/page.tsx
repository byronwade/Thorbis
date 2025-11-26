import { CreditCard, Settings, Users, Zap } from "lucide-react";
import Link from "next/link";

/**
 * Settings Page
 */
export default function SettingsPage() {
	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account and platform settings
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Link
					href="/dashboard/settings/profile"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Users className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-medium">Profile</h3>
						<p className="text-sm text-muted-foreground">
							Manage your personal information
						</p>
					</div>
				</Link>

				<Link
					href="/dashboard/settings/security"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Settings className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-medium">Security</h3>
						<p className="text-sm text-muted-foreground">
							Password and authentication settings
						</p>
					</div>
				</Link>

				<Link
					href="/dashboard/settings/general"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Settings className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-medium">General</h3>
						<p className="text-sm text-muted-foreground">
							Platform-wide settings
						</p>
					</div>
				</Link>

				<Link
					href="/dashboard/settings/billing"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<CreditCard className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-medium">Billing</h3>
						<p className="text-sm text-muted-foreground">
							Subscription and payment settings
						</p>
					</div>
				</Link>

				<Link
					href="/dashboard/settings/integrations"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Zap className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-medium">Integrations</h3>
						<p className="text-sm text-muted-foreground">
							Third-party integrations
						</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
