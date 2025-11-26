"use client";

/**
 * Admin Floating Tools
 *
 * Collapsible panel with quick admin actions.
 * Shows context-aware actions based on current page.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronUp, ChevronDown, Wrench, Key, DollarSign, FileText, UserCog, Download, History } from "lucide-react";
import { usePathname } from "next/navigation";

interface AdminFloatingToolsProps {
	companyId: string;
	sessionId: string;
}

export function AdminFloatingTools({ companyId, sessionId }: AdminFloatingToolsProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const pathname = usePathname();

	// General admin actions (row-specific actions are in table dropdowns)
	const generalActions = [
		{ icon: History, label: "View Audit Trail", action: "audit", description: "View all actions for this session" },
		{ icon: Download, label: "Export Data", action: "export", description: "Export current view as CSV" },
		{ icon: FileText, label: "View Session Log", action: "log", description: "See detailed session activity" },
	];

	const handleAction = (action: string) => {
		switch (action) {
			case "audit":
				// Navigate to audit trail filtered by session
				window.open(`/admin/dashboard/audit-trail?session=${sessionId}`, "_blank");
				break;
			case "export":
				// TODO: Implement CSV export of current view
				alert("Export functionality coming soon");
				break;
			case "log":
				// Navigate to session details
				window.open(`/admin/dashboard/sessions/${sessionId}`, "_blank");
				break;
			default:
				console.log("Unknown action:", action);
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-40">
			<Card className="w-80 shadow-xl border-orange-200 dark:border-orange-800">
				{/* Header - Always visible */}
				<CardHeader className="pb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Wrench className="h-5 w-5 text-orange-600" />
							<CardTitle className="text-sm">Admin Tools</CardTitle>
						</div>
						<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
							{isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
						</Button>
					</div>
				</CardHeader>

				{/* Expandable content */}
				{isExpanded && (
					<CardContent className="pt-0">
						<div className="space-y-2">
							{/* General admin actions */}
							<div className="text-xs font-medium text-muted-foreground mb-2">Session Tools</div>
							{generalActions.map((action) => {
								const Icon = action.icon;
								return (
									<TooltipProvider key={action.action}>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => handleAction(action.action)}>
													<Icon className="h-4 w-4" />
													{action.label}
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>{action.description}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								);
							})}

							{/* Session info */}
							<div className="mt-4 pt-4 border-t">
								<div className="text-xs text-muted-foreground">
									<div>Session ID: {sessionId.slice(0, 8)}...</div>
									<div>Company ID: {companyId.slice(0, 8)}...</div>
								</div>
							</div>
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
