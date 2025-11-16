"use client";

import {
	LazyMotionPath as motion_circle,
	LazyMotionDiv as motion_div,
} from "@/components/lazy/framer-motion";
import { cn } from "@/lib/utils";

// Alias for backward compatibility
const motion = {
	div: motion_div,
	circle: motion_circle,
};

type ProgressRingProps = {
	progress: number;
	isPaused: boolean;
	className?: string;
};

export function ProgressRing({
	progress,
	isPaused,
	className,
}: ProgressRingProps) {
	const size = 32;
	const strokeWidth = 3;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (progress / 100) * circumference;

	if (isPaused) {
		return null;
	}

	return (
		<motion.div
			animate={{ opacity: 1, scale: 1 }}
			className={cn("fixed right-6 bottom-6 z-40", className)}
			exit={{ opacity: 0, scale: 0.8 }}
			initial={{ opacity: 0, scale: 0.8 }}
			transition={{ duration: 0.2 }}
		>
			<div className="relative" style={{ width: size, height: size }}>
				<svg className="rotate-[-90deg]" height={size} width={size}>
					{/* Background circle */}
					<circle
						className="stroke-muted"
						cx={size / 2}
						cy={size / 2}
						fill="none"
						r={radius}
						strokeWidth={strokeWidth}
					/>
					{/* Progress circle */}
					<motion.circle
						animate={{ strokeDashoffset: offset }}
						className="stroke-primary"
						cx={size / 2}
						cy={size / 2}
						fill="none"
						r={radius}
						strokeDasharray={circumference}
						strokeLinecap="round"
						strokeWidth={strokeWidth}
						transition={{ duration: 0.1, ease: "linear" }}
					/>
				</svg>
				{/* Center dot */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="size-2 rounded-full bg-primary" />
				</div>
			</div>
		</motion.div>
	);
}
