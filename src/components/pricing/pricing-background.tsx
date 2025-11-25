"use client";

import { DollarSign, Percent, TrendingDown } from "lucide-react";

/**
 * Pricing Page Background
 * Subtle floating price tags and savings indicators
 */
export function PricingBackground() {
	return (
		<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
			{/* Subtle gradient base */}
			<div
				className="absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34, 197, 94, 0.06) 0%, transparent 50%)",
				}}
			/>

			{/* Grid pattern */}
			<div
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage: `
						linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px),
						linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px)
					`,
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Floating Price Tags */}
			<div className="absolute inset-0">
				{/* Savings tag - Left */}
				<div
					className="absolute left-[8%] top-[20%] flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 shadow-lg backdrop-blur-sm"
					style={{
						animation: "float-card 7s ease-in-out infinite",
					}}
				>
					<TrendingDown className="h-4 w-4 text-green-500" />
					<span className="text-sm font-semibold text-green-500">-70%</span>
				</div>

				{/* Dollar icon - Top Right */}
				<div
					className="absolute right-[12%] top-[15%] flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-lg backdrop-blur-sm"
					style={{
						animation: "float-card 8s ease-in-out infinite reverse",
					}}
				>
					<DollarSign className="h-6 w-6 text-primary" />
				</div>

				{/* Savings badge - Right Middle */}
				<div
					className="absolute right-[5%] top-[40%] rounded-lg border border-green-500/20 bg-card/80 p-2 shadow-lg backdrop-blur-sm"
					style={{
						animation: "float-card 6s ease-in-out infinite",
					}}
				>
					<div className="flex items-center gap-2">
						<Percent className="h-4 w-4 text-green-500" />
						<div>
							<div className="text-xs font-semibold text-green-500">Save $1,400</div>
							<div className="text-[10px] text-muted-foreground">/month</div>
						</div>
					</div>
				</div>

				{/* Price comparison - Left Bottom */}
				<div
					className="absolute bottom-[30%] left-[5%] rounded-lg border border-border/30 bg-card/80 p-2 shadow-lg backdrop-blur-sm"
					style={{
						animation: "float-card 9s ease-in-out infinite reverse",
					}}
				>
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-xs">
							<span className="text-muted-foreground line-through">$1,813</span>
							<span className="text-red-500">Competitor</span>
						</div>
						<div className="flex items-center gap-2 text-xs">
							<span className="font-bold text-green-500">$368</span>
							<span className="text-primary">Thorbis</span>
						</div>
					</div>
				</div>

				{/* Unlimited badge - Bottom Right */}
				<div
					className="absolute bottom-[25%] right-[10%] flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 shadow-lg backdrop-blur-sm"
					style={{
						animation: "float-card 5s ease-in-out infinite",
					}}
				>
					<span className="text-sm font-medium text-primary">∞ Users</span>
				</div>
			</div>

			{/* Bottom fade */}
			<div
				className="absolute inset-x-0 bottom-0 h-32"
				style={{
					background: "linear-gradient(to top, hsl(var(--background)), transparent)",
				}}
			/>
		</div>
	);
}
