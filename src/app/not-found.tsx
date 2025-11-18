"use client";

import { HardHat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
			<div className="max-w-md space-y-6 text-center">
				<div className="flex justify-center">
					<HardHat className="text-muted-foreground/50 h-24 w-24" />
				</div>

				<div className="space-y-2">
					<h1 className="text-foreground text-6xl font-bold">404</h1>
					<h2 className="text-foreground text-2xl font-semibold">
						Page Not Found
					</h2>
				</div>

				<div className="text-muted-foreground space-y-4">
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
