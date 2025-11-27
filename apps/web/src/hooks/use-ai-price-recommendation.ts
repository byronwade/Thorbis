/**
 * useAIPriceRecommendation Hook
 *
 * Custom hook for AI-powered price recommendations.
 * Suggests optimal pricing based on service type, industry, and market data.
 */

import { useCallback, useState } from "react";

export type PriceRecommendation = {
	suggestedPrice: number;
	priceRange: {
		low: number;
		high: number;
	};
	confidence: number;
	reasoning: string;
	marketPosition: "budget" | "mid-market" | "premium";
};

export type PriceRecommendationContext = {
	serviceName: string;
	industry?: string;
	duration?: string | number;
	location?: string;
	existingPrices?: { name: string; price: string }[];
};

export type AIPriceRecommendationResult = {
	recommendation: PriceRecommendation | null;
	isLoading: boolean;
	error: string | null;
	getRecommendation: (
		context: PriceRecommendationContext,
	) => Promise<PriceRecommendation | null>;
	clear: () => void;
};

export function useAIPriceRecommendation(): AIPriceRecommendationResult {
	const [recommendation, setRecommendation] =
		useState<PriceRecommendation | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getRecommendation = useCallback(
		async (
			context: PriceRecommendationContext,
		): Promise<PriceRecommendation | null> => {
			if (!context.serviceName?.trim()) {
				setError("Service name is required for price recommendation");
				return null;
			}

			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/ai/price-recommendation", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(context),
				});

				if (!response.ok) {
					throw new Error("Failed to get price recommendation");
				}

				const data = await response.json();
				setRecommendation(data);
				return data;
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: "Failed to get price recommendation";
				setError(message);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	const clear = useCallback(() => {
		setRecommendation(null);
		setError(null);
	}, []);

	return {
		recommendation,
		isLoading,
		error,
		getRecommendation,
		clear,
	};
}
