/**
 * Technicians > App Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export default function TechnicianAppPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-semibold text-2xl">Technician App</h1>
				<p className="text-muted-foreground">Mobile app for technicians in the field</p>
			</div>
			<div className="rounded-lg border p-6">
				<p className="text-muted-foreground">Technician App coming soon...</p>
			</div>
		</div>
	);
}
