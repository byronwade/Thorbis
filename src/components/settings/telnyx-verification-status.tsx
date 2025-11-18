"use client";

import { AlertCircle, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { checkTelnyxVerificationStatus } from "@/actions/ten-dlc-registration";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type VerificationData = {
	currentLevel: "none" | "level_1" | "level_2";
	isLevel1Complete: boolean;
	isLevel2Complete: boolean;
	canCreate10DLC: boolean;
	requirementsRemaining: string[];
	estimatedCompletionDays?: number;
	nextSteps: Array<{ step: string; action: string; url?: string }>;
	requirements: {
		level1: { required: boolean; items: string[] };
		level2: { required: boolean; items: string[] };
	};
};

export function TelnyxVerificationStatus() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<VerificationData | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	const fetchStatus = async () => {
		try {
			setError(null);
			const result = await checkTelnyxVerificationStatus();

			if (result.success && result.data) {
				setData(result.data);
			} else {
				setError(result.error || "Failed to check verification status");
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to check verification status",
			);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchStatus();
	}, []);

	const handleRefresh = () => {
		setRefreshing(true);
		fetchStatus();
	};

	if (loading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-48 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="size-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	if (!data) {
		return null;
	}

	const getLevelBadge = (level: string) => {
		switch (level) {
			case "level_2":
				return (
					<Badge className="bg-green-500">
						<CheckCircle2 className="mr-1 size-3" />
						Level 2 Complete
					</Badge>
				);
			case "level_1":
				return (
					<Badge className="bg-blue-500">
						<CheckCircle2 className="mr-1 size-3" />
						Level 1 Complete
					</Badge>
				);
			default:
				return (
					<Badge variant="outline">
						<Clock className="mr-1 size-3" />
						Not Verified
					</Badge>
				);
		}
	};

	return (
		<div className="space-y-6">
			{/* Current Status */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Verification Status</CardTitle>
							<CardDescription>
								Current account verification level
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							{getLevelBadge(data.currentLevel)}
							<Button
								variant="outline"
								size="sm"
								onClick={handleRefresh}
								disabled={refreshing}
							>
								{refreshing ? "Refreshing..." : "Refresh"}
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Progress Overview */}
						<div className="grid gap-4 md:grid-cols-3">
							<div className="rounded-lg border p-4">
								<div className="flex items-center gap-2">
									{data.isLevel1Complete ? (
										<CheckCircle2 className="size-5 text-green-500" />
									) : (
										<Clock className="text-muted-foreground size-5" />
									)}
									<div>
										<p className="font-medium">Level 1</p>
										<p className="text-muted-foreground text-sm">
											Identity Verification
										</p>
									</div>
								</div>
							</div>

							<div className="rounded-lg border p-4">
								<div className="flex items-center gap-2">
									{data.isLevel2Complete ? (
										<CheckCircle2 className="size-5 text-green-500" />
									) : (
										<Clock className="text-muted-foreground size-5" />
									)}
									<div>
										<p className="font-medium">Level 2</p>
										<p className="text-muted-foreground text-sm">
											Business Verification
										</p>
									</div>
								</div>
							</div>

							<div className="rounded-lg border p-4">
								<div className="flex items-center gap-2">
									{data.canCreate10DLC ? (
										<CheckCircle2 className="size-5 text-green-500" />
									) : (
										<Clock className="text-muted-foreground size-5" />
									)}
									<div>
										<p className="font-medium">10DLC Ready</p>
										<p className="text-muted-foreground text-sm">
											Can Send Business SMS
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Estimated Completion */}
						{data.estimatedCompletionDays && (
							<Alert>
								<Clock className="size-4" />
								<AlertTitle>Estimated Completion</AlertTitle>
								<AlertDescription>
									Verification typically takes {data.estimatedCompletionDays}{" "}
									business days after all documents are submitted.
								</AlertDescription>
							</Alert>
						)}

						{/* Requirements Remaining */}
						{data.requirementsRemaining.length > 0 && (
							<div>
								<h4 className="mb-2 font-medium">Requirements Remaining:</h4>
								<ul className="text-muted-foreground space-y-1 text-sm">
									{data.requirementsRemaining.map((req, idx) => (
										<li key={idx} className="flex items-start gap-2">
											<AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
											{req}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Next Steps */}
			<Card>
				<CardHeader>
					<CardTitle>Next Steps</CardTitle>
					<CardDescription>
						Follow these steps to complete verification
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{data.nextSteps.map((step, idx) => (
							<div
								key={idx}
								className="flex items-start justify-between gap-4 rounded-lg border p-4"
							>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<Badge variant="outline">{idx + 1}</Badge>
										<p className="font-medium">{step.step}</p>
									</div>
									<p className="text-muted-foreground mt-1 text-sm">
										{step.action}
									</p>
								</div>
								{step.url && (
									<Button asChild variant="outline" size="sm">
										<Link href={step.url} target={step.url.startsWith("http") ? "_blank" : undefined}>
											{step.url.startsWith("http") ? "Open Portal" : "Continue"}
											{step.url.startsWith("http") && (
												<ExternalLink className="ml-2 size-3" />
											)}
										</Link>
									</Button>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Required Documents */}
			{data.requirements.level1.required && (
				<Card>
					<CardHeader>
						<CardTitle>Level 1 Requirements</CardTitle>
						<CardDescription>
							Documents needed for identity verification
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{data.requirements.level1.items.map((item, idx) => (
								<li key={idx} className="flex items-start gap-2">
									<div className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-blue-500" />
									<span className="text-sm">{item}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}

			{data.requirements.level2.required && (
				<Card>
					<CardHeader>
						<CardTitle>Level 2 Requirements</CardTitle>
						<CardDescription>
							Documents needed for business verification (required for 10DLC)
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{data.requirements.level2.items.map((item, idx) => (
								<li key={idx} className="flex items-start gap-2">
									<div className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-green-500" />
									<span className="text-sm">{item}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}

			{/* Success State */}
			{data.canCreate10DLC && (
				<Alert className="border-green-500 bg-green-50 dark:bg-green-950">
					<CheckCircle2 className="size-4 text-green-600" />
					<AlertTitle className="text-green-600">
						Verification Complete!
					</AlertTitle>
					<AlertDescription className="text-green-600">
						Your account is fully verified. You can now proceed with automated
						10DLC brand and campaign setup.
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
