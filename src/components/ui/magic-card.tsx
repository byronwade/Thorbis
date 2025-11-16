"use client";

import { cn } from "@/lib/utils";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
	gradientColor?: string;
	gradientOpacity?: number;
}

const GRADIENT_SIZE = 200;
const GRADIENT_TRANSPARENCY = 0.7;

export function MagicCard({
	children,
	className,
	gradientColor = "var(--primary)",
	gradientOpacity = 0.8,
	...props
}: MagicCardProps) {
	const alpha = Math.round(gradientOpacity * 255)
		.toString(16)
		.padStart(2, "0");

	return (
		<div
			className={cn(
				"group relative flex size-full overflow-hidden rounded-lg border bg-transparent p-0 transition-all duration-300",
				className,
			)}
			{...props}
		>
			{/* Glow layer - behind content */}
			<div
				className="pointer-events-none absolute inset-0 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background: `radial-gradient(${GRADIENT_SIZE}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${gradientColor}${alpha}, transparent ${GRADIENT_TRANSPARENCY * 100}%)`,
					zIndex: 0,
				}}
			/>
			{/* Content layer */}
			<div className="relative z-10 size-full bg-foreground/5">{children}</div>
		</div>
	);
}
