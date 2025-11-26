import { Users } from "lucide-react";

/**
 * Team Members Page
 */
export default function TeamPage() {
	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
				<p className="text-muted-foreground">
					Manage Thorbis team members and their schedules
				</p>
			</div>

			<div className="rounded-lg border bg-card">
				<div className="p-6 border-b">
					<div className="flex items-center gap-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
							<Users className="size-5 text-primary" />
						</div>
						<div>
							<h3 className="font-semibold">Team Directory</h3>
							<p className="text-sm text-muted-foreground">
								View and manage team members
							</p>
						</div>
					</div>
				</div>
				<div className="h-96 flex items-center justify-center">
					<p className="text-muted-foreground">Team directory coming soon</p>
				</div>
			</div>
		</div>
	);
}
