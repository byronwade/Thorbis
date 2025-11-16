"use cache";

/**
 * Technicians Data - Async Server Component
 *
 * Displays technician management content (Coming Soon variant).
 */

import { Award, Calendar, MapPin, Users } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";


export async function TechniciansData() {
	return (
		<ComingSoonShell
			description="Manage your field team with scheduling, skills tracking, performance monitoring, and GPS location"
			icon={Users}
			title="Technician Management"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Calendar className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Smart Scheduling</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Optimize technician schedules based on skills, location, and availability
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<MapPin className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">GPS Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Real-time location tracking for efficient dispatching and route optimization
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Award className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Skills Management</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track certifications, specializations, and skill levels for better job matching
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Users className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Performance Metrics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor productivity, customer satisfaction, and revenue per technician
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Empower Your Team</h3>
					<p className="mb-6 text-muted-foreground">Give technicians the tools they need to succeed</p>
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
