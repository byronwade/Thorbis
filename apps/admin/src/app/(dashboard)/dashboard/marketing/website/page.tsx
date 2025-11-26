import { Globe, TrendingUp } from "lucide-react";

/**
 * Website Analytics Page
 */
export default function WebsitePage() {
	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold tracking-tight">Website</h1>
				<p className="text-muted-foreground">
					Website analytics and content management
				</p>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-4 mb-8">
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Visitors Today</p>
					<p className="text-2xl font-bold">--</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Page Views</p>
					<p className="text-2xl font-bold">--</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Bounce Rate</p>
					<p className="text-2xl font-bold">--%</p>
				</div>
				<div className="rounded-lg border bg-card p-4">
					<p className="text-sm text-muted-foreground">Avg Session</p>
					<p className="text-2xl font-bold">-- min</p>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold mb-4">Traffic Overview</h3>
					<div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
						<p className="text-muted-foreground">Chart coming soon</p>
					</div>
				</div>
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-semibold mb-4">Top Pages</h3>
					<div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
						<p className="text-muted-foreground">Table coming soon</p>
					</div>
				</div>
			</div>
		</div>
	);
}
