import { Zap } from "lucide-react";

/**
 * AI Automation Page
 */
export default function AutomationPage() {
	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">AI Automation</h1>
				<p className="text-muted-foreground">
					Configure AI-powered automations and workflows
				</p>
			</div>

			<div className="rounded-lg border bg-card p-6">
				<div className="flex items-center gap-4 mb-4">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Zap className="size-5 text-primary" />
					</div>
					<div>
						<h3 className="font-semibold">Automation Rules</h3>
						<p className="text-sm text-muted-foreground">
							Create and manage automation rules
						</p>
					</div>
				</div>
				<div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
					<p className="text-muted-foreground">Automation builder coming soon</p>
				</div>
			</div>
		</div>
	);
}
