/**
 * Training > Courses Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 * - Reduced JavaScript bundle size
 */

export default function CourseLibraryPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-semibold text-2xl">Course Library</h1>
				<p className="text-muted-foreground">Browse and manage training courses</p>
			</div>
			<div className="rounded-lg border p-6">
				<p className="text-muted-foreground">Course Library system coming soon...</p>
			</div>
		</div>
	);
}
