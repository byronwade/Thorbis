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
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Calendar className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Smart Scheduling</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Optimize technician schedules based on skills, location, and availability
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<MapPin className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">GPS Tracking</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Real-time location tracking for efficient dispatching and route optimization
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Award className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Skills Management</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track certifications, specializations, and skill levels for better job matching
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Users className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Performance Metrics</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Monitor productivity, customer satisfaction, and revenue per technician
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Empower Your Team</h3>
					<p className="text-muted-foreground mb-6">
						Give technicians the tools they need to succeed
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
