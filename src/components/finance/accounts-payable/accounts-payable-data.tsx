import { Settings } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

"use cache";

export async function AccountsPayableData() {
	return (
		<ComingSoonShell description="This feature is under development" icon={Settings} title="Accounts Payable">
			<div className="mx-auto max-w-5xl">
				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Coming Soon</h3>
					<p className="text-muted-foreground">This feature is currently under development</p>
				</div>
			</div>
		</ComingSoonShell>
	);
}
