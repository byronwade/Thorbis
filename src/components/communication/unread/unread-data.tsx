"use cache";

/**
 * Unread Messages Data - Async Server Component
 *
 * Displays unread messages content (Coming Soon variant).
 */

import { Bell, CheckCheck, Filter, MessageSquare } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function UnreadMessagesData() {
	return (
		<ComingSoonShell
			description="View and manage all unread communications from email, SMS, phone calls, and support tickets"
			icon={MessageSquare}
			title="Unread Messages"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Filter className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Smart Filtering</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Filter unread messages by type, priority, customer, or date range
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Bell className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Priority Inbox</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically prioritize urgent and high-priority messages
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<CheckCheck className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Bulk Actions</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Mark multiple messages as read, archive, or delete in one click
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<MessageSquare className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Quick Reply</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Reply directly from the unread list without opening full message
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Stay on Top of Messages</h3>
					<p className="mb-6 text-muted-foreground">Never miss an important customer communication</p>
					<div className="flex justify-center gap-4">
						<button
							className="rounded-lg border border-primary/20 bg-background px-6 py-2 font-medium transition-colors hover:bg-primary/5"
							type="button"
						>
							Learn More
						</button>
						<button
							className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
							type="button"
						>
							Request Access
						</button>
					</div>
				</div>
			</div>
		</ComingSoonShell>
	);
}
