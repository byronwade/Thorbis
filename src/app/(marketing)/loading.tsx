/**
 * Marketing Pages Loading State - Server Component
 */

export default function MarketingLoading() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
				<p className="text-muted-foreground text-sm">Loading...</p>
			</div>
		</div>
	);
}
