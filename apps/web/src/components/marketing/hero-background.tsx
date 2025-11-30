"use client";

import { EtherealShadow } from "@/components/background/ethereal-shadow";
import { cn } from "@/lib/utils";

/**
 * Isometric Dashboard Background
 * Professional 3D-style floating UI elements
 * Appeals to contractors by showing the product in action
 */
export function HeroBackground() {
	return (
		<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
			{/* Ethereal Shadow Background - Base layer */}
			<EtherealShadow
				color="rgba(128, 128, 128, 1)"
				sizing="fill"
				animation={{
					scale: 50,
					speed: 30,
				}}
				noise={{
					opacity: 0.15,
					scale: 1,
				}}
				className="absolute inset-0 z-[1]"
			/>

			{/* Subtle gradient base - Overlay layer */}
			<div
				className="absolute inset-0 z-[2]"
				style={{
					background:
						"radial-gradient(ellipse 100% 70% at 50% 0%, rgba(0, 0, 0, 0.05) 0%, transparent 50%)",
				}}
			/>

			{/* Isometric grid - Top layer */}
			<div
				className="absolute inset-0 z-[3] opacity-[0.03]"
				style={{
					backgroundImage: `
						linear-gradient(30deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
						linear-gradient(150deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
					`,
					backgroundSize: "60px 35px",
				}}
			/>


			{/* Bottom fade */}
			<div
				className="absolute inset-x-0 bottom-0 h-40"
				style={{
					background:
						"linear-gradient(to top, hsl(var(--background)), transparent)",
				}}
			/>
		</div>
	);
}

/**
 * Animated Gradient Text
 */
export function AnimatedGradientText({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_auto] bg-clip-text text-transparent",
				className,
			)}
			style={{
				animation: "shimmer 3s linear infinite",
			}}
		>
			{children}
		</span>
	);
}
