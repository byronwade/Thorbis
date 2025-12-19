"use client";

/**
 * Payment Recovery Card
 *
 * Displays when a subscription payment has failed.
 * Shows:
 * - Payment failure details
 * - Grace period countdown
 * - Actions to update payment method
 */

import {
	AlertTriangle,
	CheckCircle2,
	CreditCard,
	Loader2,
	RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type PaymentRecoveryCardProps = {
	amountDue: string;
	lastFourDigits: string;
	paymentMethod: string; // "Visa", "Mastercard", etc.
	failedAt: string;
	attemptCount: number;
	gracePeriodEnds: string;
	daysRemainingInGrace: number;
	onUpdatePayment: () => void;
	onRetryPayment?: () => Promise<boolean>;
};

export function PaymentRecoveryCard({
	amountDue,
	lastFourDigits,
	paymentMethod,
	failedAt,
	attemptCount,
	gracePeriodEnds,
	daysRemainingInGrace,
	onUpdatePayment,
	onRetryPayment,
}: PaymentRecoveryCardProps) {
	const [isRetrying, setIsRetrying] = useState(false);
	const isUrgent = daysRemainingInGrace <= 2;
	const gracePeriodProgress = ((7 - daysRemainingInGrace) / 7) * 100;

	const handleRetry = async () => {
		if (!onRetryPayment) return;

		setIsRetrying(true);
		try {
			const success = await onRetryPayment();
			if (success) {
				toast.success("Payment successful!", {
					description: "Your subscription is now active.",
				});
			} else {
				toast.error("Payment failed", {
					description: "Please update your payment method.",
				});
			}
		} catch {
			toast.error("Something went wrong", {
				description: "Please try again or contact support.",
			});
		} finally {
			setIsRetrying(false);
		}
	};

	return (
		<Card
			className={cn(
				"border-2",
				isUrgent ? "border-red-500 bg-red-50/50" : "border-yellow-500 bg-yellow-50/50"
			)}
		>
			<CardHeader>
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"p-2 rounded-full",
							isUrgent ? "bg-red-100" : "bg-yellow-100"
						)}
					>
						<AlertTriangle
							className={cn(
								"h-5 w-5",
								isUrgent ? "text-red-600" : "text-yellow-600"
							)}
						/>
					</div>
					<div>
						<CardTitle className="text-lg">Payment Failed</CardTitle>
						<CardDescription>
							We were unable to process your payment
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Amount Due */}
				<div className="flex justify-between items-center p-4 bg-background rounded-lg border">
					<span className="text-muted-foreground">Amount Due</span>
					<span className="text-2xl font-bold">{amountDue}</span>
				</div>

				{/* Payment Details */}
				<div className="grid gap-3 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Payment Method</span>
						<span className="font-medium">
							{paymentMethod} ending in {lastFourDigits}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Failed On</span>
						<span className="font-medium">{failedAt}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Attempts</span>
						<span className="font-medium">{attemptCount}</span>
					</div>
				</div>

				{/* Grace Period Indicator */}
				<div
					className={cn(
						"p-4 rounded-lg border",
						isUrgent ? "bg-red-100 border-red-200" : "bg-yellow-100 border-yellow-200"
					)}
				>
					<div className="flex items-center justify-between mb-2">
						<span
							className={cn(
								"text-sm font-medium",
								isUrgent ? "text-red-800" : "text-yellow-800"
							)}
						>
							{isUrgent ? "Account Suspension Imminent" : "Grace Period Active"}
						</span>
						<span
							className={cn(
								"text-sm font-bold",
								isUrgent ? "text-red-600" : "text-yellow-600"
							)}
						>
							{daysRemainingInGrace} {daysRemainingInGrace === 1 ? "day" : "days"} left
						</span>
					</div>
					<Progress
						value={gracePeriodProgress}
						className={cn(
							"h-2",
							isUrgent ? "[&>div]:bg-red-600" : "[&>div]:bg-yellow-600"
						)}
					/>
					<p
						className={cn(
							"text-xs mt-2",
							isUrgent ? "text-red-700" : "text-yellow-700"
						)}
					>
						Your account will be suspended on {gracePeriodEnds} if payment is not updated.
					</p>
				</div>

				{/* What Happens */}
				<div className="space-y-2">
					<h4 className="text-sm font-semibold">What happens if not resolved:</h4>
					<ul className="text-sm text-muted-foreground space-y-1">
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
							Team members lose dashboard access
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
							Customer portal becomes unavailable
						</li>
						<li className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
							Scheduled jobs and appointments hidden
						</li>
						<li className="flex items-center gap-2">
							<CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
							<span className="text-green-700">Your data remains safe and recoverable</span>
						</li>
					</ul>
				</div>
			</CardContent>

			<CardFooter className="flex gap-3">
				<Button onClick={onUpdatePayment} className="flex-1 gap-2">
					<CreditCard className="h-4 w-4" />
					Update Payment Method
				</Button>
				{onRetryPayment && (
					<Button
						variant="outline"
						onClick={handleRetry}
						disabled={isRetrying}
						className="gap-2"
					>
						{isRetrying ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<RefreshCw className="h-4 w-4" />
						)}
						Retry Payment
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}

/**
 * Minimal version for embedding in other pages
 */
export function PaymentRecoveryAlert({
	daysRemainingInGrace,
	onUpdatePayment,
}: {
	daysRemainingInGrace: number;
	onUpdatePayment: () => void;
}) {
	const isUrgent = daysRemainingInGrace <= 2;

	return (
		<div
			className={cn(
				"flex items-center gap-4 p-4 rounded-lg border",
				isUrgent ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
			)}
		>
			<AlertTriangle
				className={cn(
					"h-5 w-5 flex-shrink-0",
					isUrgent ? "text-red-600" : "text-yellow-600"
				)}
			/>
			<div className="flex-1">
				<p
					className={cn(
						"text-sm font-medium",
						isUrgent ? "text-red-800" : "text-yellow-800"
					)}
				>
					Payment failed - {daysRemainingInGrace} days to update
				</p>
				<p
					className={cn(
						"text-xs",
						isUrgent ? "text-red-700" : "text-yellow-700"
					)}
				>
					Update your payment method to avoid account suspension.
				</p>
			</div>
			<Button
				size="sm"
				variant={isUrgent ? "destructive" : "default"}
				onClick={onUpdatePayment}
				className="gap-2"
			>
				<CreditCard className="h-4 w-4" />
				Update
			</Button>
		</div>
	);
}
