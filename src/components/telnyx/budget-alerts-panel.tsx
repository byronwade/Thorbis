/**
 * Budget Alerts Panel - Server Component
 *
 * Displays budget warnings and alerts
 */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle } from "lucide-react";
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
	if (!budget.isNearLimit && !budget.isOverBudget) {
		return null;
	}

	return (
		<Alert variant={budget.isOverBudget ? "destructive" : "default"} className="border-2">
			<div className="flex items-start gap-3">
				{budget.isOverBudget ? <AlertCircle className="size-5" /> : <AlertTriangle className="size-5" />}
				<div className="flex-1 space-y-3">
					<div>
						<AlertTitle className="text-lg font-bold">{budget.isOverBudget ? "Budget Exceeded" : "Approaching Budget Limit"}</AlertTitle>
						<AlertDescription>
							{budget.isOverBudget ? (
								<span>
									You have exceeded your monthly budget of <span className="font-bold">${budget.limit.toFixed(2)}</span> by <span className="font-bold text-destructive">${(budget.used - budget.limit).toFixed(2)}</span>.
								</span>
							) : (
								<span>
									You have used <span className="font-bold">${budget.used.toFixed(2)}</span> of your <span className="font-bold">${budget.limit.toFixed(2)}</span> monthly budget ({budget.usedPercent.toFixed(1)}%).
								</span>
							)}
						</AlertDescription>
					</div>

					{/* Progress Bar */}
					<div className="space-y-2">
						<Progress value={Math.min(budget.usedPercent, 100)} className="h-3" />
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>${budget.used.toFixed(2)} used</span>
							<span>${Math.max(0, budget.limit - budget.used).toFixed(2)} remaining</span>
						</div>
					</div>

					{/* Recommendations */}
					<div className="rounded-lg bg-muted/50 p-3">
						<p className="text-sm font-medium">Recommendations:</p>
						<ul className="mt-2 space-y-1 text-sm text-muted-foreground">
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
									<li>• Review cost breakdown to identify optimization opportunities</li>
								</>
							)}
						</ul>
					</div>
				</div>
			</div>
		</Alert>
	);
}
