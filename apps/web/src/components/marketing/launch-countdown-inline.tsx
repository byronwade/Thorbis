"use client";

import { Clock } from "lucide-react";
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

export function LaunchCountdownInline() {
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

	// If launch date has passed
	if (!timeRemaining) {
		return null;
	}

	return (
		<div className="mb-6 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4">
			<div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Clock className="size-4 text-primary" />
					<span>
						Launching <strong className="font-semibold text-foreground">April 11, 2026</strong>
					</span>
				</div>
				<div className="flex items-center gap-2 font-mono text-sm">
					<span className="font-semibold tabular-nums text-foreground">
						{timeRemaining.days.toString().padStart(2, "0")}d
					</span>
					<span className="text-primary/40">:</span>
					<span className="font-semibold tabular-nums text-foreground">
						{timeRemaining.hours.toString().padStart(2, "0")}h
					</span>
					<span className="text-primary/40">:</span>
					<span className="font-semibold tabular-nums text-foreground">
						{timeRemaining.minutes.toString().padStart(2, "0")}m
					</span>
					<span className="text-primary/40">:</span>
					<span className="font-semibold tabular-nums text-foreground">
						{timeRemaining.seconds.toString().padStart(2, "0")}s
					</span>
				</div>
			</div>
		</div>
	);
}



