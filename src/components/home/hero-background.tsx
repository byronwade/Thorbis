"use client";

import { cn } from "@/lib/utils";
import { Calendar, CheckCircle, Clock, DollarSign, MapPin, Wrench } from "lucide-react";

/**
 * Isometric Dashboard Background
 * Professional 3D-style floating UI elements
 * Appeals to contractors by showing the product in action
 */
export function HeroBackground() {
	return (
		<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
			{/* Subtle gradient base */}
			<div
				className="absolute inset-0"
				style={{
					background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)",
				}}
			/>

			{/* Isometric grid */}
			<div
				className="absolute inset-0 opacity-[0.04]"
				style={{
					backgroundImage: `
						linear-gradient(30deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px),
						linear-gradient(150deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
					`,
					backgroundSize: "60px 35px",
				}}
			/>

			{/* Floating Dashboard Cards */}
			<div className="absolute inset-0">
				{/* Job Card - Left */}
				<div
					className="absolute left-[5%] top-[15%] w-48 rounded-lg border border-border/30 bg-card/80 p-3 shadow-xl backdrop-blur-sm"
					style={{
						transform: "perspective(1000px) rotateY(15deg) rotateX(5deg)",
						animation: "float-card 6s ease-in-out infinite",
					}}
				>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<Wrench className="h-3 w-3 text-primary" />
						<span>HVAC Repair</span>
					</div>
					<div className="mt-1 text-sm font-medium">Johnson Residence</div>
					<div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
						<span className="flex items-center gap-1">
							<Clock className="h-3 w-3" />
							9:00 AM
						</span>
						<span className="flex items-center gap-1">
							<MapPin className="h-3 w-3" />
							2.4 mi
						</span>
					</div>
					<div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
						<div className="h-full w-3/4 rounded-full bg-primary" />
					</div>
				</div>

				{/* Schedule Card - Top Right */}
				<div
					className="absolute right-[8%] top-[10%] w-44 rounded-lg border border-border/30 bg-card/80 p-3 shadow-xl backdrop-blur-sm"
					style={{
						transform: "perspective(1000px) rotateY(-12deg) rotateX(8deg)",
						animation: "float-card 8s ease-in-out infinite reverse",
					}}
				>
					<div className="flex items-center gap-2 text-xs font-medium">
						<Calendar className="h-3 w-3 text-primary" />
						<span>Today's Schedule</span>
					</div>
					<div className="mt-2 space-y-1.5">
						<div className="flex items-center gap-2 text-xs">
							<div className="h-2 w-2 rounded-full bg-green-500" />
							<span className="text-muted-foreground">8 jobs scheduled</span>
						</div>
						<div className="flex items-center gap-2 text-xs">
							<div className="h-2 w-2 rounded-full bg-blue-500" />
							<span className="text-muted-foreground">3 in progress</span>
						</div>
						<div className="flex items-center gap-2 text-xs">
							<div className="h-2 w-2 rounded-full bg-primary" />
							<span className="text-muted-foreground">5 completed</span>
						</div>
					</div>
				</div>

				{/* Revenue Card - Right Middle */}
				<div
					className="absolute right-[3%] top-[45%] w-40 rounded-lg border border-border/30 bg-card/80 p-3 shadow-xl backdrop-blur-sm"
					style={{
						transform: "perspective(1000px) rotateY(-18deg) rotateX(3deg)",
						animation: "float-card 7s ease-in-out infinite",
					}}
				>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<DollarSign className="h-3 w-3 text-green-500" />
						<span>Today's Revenue</span>
					</div>
					<div className="mt-1 text-xl font-bold text-green-500">$4,280</div>
					<div className="mt-1 text-xs text-muted-foreground">
						<span className="text-green-500">↑ 12%</span> vs yesterday
					</div>
				</div>

				{/* Notification - Left Bottom */}
				<div
					className="absolute bottom-[25%] left-[8%] flex items-center gap-2 rounded-lg border border-border/30 bg-card/80 px-3 py-2 shadow-xl backdrop-blur-sm"
					style={{
						transform: "perspective(1000px) rotateY(10deg) rotateX(-5deg)",
						animation: "float-card 5s ease-in-out infinite reverse",
					}}
				>
					<CheckCircle className="h-4 w-4 text-green-500" />
					<div className="text-xs">
						<span className="font-medium">Job Completed</span>
						<span className="text-muted-foreground"> • Invoice sent</span>
					</div>
				</div>

				{/* Tech Avatar Card - Bottom Right */}
				<div
					className="absolute bottom-[20%] right-[12%] flex items-center gap-2 rounded-lg border border-border/30 bg-card/80 px-3 py-2 shadow-xl backdrop-blur-sm"
					style={{
						transform: "perspective(1000px) rotateY(-8deg) rotateX(-3deg)",
						animation: "float-card 9s ease-in-out infinite",
					}}
				>
					<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
						MJ
					</div>
					<div className="text-xs">
						<div className="font-medium">Mike Johnson</div>
						<div className="text-muted-foreground">En route • 5 min</div>
					</div>
				</div>
			</div>

			{/* Connecting lines between cards (subtle) */}
			<svg className="absolute inset-0 h-full w-full opacity-20">
				<defs>
					<linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="transparent" />
						<stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
						<stop offset="100%" stopColor="transparent" />
					</linearGradient>
				</defs>
				<line x1="15%" y1="25%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="1" />
				<line x1="85%" y1="20%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="1" />
				<line x1="90%" y1="55%" x2="50%" y2="50%" stroke="url(#lineGradient)" strokeWidth="1" />
			</svg>

			{/* Bottom fade */}
			<div
				className="absolute inset-x-0 bottom-0 h-40"
				style={{
					background: "linear-gradient(to top, hsl(var(--background)), transparent)",
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
				className
			)}
			style={{
				animation: "shimmer 3s linear infinite",
			}}
		>
			{children}
		</span>
	);
}
