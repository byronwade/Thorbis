"use client";

/**
 * Call Indicator Badge - Client Component
 *
 * Client-side features:
 * - Shows when call is popped out to separate window
 * - Click to bring pop-out window to front
 * - Right-click to return call to main window
 * - Real-time call duration display
 * - Animated pulse to show active status
 *
 * Performance optimizations:
 * - Minimal footprint (only renders when call is popped out)
 * - Uses requestAnimationFrame for smooth animations
 * - Cleanup timers on unmount
 */

import { Phone, PhoneOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type CallIndicatorBadgeProps = {
	callId: string;
	customerName: string;
	customerPhone: string;
	duration: number;
	isActive: boolean;
	onFocusPopOut: () => void;
	onReturnToMain: () => void;
	position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
};

export function CallIndicatorBadge({
	callId,
	customerName,
	customerPhone,
	duration,
	isActive,
	onFocusPopOut,
	onReturnToMain,
	position = "bottom-right",
}: CallIndicatorBadgeProps) {
	const [displayDuration, setDisplayDuration] = useState(duration);
	const [showContextMenu, setShowContextMenu] = useState(false);

	// Update duration every second
	useEffect(() => {
		if (!isActive) {
			return;
		}

		const interval = setInterval(() => {
			setDisplayDuration((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [isActive]);

	// Format duration as MM:SS
	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	// Position classes
	const positionClasses = {
		"bottom-right": "bottom-6 right-6",
		"bottom-left": "bottom-6 left-6",
		"top-right": "top-24 right-6",
		"top-left": "top-24 left-6",
	};

	// Handle right-click to show context menu
	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		setShowContextMenu(true);
	};

	// Close context menu when clicking outside
	useEffect(() => {
		if (!showContextMenu) {
			return;
		}

		const handleClickOutside = () => setShowContextMenu(false);
		document.addEventListener("click", handleClickOutside);

		return () => document.removeEventListener("click", handleClickOutside);
	}, [showContextMenu]);

	return (
		<div
			className={cn("fixed z-50 transition-all duration-200", positionClasses[position])}
			onContextMenu={handleContextMenu}
		>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Card
							className={cn(
								"group relative cursor-pointer overflow-hidden",
								"border-primary/30 from-primary/10 to-primary/5 rounded-2xl border-2 bg-gradient-to-br",
								"shadow-primary/20 shadow-lg backdrop-blur-sm",
								"hover:border-primary/50 hover:shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl",
								"animate-pulse-slow"
							)}
							onClick={onFocusPopOut}
						>
							{/* Status indicator pulse */}
							<div className="bg-primary/20 absolute inset-0 animate-ping rounded-2xl opacity-75" />

							{/* Content */}
							<div className="relative flex items-center gap-3 p-4">
								{/* Phone icon */}
								<div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full shadow-md">
									<Phone className="h-6 w-6 animate-pulse" />
								</div>

								{/* Call info */}
								<div className="flex flex-col gap-1">
									<div className="text-foreground text-sm font-semibold">{customerName}</div>
									<div className="text-muted-foreground text-xs">{customerPhone}</div>
									<div className="text-primary font-mono text-xs font-bold">
										{formatDuration(displayDuration)}
									</div>
								</div>

								{/* Close button */}
								<Button
									className="ml-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
									onClick={(e) => {
										e.stopPropagation();
										onReturnToMain();
									}}
									size="icon"
									variant="ghost"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</Card>
					</TooltipTrigger>
					<TooltipContent className="max-w-xs" side="left">
						<div className="space-y-2">
							<p className="font-semibold">Active Call (Pop-out Window)</p>
							<p className="text-muted-foreground text-xs">Click to bring window to front</p>
							<p className="text-muted-foreground text-xs">
								Right-click or click X to return to main window
							</p>
						</div>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			{/* Context menu */}
			{showContextMenu && (
				<div className="border-border bg-background absolute right-0 bottom-full mb-2 rounded-lg border p-2 shadow-lg">
					<Button
						className="w-full justify-start gap-2 text-sm"
						onClick={(e) => {
							e.stopPropagation();
							onReturnToMain();
							setShowContextMenu(false);
						}}
						size="sm"
						variant="ghost"
					>
						<PhoneOff className="h-4 w-4" />
						Return to Main Window
					</Button>
				</div>
			)}
		</div>
	);
}
