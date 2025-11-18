/**
 * Coming Soon Component - Server Component
 *
 * A reusable component for pages that are under development.
 * Displays a beautiful "Coming Soon" state with feature descriptions.
 *
 * Performance optimizations:
 * - Server Component (no "use client")
 * - All static content rendered on server
 * - Reduced JavaScript bundle size
 */

import { Clock, type LucideIcon, Rocket } from "lucide-react";
import Link from "next/link";

type Feature = {
	icon: LucideIcon;
	title: string;
	description: string;
	color?: string;
};

type ComingSoonProps = {
	/** Main icon to display */
	icon: LucideIcon;
	/** Page title */
	title: string;
	/** Optional gradient color for title (e.g., "from-blue-600 to-blue-400") */
	titleGradient?: string;
	/** Page description */
	description: string;
	/** List of features/capabilities coming to this page */
	features?: Feature[];
	/** Optional link to view all coming soon features */
	showViewAllLink?: boolean;
};

export function ComingSoon({
	icon: Icon,
	title,
	titleGradient = "from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400",
	description,
	features = [],
	showViewAllLink = true,
}: ComingSoonProps) {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-auto px-4 py-16 md:py-24">
			{/* Background gradient blobs */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="bg-primary/10 absolute top-1/4 left-1/4 size-96 rounded-full blur-3xl" />
				<div className="bg-primary/5 absolute right-1/4 bottom-1/4 size-96 rounded-full blur-3xl" />
			</div>

			{/* Main content */}
			<div className="relative w-full max-w-6xl space-y-16 text-center">
				{/* Status badge */}
				<div className="flex justify-center">
					<div className="border-primary/20 bg-primary/5 inline-flex items-center rounded-full border px-6 py-3 text-sm backdrop-blur-sm">
						<Clock className="mr-2 size-4" />
						<span className="font-medium">Coming Soon</span>
					</div>
				</div>

				{/* Icon with gradient background */}
				<div className="flex justify-center">
					<div className="relative">
						<div className="from-primary/20 to-primary/10 absolute inset-0 animate-pulse rounded-full bg-gradient-to-r blur-2xl" />
						<div className="border-primary/20 from-primary/10 to-primary/5 relative flex size-32 items-center justify-center rounded-full border bg-gradient-to-br backdrop-blur-sm">
							<Icon className="text-primary size-16" strokeWidth={1.5} />
						</div>
					</div>
				</div>

				{/* Main heading with gradient */}
				<div className="space-y-4">
					<h1 className="text-5xl font-bold tracking-tight md:text-6xl">
						<span
							className={`bg-gradient-to-r ${titleGradient} bg-clip-text font-extrabold text-transparent`}
						>
							{title}
						</span>
					</h1>
					<p className="text-foreground/60 mx-auto max-w-3xl text-xl leading-relaxed">
						{description}
					</p>
				</div>

				{/* Features Grid (if provided) */}
				{features.length > 0 && (
					<div className="mx-auto max-w-6xl space-y-10 pt-4">
						<h2 className="text-3xl font-semibold">What's Coming</h2>
						<div
							className={`grid gap-8 ${
								features.length === 1
									? "sm:grid-cols-1"
									: features.length === 2
										? "sm:grid-cols-2"
										: features.length === 3
											? "sm:grid-cols-3"
											: features.length <= 4
												? "sm:grid-cols-2 lg:grid-cols-4"
												: features.length <= 6
													? "sm:grid-cols-2 lg:grid-cols-3"
													: "sm:grid-cols-2 lg:grid-cols-4"
							}`}
						>
							{features.map((feature, index) => {
								const FeatureIcon = feature.icon;
								const colorClass = feature.color || "primary";

								return (
									<div
										className={`group border-primary/10 rounded-2xl border bg-gradient-to-br hover:-translate-y-1 from-${colorClass}/5 to-transparent p-8 transition-all duration-300 hover:border-${colorClass}/20 hover:shadow-lg hover:shadow-${colorClass}/10`}
										key={index}
									>
										<div className="mb-5 flex justify-center">
											<div
												className={`flex size-14 items-center justify-center rounded-full bg-${colorClass}/10`}
											>
												<FeatureIcon className={`size-7 text-${colorClass}`} />
											</div>
										</div>
										<h3 className="mb-3 text-xl font-semibold">
											{feature.title}
										</h3>
										<p className="text-muted-foreground leading-relaxed">
											{feature.description}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* Call to action */}
				<div className="space-y-6 pt-8">
					{showViewAllLink && (
						<div className="flex justify-center">
							<Link
								className="border-primary/20 bg-primary/5 hover:border-primary/30 hover:bg-primary/10 inline-flex items-center gap-2 rounded-lg border px-8 py-4 font-medium transition-all"
								href="/dashboard/coming-soon"
							>
								View All Upcoming Features
								<Rocket className="size-5" />
							</Link>
						</div>
					)}
					<div className="text-muted-foreground flex items-center justify-center gap-2">
						<Rocket className="size-5" />
						<p>
							In the meantime, explore the platform and reach out if you need
							help
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
