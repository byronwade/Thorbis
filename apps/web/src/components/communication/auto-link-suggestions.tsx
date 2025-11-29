/**
 * Auto-Link Suggestions Component
 *
 * Automatically links communications to customers/jobs/properties when high-confidence
 * matches are found (>= 95% confidence). Works silently in the background - no UI shown.
 *
 * Features:
 * - Automatic linking for high-confidence matches (>= 95%)
 * - Silent operation - no dialogs or alerts
 * - Customer name appears via CustomerInfoPill in communication header
 * - Users can unlink/link different customers via customer info component
 */

"use client";

import { useEffect, useState } from "react";
import {
	autoLinkCommunicationAction,
	getAutoLinkSuggestionsAction,
	type MatchSuggestion,
} from "@/actions/communications";
import type { Communication } from "@/lib/queries/communications";

interface AutoLinkSuggestionsProps {
	communication: Communication;
	companyId?: string;
	onLinked?: () => void;
}

export function AutoLinkSuggestions({
	communication,
	companyId,
	onLinked,
}: AutoLinkSuggestionsProps) {
	const [loading, setLoading] = useState(true);

	// Helper function to find the best high-confidence match
	const findBestHighConfidenceMatch = (
		suggestions: MatchSuggestion[],
	): MatchSuggestion | null => {
		const highConfidenceMatches = suggestions.filter(
			(s) => s.confidence >= 0.95,
		);

		if (highConfidenceMatches.length === 0) {
			return null;
		}

		// Sort by: 1) confidence (desc), 2) customer type preferred, 3) first match
		return highConfidenceMatches.sort((a, b) => {
			// First, sort by confidence (descending)
			if (b.confidence !== a.confidence) {
				return b.confidence - a.confidence;
			}
			// Then, prefer customer type
			if (a.type === "customer" && b.type !== "customer") {
				return -1;
			}
			if (b.type === "customer" && a.type !== "customer") {
				return 1;
			}
			// Otherwise, keep original order
			return 0;
		})[0];
	};

	// Fetch suggestions on mount and auto-link high-confidence matches
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
					// Check for high-confidence match and auto-link silently
					const bestMatch = findBestHighConfidenceMatch(
						result.suggestions,
					);

					if (bestMatch) {
						try {
							const linkResult = await autoLinkCommunicationAction({
								communicationId: communication.id,
								customerId:
									bestMatch.type === "customer"
										? bestMatch.id
										: undefined,
								jobId: bestMatch.type === "job" ? bestMatch.id : undefined,
								propertyId:
									bestMatch.type === "property"
										? bestMatch.id
										: undefined,
								linkConfidence: bestMatch.confidence,
								linkMethod: bestMatch.matchMethod,
							});

							if (linkResult.success) {
								// Successfully auto-linked, refresh communication list
								// Customer name will appear via CustomerInfoPill component
								onLinked?.();
							}
						} catch (error) {
							console.error("Failed to auto-link communication:", error);
							// Silently fail - user can manually link via customer info component
						}
					}
				}
			} catch (error) {
				console.error("Failed to fetch suggestions:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchSuggestions();
	}, [communication.id, companyId, onLinked]);

	// Component renders nothing - works silently in background
	// Customer name will appear via CustomerInfoPill in communication header
	// Users can hover over customer info to unlink/link a different customer if needed
	return null;
}
