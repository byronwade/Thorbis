"use client";

import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
		<div className="relative overflow-hidden border-t border-border/40 bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5">
			<div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
			<div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
				<div
					role="status"
					aria-live="polite"
					className="flex flex-col items-center justify-center gap-4 py-4 sm:flex-row sm:gap-6 sm:py-3.5"
				>
					{/* Launch Date Info */}
					<div className="flex items-center gap-2.5">
						<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
							<Clock className="size-4 text-primary" />
						</div>
						<div className="text-left">
							<div className="text-xs font-bold uppercase tracking-wider text-primary">
								Launching Soon
							</div>
							<div className="text-sm font-semibold text-foreground">
								April 11, 2026
							</div>
						</div>
					</div>

					{/* Separator */}
					<div className="hidden h-10 w-px bg-border/50 sm:block" />

					{/* Countdown Timer */}
					<div className="flex items-center gap-3">
						{segments.map((segment, idx) => (
							<div key={segment.label} className="flex items-center gap-3">
								<div className="flex flex-col items-center">
									<div className="flex min-w-[3rem] items-center justify-center rounded-lg border border-border/50 bg-background/80 px-3 py-2 shadow-sm backdrop-blur-sm">
										<span className="font-mono text-2xl font-bold tabular-nums text-foreground">
											{segment.value.toString().padStart(2, "0")}
										</span>
									</div>
									<span className="mt-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
										{segment.label}
									</span>
								</div>
								{idx < segments.length - 1 && (
									<span className="mb-6 text-xl font-bold text-muted-foreground/40">:</span>
								)}
							</div>
						))}
					</div>

					{/* Separator */}
					<div className="hidden h-10 w-px bg-border/50 sm:block" />

					{/* CTA Button */}
					<Button
						asChild
						size="default"
						className="group h-10 rounded-full bg-primary px-6 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5"
					>
						<Link href="/waitlist" className="flex items-center gap-2">
							Join Waitlist
							<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
