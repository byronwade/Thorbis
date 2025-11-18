/**
 * Budget Alerts Panel - Server Component
 *
 * Displays budget warnings and alerts
 */

import { AlertCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

type Budget = {
	limit: number;
	used: number;
	usedPercent: number;
	alertThreshold: number;
	isOverBudget: boolean;
	isNearLimit: boolean;
};

export function BudgetAlertsPanel({ budget }: { budget: Budget }) {
	if (!(budget.isNearLimit || budget.isOverBudget)) {
		return null;
	}

	return (
		<Alert
			className="border-2"
			variant={budget.isOverBudget ? "destructive" : "default"}
		>
			<div className="flex items-start gap-3">
				{budget.isOverBudget ? (
					<AlertCircle className="size-5" />
				) : (
					<AlertTriangle className="size-5" />
				)}
				<div className="flex-1 space-y-3">
					<div>
						<AlertTitle className="text-lg font-bold">
							{budget.isOverBudget
								? "Budget Exceeded"
								: "Approaching Budget Limit"}
						</AlertTitle>
						<AlertDescription>
							{budget.isOverBudget ? (
								<span>
									You have exceeded your monthly budget of{" "}
									<span className="font-bold">${budget.limit.toFixed(2)}</span>{" "}
									by{" "}
									<span className="text-destructive font-bold">
										${(budget.used - budget.limit).toFixed(2)}
									</span>
									.
								</span>
							) : (
								<span>
									You have used{" "}
									<span className="font-bold">${budget.used.toFixed(2)}</span>{" "}
									of your{" "}
									<span className="font-bold">${budget.limit.toFixed(2)}</span>{" "}
									monthly budget ({budget.usedPercent.toFixed(1)}%).
								</span>
							)}
						</AlertDescription>
					</div>

					{/* Progress Bar */}
					<div className="space-y-2">
						<Progress
							className="h-3"
							value={Math.min(budget.usedPercent, 100)}
						/>
						<div className="text-muted-foreground flex justify-between text-xs">
							<span>${budget.used.toFixed(2)} used</span>
							<span>
								${Math.max(0, budget.limit - budget.used).toFixed(2)} remaining
							</span>
						</div>
					</div>

					{/* Recommendations */}
					<div className="bg-muted/50 rounded-lg p-3">
						<p className="text-sm font-medium">Recommendations:</p>
						<ul className="text-muted-foreground mt-2 space-y-1 text-sm">
							{budget.isOverBudget && (
								<>
									<li>• Review your usage patterns in the charts below</li>
									<li>• Consider increasing your monthly budget limit</li>
									<li>• Contact support to discuss enterprise pricing</li>
								</>
							)}
							{!budget.isOverBudget && (
								<>
									<li>• Monitor your daily usage to avoid overage</li>
									<li>• Set up automated alerts at different thresholds</li>
									<li>
										• Review cost breakdown to identify optimization
										opportunities
									</li>
								</>
							)}
						</ul>
					</div>
				</div>
			</div>
		</Alert>
	);
}
