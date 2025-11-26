import { Calendar } from "lucide-react";

/**
 * Time Off Page
 */
export default function TimeOffPage() {
	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">Time Off</h1>
				<p className="text-muted-foreground">
					Manage time off requests and approvals
				</p>
			</div>

			<div className="rounded-lg border bg-card">
				<div className="p-6 border-b">
					<div className="flex items-center gap-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
							<Calendar className="size-5 text-primary" />
						</div>
						<div>
							<h3 className="font-semibold">Time Off Requests</h3>
							<p className="text-sm text-muted-foreground">
								Review and approve time off requests
							</p>
						</div>
					</div>
				</div>
				<div className="h-96 flex items-center justify-center">
					<p className="text-muted-foreground">Time off management coming soon</p>
				</div>
			</div>
		</div>
	);
}
