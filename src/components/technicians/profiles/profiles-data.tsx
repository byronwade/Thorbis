"use cache";

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
					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<User className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Personal Information</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Contact details, emergency contacts, employment history, and HR documentation
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Award className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Skills & Certifications</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Track licenses, certifications, specializations, and skill levels
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<FileText className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Performance History</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Review job completion rates, customer feedback, and performance metrics
						</p>
					</div>

					<div className="space-y-3 rounded-lg border border-primary/10 bg-card/50 p-6 backdrop-blur-sm">
						<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
							<Camera className="size-6 text-primary" />
						</div>
						<h3 className="font-semibold text-lg">Profile Photos</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Professional photos for customer communication and mobile app profiles
						</p>
					</div>
				</div>

				<div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
					<h3 className="mb-3 font-semibold text-xl">Build Your Team</h3>
					<p className="mb-6 text-muted-foreground">Comprehensive profiles for every technician</p>
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
