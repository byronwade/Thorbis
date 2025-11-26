/**
 * PageSpeed Performance API Route
 *
 * Monitors page performance using Google PageSpeed Insights API.
 *
 * POST /api/performance
 * - Analyze URL performance
 * - Get Core Web Vitals
 * - Check performance thresholds
 *
 * GET /api/performance?url=...
 * - Quick performance check
 *
 * Request body (POST):
 * - url: URL to analyze
 * - strategy: "mobile" | "desktop"
 * - action: "analyze" | "vitals" | "check" | "compare" | "opportunities"
 * - categories: Array of categories to analyze
 */

import { createClient } from "@stratos/auth/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	type AnalysisStrategy,
	type AuditCategory,
	googlePageSpeedService,
} from "@/lib/services/google-pagespeed-service";

// Request validation schemas
const PerformanceRequestSchema = z.object({
	url: z.string().url(),
	strategy: z.enum(["mobile", "desktop"]).optional().default("mobile"),
	action: z
		.enum(["analyze", "vitals", "check", "compare", "opportunities"])
		.optional()
		.default("analyze"),
	categories: z
		.array(
			z.enum(["performance", "accessibility", "best-practices", "seo", "pwa"]),
		)
		.optional(),
	limit: z.number().min(1).max(20).optional(),
});

const MonitorRequestSchema = z.object({
	urls: z.array(z.string().url()).min(1).max(10),
	baseline: z.record(z.number()).optional(),
});

export async function POST(request: NextRequest) {
	try {
		// Authenticate user
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if service is configured
		if (!googlePageSpeedService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"PageSpeed service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const body = await request.json();
		const { searchParams } = new URL(request.url);
		const actionParam = searchParams.get("action");

		// Handle monitoring request
		if (actionParam === "monitor") {
			const monitorData = MonitorRequestSchema.parse(body);
			const results = await googlePageSpeedService.monitorUrls(
				monitorData.urls,
				monitorData.baseline,
			);

			return NextResponse.json({
				success: true,
				data: {
					results,
					summary: {
						totalUrls: results.length,
						regressions: results.filter((r) => r.regression).length,
						averageScore: Math.round(
							results.reduce((sum, r) => sum + r.score, 0) / results.length,
						),
					},
				},
			});
		}

		const validatedData = PerformanceRequestSchema.parse(body);

		switch (validatedData.action) {
			case "analyze": {
				const report = await googlePageSpeedService.analyzeUrl(
					validatedData.url,
					validatedData.strategy as AnalysisStrategy,
					validatedData.categories as AuditCategory[] | undefined,
				);

				return NextResponse.json({
					success: true,
					data: {
						...report,
						fetchTime: report.fetchTime.toISOString(),
					},
				});
			}

			case "vitals": {
				const vitals = await googlePageSpeedService.getCoreWebVitals(
					validatedData.url,
					validatedData.strategy as AnalysisStrategy,
				);

				return NextResponse.json({
					success: true,
					data: vitals,
				});
			}

			case "check": {
				const check = await googlePageSpeedService.checkCoreWebVitalsThresholds(
					validatedData.url,
				);

				return NextResponse.json({
					success: true,
					data: check,
				});
			}

			case "compare": {
				const comparison =
					await googlePageSpeedService.analyzeUrlBothStrategies(
						validatedData.url,
					);

				return NextResponse.json({
					success: true,
					data: {
						mobile: {
							...comparison.mobile,
							fetchTime: comparison.mobile.fetchTime.toISOString(),
						},
						desktop: {
							...comparison.desktop,
							fetchTime: comparison.desktop.fetchTime.toISOString(),
						},
						comparison: comparison.comparison,
					},
				});
			}

			case "opportunities": {
				const opportunities = await googlePageSpeedService.getTopOpportunities(
					validatedData.url,
					validatedData.limit,
				);

				return NextResponse.json({
					success: true,
					data: opportunities,
				});
			}

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
	} catch (error) {
		console.error("PageSpeed analysis error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					error: "Invalid request data",
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				error: "Failed to analyze performance",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		// Authenticate user
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if service is configured
		if (!googlePageSpeedService.isConfigured()) {
			return NextResponse.json(
				{
					error:
						"PageSpeed service is not configured. Set GOOGLE_API_KEY environment variable.",
				},
				{ status: 503 },
			);
		}

		const { searchParams } = new URL(request.url);
		const url = searchParams.get("url");
		const strategy =
			(searchParams.get("strategy") as AnalysisStrategy) || "mobile";

		if (!url) {
			return NextResponse.json(
				{ error: "URL parameter required" },
				{ status: 400 },
			);
		}

		// Validate URL
		try {
			new URL(url);
		} catch {
			return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
		}

		// Quick performance check
		const vitals = await googlePageSpeedService.getCoreWebVitals(url, strategy);
		const check =
			await googlePageSpeedService.checkCoreWebVitalsThresholds(url);

		return NextResponse.json({
			success: true,
			data: {
				url,
				strategy,
				vitals,
				passesAllThresholds: check.passesAll,
				thresholdDetails: {
					lcp: check.lcp,
					fid: check.fid,
					cls: check.cls,
				},
			},
		});
	} catch (error) {
		console.error("PageSpeed quick check error:", error);

		return NextResponse.json(
			{
				error: "Failed to check performance",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
