/**
 * Welcome Skeleton - Loading State
 *
 * Shows a beautiful loading state while onboarding data loads.
 * Matches the design of the actual welcome page.
 */
export function WelcomeSkeleton() {
	return (
		<div className="from-background via-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br">
			<div className="w-full max-w-4xl space-y-8 p-8">
				{/* Logo/Brand Area */}
				<div className="flex justify-center">
					<div className="bg-muted size-16 animate-pulse rounded-full" />
				</div>

				{/* Title */}
				<div className="space-y-4 text-center">
					<div className="bg-muted mx-auto h-12 w-96 animate-pulse rounded" />
					<div className="bg-muted mx-auto h-6 w-64 animate-pulse rounded" />
				</div>

				{/* Main Content Card */}
				<div className="border-border/50 bg-card rounded-2xl border p-8 shadow-lg">
					<div className="space-y-6">
						{/* Progress Indicator */}
						<div className="flex justify-center gap-2">
							{[1, 2, 3, 4].map((i) => (
								<div className="bg-muted size-3 animate-pulse rounded-full" key={i} />
							))}
						</div>

						{/* Form Fields */}
						<div className="space-y-4">
							<div className="bg-muted h-12 w-full animate-pulse rounded" />
							<div className="bg-muted h-12 w-full animate-pulse rounded" />
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-muted h-12 animate-pulse rounded" />
								<div className="bg-muted h-12 animate-pulse rounded" />
							</div>
							<div className="bg-muted h-12 w-full animate-pulse rounded" />
						</div>

						{/* Action Buttons */}
						<div className="flex justify-between pt-4">
							<div className="bg-muted h-10 w-24 animate-pulse rounded" />
							<div className="bg-primary/20 h-10 w-32 animate-pulse rounded" />
						</div>
					</div>
				</div>

				{/* Footer Text */}
				<div className="flex justify-center">
					<div className="bg-muted h-4 w-48 animate-pulse rounded" />
				</div>
			</div>
		</div>
	);
}
