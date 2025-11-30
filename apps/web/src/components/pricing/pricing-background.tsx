"use client";

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


			{/* Bottom fade */}
			<div
				className="absolute inset-x-0 bottom-0 h-32"
				style={{
					background:
						"linear-gradient(to top, hsl(var(--background)), transparent)",
				}}
			/>
		</div>
	);
}
