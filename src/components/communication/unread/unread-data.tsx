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
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Filter className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Smart Filtering</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Filter unread messages by type, priority, customer, or date range
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Bell className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Priority Inbox</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Automatically prioritize urgent and high-priority messages
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<CheckCheck className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Bulk Actions</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Mark multiple messages as read, archive, or delete in one click
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<MessageSquare className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Quick Reply</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Reply directly from the unread list without opening full message
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">
						Stay on Top of Messages
					</h3>
					<p className="text-muted-foreground mb-6">
						Never miss an important customer communication
					</p>
					<div className="flex justify-center gap-4">
						<button
							className="border-primary/20 bg-background hover:bg-primary/5 rounded-lg border px-6 py-2 font-medium transition-colors"
							type="button"
						>
							Learn More
						</button>
						<button
							className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2 font-medium transition-colors"
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
