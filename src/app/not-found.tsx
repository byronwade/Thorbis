"use client";

import { HardHat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
			<div className="max-w-md space-y-6 text-center">
				<div className="flex justify-center">
					<HardHat className="h-24 w-24 text-muted-foreground/50" />
				</div>

				<div className="space-y-2">
					<h1 className="font-bold text-6xl text-foreground">404</h1>
					<h2 className="font-semibold text-2xl text-foreground">
						Page Not Found
					</h2>
				</div>

				<div className="space-y-4 text-muted-foreground">
					<p className="text-lg">
						Looks like this page went on a coffee break and never came back.
					</p>
					<p className="text-sm">
						We searched high and low, but couldn't find what you're looking for.
						Maybe it's still in the truck? 🚚
					</p>
				</div>

				<div className="pt-4">
					<Button asChild size="lg">
						<Link href="/">Head Back to the Job Site</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
