import { Calendar } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function BookingData() {
	return (
		<ComingSoonShell
			description="Customer self-service booking"
			icon={Calendar}
			title="Online Booking"
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
