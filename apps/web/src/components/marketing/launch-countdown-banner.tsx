"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const LAUNCH_DATE = new Date("2026-04-11T00:00:00Z");

interface TimeRemaining {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

function calculateTimeRemaining(): TimeRemaining | null {
	const now = new Date().getTime();
	const launch = LAUNCH_DATE.getTime();
	const difference = launch - now;

	if (difference <= 0) {
		return null; // Launch date has passed
	}

	const days = Math.floor(difference / (1000 * 60 * 60 * 24));
	const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((difference % (1000 * 60)) / 1000);

	return { days, hours, minutes, seconds };
}

export function LaunchCountdownBanner() {
	const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(() =>
		calculateTimeRemaining(),
	);

	useEffect(() => {
		// Initial calculation
		setTimeRemaining(calculateTimeRemaining());

		// Update every second
		const interval = setInterval(() => {
			const remaining = calculateTimeRemaining();
			setTimeRemaining(remaining);

			// If countdown reached zero, clear interval
			if (!remaining) {
				clearInterval(interval);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// If launch date has passed, don't show banner
	if (!timeRemaining) {
		return null;
	}

	const segments = [
		{ label: "Days", value: timeRemaining.days },
		{ label: "Hours", value: timeRemaining.hours },
		{ label: "Minutes", value: timeRemaining.minutes },
		{ label: "Seconds", value: timeRemaining.seconds },
	];

	return (
		<div className="border-t border-border/40 bg-muted/30">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div
					role="status"
					aria-live="polite"
					className="flex items-center justify-center gap-4 py-2 text-sm sm:gap-5"
				>
					{/* Launch Info */}
					<div className="flex items-center gap-2">
						<Clock className="size-3.5 text-primary" />
						<span className="font-medium text-foreground">
							Launching <span className="font-semibold">Apr 11, 2026</span>
						</span>
					</div>

					{/* Separator */}
					<div className="hidden h-4 w-px bg-border sm:block" />

					{/* Compact Countdown */}
					<div className="flex items-center gap-1.5 font-mono text-sm">
						{segments.map((segment, idx) => (
							<span key={segment.label} className="flex items-center gap-1.5">
								<span className="flex items-baseline gap-0.5">
									<span className="font-bold tabular-nums text-foreground">
										{segment.value.toString().padStart(2, "0")}
									</span>
									<span className="text-xs text-muted-foreground">
										{segment.label[0].toLowerCase()}
									</span>
								</span>
								{idx < segments.length - 1 && (
									<span className="text-muted-foreground/50">:</span>
								)}
							</span>
						))}
					</div>

					{/* Separator */}
					<div className="hidden h-4 w-px bg-border sm:block" />

					{/* CTA */}
					<Button
						asChild
						size="sm"
						className="h-7 rounded-full bg-primary px-4 text-xs font-semibold shadow-sm hover:shadow-md transition-all"
					>
						<Link href="/waitlist" className="flex items-center gap-1.5">
							Join Waitlist
							<ArrowRight className="size-3" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
