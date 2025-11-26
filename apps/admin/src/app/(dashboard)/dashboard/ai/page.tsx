import { MessageSquare, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

/**
 * AI Assistant Page
 */
export default function AIPage() {
	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">Ask Thorbis</h1>
				<p className="text-muted-foreground">
					AI-powered assistant for platform management
				</p>
			</div>

			{/* Quick Actions */}
			<div className="grid gap-6 md:grid-cols-2 mb-8">
				<Link
					href="/dashboard/ai/automation"
					className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:bg-muted/50"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Zap className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-medium">Automation</h3>
						<p className="text-sm text-muted-foreground">
							Configure AI-powered automations
						</p>
					</div>
				</Link>
			</div>

			{/* Chat Interface */}
			<div className="rounded-lg border bg-card">
				<div className="p-6 border-b">
					<h2 className="font-semibold">AI Assistant</h2>
					<p className="text-sm text-muted-foreground">
						Ask questions about the platform, get insights, and manage tasks
					</p>
				</div>
				<div className="h-96 flex items-center justify-center">
					<div className="text-center">
						<Sparkles className="size-12 mx-auto mb-4 text-primary/20" />
						<p className="text-muted-foreground mb-4">
							AI chat interface coming soon
						</p>
						<p className="text-sm text-muted-foreground max-w-md mx-auto">
							Ask questions about companies, users, revenue, support tickets,
							and more. Get AI-powered insights and recommendations.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
