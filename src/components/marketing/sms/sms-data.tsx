import { MessageSquare } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function SmsData() {
	return (
		<ComingSoonShell
			description="Send SMS messages to customers"
			icon={MessageSquare}
			title="SMS Marketing"
		>
			<div className="mx-auto max-w-5xl">
				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Coming Soon</h3>
					<p className="text-muted-foreground">This feature is under development</p>
				</div>
			</div>
		</ComingSoonShell>
	);
}
