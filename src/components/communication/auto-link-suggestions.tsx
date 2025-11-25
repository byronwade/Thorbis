/**
 * Auto-Link Suggestions Component
 *
 * Displays suggested customer/job/property matches for unlinked communications
 * Shows confidence scores and allows CSRs to accept or reject suggestions
 *
 * Features:
 * - Match suggestions based on email/phone
 * - Confidence score indicators
 * - One-click linking with optimistic updates
 * - Dismissible suggestions
 */

"use client";

import { useState, useEffect } from "react";
import { autoLinkCommunicationAction, getAutoLinkSuggestionsAction, type MatchSuggestion } from "@/actions/communications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { User, Briefcase, MapPin, Check, X, AlertCircle, Link2 } from "lucide-react";
import type { Communication } from "@/lib/queries/communications";

interface AutoLinkSuggestionsProps {
	communication: Communication;
	companyId?: string;
	onLinked?: () => void;
}

export function AutoLinkSuggestions({ communication, companyId, onLinked }: AutoLinkSuggestionsProps) {
	const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
	const [loading, setLoading] = useState(true);
	const [linking, setLinking] = useState<string | null>(null);
	const [dismissed, setDismissed] = useState<Set<string>>(new Set());

	// Fetch suggestions on mount
	useEffect(() => {
		async function fetchSuggestions() {
			if (!companyId) return;

			setLoading(true);
			try {
				const result = await getAutoLinkSuggestionsAction({
					communicationId: communication.id,
					companyId,
				});

				if (result.success && result.suggestions) {
					setSuggestions(result.suggestions);
				}
			} catch (error) {
				console.error("Failed to fetch suggestions:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchSuggestions();
	}, [communication.id, companyId]);

	// Don't show if already linked
	if (communication.customerId || communication.jobId || communication.propertyId) {
		return null;
	}

	// Filter out dismissed suggestions
	const activeSuggestions = suggestions.filter((s) => !dismissed.has(s.id));

	// Show loading state
	if (loading) {
		return (
			<Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2">
						<Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
						<CardTitle className="text-sm font-semibold">Looking for matches...</CardTitle>
					</div>
				</CardHeader>
			</Card>
		);
	}

	if (activeSuggestions.length === 0) {
		return null;
	}

	const handleAccept = async (suggestion: MatchSuggestion) => {
		setLinking(suggestion.id);

		try {
			const result = await autoLinkCommunicationAction({
				communicationId: communication.id,
				customerId: suggestion.type === "customer" ? suggestion.id : undefined,
				jobId: suggestion.type === "job" ? suggestion.id : undefined,
				propertyId: suggestion.type === "property" ? suggestion.id : undefined,
				linkConfidence: suggestion.confidence,
				linkMethod: suggestion.matchMethod,
			});

			if (result.success) {
				// Remove accepted suggestion and related ones
				setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
				onLinked?.();
			}
		} catch (error) {
			console.error("Failed to link communication:", error);
		} finally {
			setLinking(null);
		}
	};

	const handleDismiss = (suggestionId: string) => {
		setDismissed((prev) => new Set([...prev, suggestionId]));
	};

	const getTypeConfig = (type: MatchSuggestion["type"]) => {
		switch (type) {
			case "customer":
				return {
					icon: User,
					color: "text-blue-500",
					bg: "bg-blue-500/10",
					label: "Customer",
				};
			case "job":
				return {
					icon: Briefcase,
					color: "text-purple-500",
					bg: "bg-purple-500/10",
					label: "Job",
				};
			case "property":
				return {
					icon: MapPin,
					color: "text-green-500",
					bg: "bg-green-500/10",
					label: "Property",
				};
		}
	};

	const getConfidenceBadge = (confidence: number) => {
		if (confidence >= 0.9) {
			return (
				<Badge variant="default" className="gap-1">
					<Check className="h-3 w-3" />
					{Math.round(confidence * 100)}% match
				</Badge>
			);
		}
		if (confidence >= 0.7) {
			return (
				<Badge variant="secondary" className="gap-1">
					{Math.round(confidence * 100)}% match
				</Badge>
			);
		}
		return (
			<Badge variant="outline" className="gap-1">
				<AlertCircle className="h-3 w-3" />
				{Math.round(confidence * 100)}% match
			</Badge>
		);
	};

	return (
		<Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					<CardTitle className="text-sm font-semibold">Suggested Matches</CardTitle>
				</div>
				<CardDescription className="text-xs">
					We found {activeSuggestions.length} potential {activeSuggestions.length === 1 ? "match" : "matches"} for this communication
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2 pt-0">
				{activeSuggestions.map((suggestion, index) => {
					const typeConfig = getTypeConfig(suggestion.type);
					const TypeIcon = typeConfig.icon;
					const isLinking = linking === suggestion.id;

					return (
						<div key={suggestion.id}>
							{index > 0 && <Separator className="my-2" />}
							<div className="flex items-start gap-3">
								{/* Type Icon */}
								<div className={cn("rounded-full p-2", typeConfig.bg)}>
									<TypeIcon className={cn("h-4 w-4", typeConfig.color)} />
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0 space-y-1">
									<div className="flex items-center gap-2">
										<p className="font-medium text-sm truncate">{suggestion.name}</p>
										<Badge variant="outline" className="text-xs shrink-0">
											{typeConfig.label}
										</Badge>
									</div>

									{suggestion.subtitle && <p className="text-xs text-muted-foreground truncate">{suggestion.subtitle}</p>}

									<div className="flex items-center gap-2 flex-wrap">
										{getConfidenceBadge(suggestion.confidence)}
										{suggestion.matchDetails && (
											<span className="text-xs text-muted-foreground">
												{suggestion.matchDetails}
											</span>
										)}
									</div>
								</div>

								{/* Actions */}
								<div className="flex gap-1 shrink-0">
									<Button
										size="sm"
										variant="default"
										onClick={() => handleAccept(suggestion)}
										disabled={isLinking}
										className="h-8 gap-1"
									>
										<Check className="h-3 w-3" />
										Link
									</Button>
									<Button
										size="sm"
										variant="ghost"
										onClick={() => handleDismiss(suggestion.id)}
										disabled={isLinking}
										className="h-8 w-8 p-0"
									>
										<X className="h-3 w-3" />
									</Button>
								</div>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
