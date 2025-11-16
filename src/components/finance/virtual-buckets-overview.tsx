/**
 * Virtual Buckets Overview - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Compact card design with footer rows
 */

import { Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type VirtualBucket = {
	id: string;
	name: string;
	currentBalance: number;
	targetAmount: number;
	autoAllocate: boolean;
	allocationType: "percentage" | "fixed";
	allocationValue: number;
};

// Mock data - replace with actual data fetching
const buckets: VirtualBucket[] = [
	{
		id: "1",
		name: "Payroll Reserve",
		currentBalance: 85_000,
		targetAmount: 120_000,
		autoAllocate: true,
		allocationType: "percentage",
		allocationValue: 30,
	},
	{
		id: "2",
		name: "Tax Reserve",
		currentBalance: 15_000,
		targetAmount: 25_000,
		autoAllocate: true,
		allocationType: "percentage",
		allocationValue: 25,
	},
	{
		id: "3",
		name: "Marketing Budget",
		currentBalance: 12_500,
		targetAmount: 20_000,
		autoAllocate: true,
		allocationType: "percentage",
		allocationValue: 15,
	},
	{
		id: "4",
		name: "Equipment Reserve",
		currentBalance: 8500,
		targetAmount: 20_000,
		autoAllocate: false,
		allocationType: "fixed",
		allocationValue: 500,
	},
	{
		id: "5",
		name: "Emergency Fund",
		currentBalance: 45_000,
		targetAmount: 75_000,
		autoAllocate: true,
		allocationType: "percentage",
		allocationValue: 10,
	},
];

export function VirtualBucketsOverview() {
	const totalAllocated = buckets.reduce((sum, bucket) => sum + bucket.currentBalance, 0);
	const totalTarget = buckets.reduce((sum, bucket) => sum + bucket.targetAmount, 0);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Layers className="h-5 w-5 text-accent-foreground" />
							Virtual Savings Buckets
						</CardTitle>
						<CardDescription>Organize funds for specific goals</CardDescription>
					</div>
					<Button asChild size="sm" variant="ghost">
						<Link href="/dashboard/settings/finance/virtual-buckets">Manage</Link>
					</Button>
				</div>
			</CardHeader>

			<CardContent>
				{/* Total Overview */}
				<div className="rounded-lg border-2 border-border/20 bg-accent/5 p-4">
					<p className="text-muted-foreground text-sm">Total in Buckets</p>
					<p className="font-bold text-3xl">${totalAllocated.toLocaleString()}</p>
					<div className="mt-2 flex items-center justify-between text-xs">
						<span className="text-muted-foreground">{buckets.length} buckets</span>
						<span className="text-muted-foreground">Target: ${totalTarget.toLocaleString()}</span>
					</div>
				</div>
			</CardContent>

			{/* Individual Buckets as Footer Rows */}
			<CardFooter className="flex-col items-stretch gap-0 p-0">
				{buckets.map((bucket, index) => {
					const progress = (bucket.currentBalance / bucket.targetAmount) * 100;

					return (
						<div key={bucket.id}>
							{index > 0 && <Separator />}
							<div className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<p className="font-medium text-sm">{bucket.name}</p>
										{bucket.autoAllocate && (
											<span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent-foreground text-xs dark:text-accent-foreground">
												Auto {bucket.allocationValue}
												{bucket.allocationType === "percentage" ? "%" : "$"}
											</span>
										)}
									</div>
									<div className="mt-1 flex items-center gap-2">
										<div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
											<div
												className="h-full bg-accent transition-all"
												style={{ width: `${Math.min(progress, 100)}%` }}
											/>
										</div>
										<span className="text-muted-foreground text-xs">{progress.toFixed(0)}%</span>
									</div>
								</div>
								<div className="text-right">
									<p className="font-semibold text-sm">${bucket.currentBalance.toLocaleString()}</p>
									<p className="text-muted-foreground text-xs">/ ${bucket.targetAmount.toLocaleString()}</p>
								</div>
							</div>
						</div>
					);
				})}
			</CardFooter>
		</Card>
	);
}
