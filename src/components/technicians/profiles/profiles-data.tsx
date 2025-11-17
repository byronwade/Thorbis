/**
 * Technician Profiles Data - Async Server Component
 *
 * Displays technician profiles content (Coming Soon variant).
 */

import { Award, Camera, FileText, User } from "lucide-react";
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";

export async function ProfilesData() {
	return (
		<ComingSoonShell
			description="Complete technician profiles with skills, certifications, performance history, and customer reviews"
			icon={User}
			title="Technician Profiles"
		>
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<User className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Personal Information</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Contact details, emergency contacts, employment history, and HR documentation
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Award className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Skills & Certifications</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track licenses, certifications, specializations, and skill levels
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<FileText className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Performance History</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Review job completion rates, customer feedback, and performance metrics
						</p>
					</div>

					<div className="border-primary/10 bg-card/50 space-y-3 rounded-lg border p-6 backdrop-blur-sm">
						<div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
							<Camera className="text-primary size-6" />
						</div>
						<h3 className="text-lg font-semibold">Profile Photos</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Professional photos for customer communication and mobile app profiles
						</p>
					</div>
				</div>

				<div className="border-primary/20 from-primary/5 to-primary/10 rounded-lg border bg-gradient-to-br p-8 text-center">
					<h3 className="mb-3 text-xl font-semibold">Build Your Team</h3>
					<p className="text-muted-foreground mb-6">Comprehensive profiles for every technician</p>
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
