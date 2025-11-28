/**
 * AI Feedback Service - User feedback collection and RLHF/RLUF patterns
 * Based on industry best practices from OpenAI, Anthropic, and Langfuse
 */

import crypto from "crypto";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export type FeedbackType =
	| "thumbs_up"
	| "thumbs_down"
	| "rating"
	| "correction"
	| "flag";

export type FeedbackCategory =
	| "incorrect_information"
	| "unhelpful_response"
	| "wrong_action"
	| "privacy_concern"
	| "too_slow"
	| "too_verbose"
	| "missing_context"
	| "great_response"
	| "accurate"
	| "helpful"
	| "other";

export type FeedbackStatus = "new" | "reviewed" | "actioned" | "dismissed";

export interface FeedbackSubmission {
	messageId: string;
	chatId: string;
	feedbackType: FeedbackType;
	rating?: number;
	isPositive: boolean;
	categories?: FeedbackCategory[];
	userComment?: string;
	correctedResponse?: string;
	expectedBehavior?: string;
	toolsUsed?: string[];
	responseTimeMs?: number;
	tokenCount?: number;
}

export interface FeedbackResponse {
	id: string;
	success: boolean;
	message: string;
}

/**
 * Submit feedback for an AI message
 */
async function submitFeedback(
	companyId: string,
	userId: string,
	feedback: FeedbackSubmission,
): Promise<FeedbackResponse> {
	const supabase = createServiceSupabaseClient();
	const feedbackId = crypto.randomUUID();

	const { error } = await supabase.from("ai_message_feedback").insert({
		id: feedbackId,
		company_id: companyId,
		user_id: userId,
		message_id: feedback.messageId,
		chat_id: feedback.chatId,
		feedback_type: feedback.feedbackType,
		rating: feedback.rating,
		is_positive: feedback.isPositive,
		feedback_categories: feedback.categories || [],
		user_comment: feedback.userComment,
		corrected_response: feedback.correctedResponse,
		expected_behavior: feedback.expectedBehavior,
		tools_used: feedback.toolsUsed || [],
		response_time_ms: feedback.responseTimeMs,
		token_count: feedback.tokenCount,
		status: "new",
		created_at: new Date().toISOString(),
	});

	if (error) {
		console.error("Failed to submit feedback:", error);
		return { id: "", success: false, message: "Failed to submit feedback" };
	}

	return {
		id: feedbackId,
		success: true,
		message: "Feedback submitted successfully",
	};
}

/**
 * Submit quick thumbs up/down feedback
 */
async function submitQuickFeedback(
	companyId: string,
	userId: string,
	messageId: string,
	chatId: string,
	isPositive: boolean,
): Promise<FeedbackResponse> {
	return submitFeedback(companyId, userId, {
		messageId,
		chatId,
		feedbackType: isPositive ? "thumbs_up" : "thumbs_down",
		isPositive,
	});
}

/**
 * Submit a correction for an AI response
 */
async function submitCorrection(
	companyId: string,
	userId: string,
	messageId: string,
	chatId: string,
	correction: {
		correctedResponse: string;
		categories?: FeedbackCategory[];
		comment?: string;
	},
): Promise<FeedbackResponse> {
	return submitFeedback(companyId, userId, {
		messageId,
		chatId,
		feedbackType: "correction",
		isPositive: false,
		correctedResponse: correction.correctedResponse,
		categories: correction.categories,
		userComment: correction.comment,
	});
}

/**
 * Flag a response for review
 */
async function flagResponse(
	companyId: string,
	userId: string,
	messageId: string,
	chatId: string,
	reason: FeedbackCategory,
	comment?: string,
): Promise<FeedbackResponse> {
	return submitFeedback(companyId, userId, {
		messageId,
		chatId,
		feedbackType: "flag",
		isPositive: false,
		categories: [reason],
		userComment: comment,
	});
}

/**
 * Get feedback for a specific message
 */
async function getMessageFeedback(
	companyId: string,
	messageId: string,
): Promise<{
	totalFeedback: number;
	positiveCount: number;
	negativeCount: number;
	averageRating: number | null;
	categories: Record<string, number>;
	hasCorrection: boolean;
}> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_message_feedback")
		.select("is_positive, rating, feedback_categories, corrected_response")
		.eq("company_id", companyId)
		.eq("message_id", messageId);

	if (error || !data || data.length === 0) {
		return {
			totalFeedback: 0,
			positiveCount: 0,
			negativeCount: 0,
			averageRating: null,
			categories: {},
			hasCorrection: false,
		};
	}

	const positiveCount = data.filter((f) => f.is_positive).length;
	const ratings = data
		.filter((f) => f.rating !== null)
		.map((f) => f.rating as number);
	const averageRating =
		ratings.length > 0
			? ratings.reduce((a, b) => a + b, 0) / ratings.length
			: null;

	const categories: Record<string, number> = {};
	for (const feedback of data) {
		const cats = feedback.feedback_categories as string[] | null;
		if (cats) {
			for (const cat of cats) {
				categories[cat] = (categories[cat] || 0) + 1;
			}
		}
	}

	return {
		totalFeedback: data.length,
		positiveCount,
		negativeCount: data.length - positiveCount,
		averageRating,
		categories,
		hasCorrection: data.some((f) => f.corrected_response !== null),
	};
}

/**
 * Get feedback summary for a chat session
 */
async function getChatFeedbackSummary(
	companyId: string,
	chatId: string,
): Promise<{
	totalMessages: number;
	feedbackCount: number;
	positiveRate: number;
	topIssues: Array<{ category: string; count: number }>;
	correctionsCount: number;
}> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_message_feedback")
		.select("is_positive, feedback_categories, corrected_response")
		.eq("company_id", companyId)
		.eq("chat_id", chatId);

	if (error || !data || data.length === 0) {
		return {
			totalMessages: 0,
			feedbackCount: 0,
			positiveRate: 0,
			topIssues: [],
			correctionsCount: 0,
		};
	}

	const positiveCount = data.filter((f) => f.is_positive).length;
	const correctionsCount = data.filter(
		(f) => f.corrected_response !== null,
	).length;

	// Count negative categories
	const categoryCount: Record<string, number> = {};
	for (const feedback of data) {
		if (!feedback.is_positive) {
			const cats = feedback.feedback_categories as string[] | null;
			if (cats) {
				for (const cat of cats) {
					categoryCount[cat] = (categoryCount[cat] || 0) + 1;
				}
			}
		}
	}

	const topIssues = Object.entries(categoryCount)
		.map(([category, count]) => ({ category, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	return {
		totalMessages: data.length,
		feedbackCount: data.length,
		positiveRate: data.length > 0 ? (positiveCount / data.length) * 100 : 0,
		topIssues,
		correctionsCount,
	};
}

/**
 * Get company-wide feedback analytics
 */
async function getCompanyFeedbackAnalytics(
	companyId: string,
	dateRange: { start: Date; end: Date },
): Promise<{
	totalFeedback: number;
	positiveRate: number;
	negativeRate: number;
	averageRating: number | null;
	topPositiveCategories: Array<{ category: string; count: number }>;
	topNegativeCategories: Array<{ category: string; count: number }>;
	feedbackByDay: Array<{ date: string; positive: number; negative: number }>;
	correctionRate: number;
	flaggedCount: number;
}> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_message_feedback")
		.select("*")
		.eq("company_id", companyId)
		.gte("created_at", dateRange.start.toISOString())
		.lte("created_at", dateRange.end.toISOString())
		.order("created_at", { ascending: true });

	if (error || !data || data.length === 0) {
		return {
			totalFeedback: 0,
			positiveRate: 0,
			negativeRate: 0,
			averageRating: null,
			topPositiveCategories: [],
			topNegativeCategories: [],
			feedbackByDay: [],
			correctionRate: 0,
			flaggedCount: 0,
		};
	}

	const positiveCount = data.filter((f) => f.is_positive).length;
	const ratings = data
		.filter((f) => f.rating !== null)
		.map((f) => f.rating as number);
	const averageRating =
		ratings.length > 0
			? ratings.reduce((a, b) => a + b, 0) / ratings.length
			: null;

	// Count categories separately for positive and negative
	const positiveCats: Record<string, number> = {};
	const negativeCats: Record<string, number> = {};

	for (const feedback of data) {
		const cats = feedback.feedback_categories as string[] | null;
		if (cats) {
			const target = feedback.is_positive ? positiveCats : negativeCats;
			for (const cat of cats) {
				target[cat] = (target[cat] || 0) + 1;
			}
		}
	}

	// Group by day
	const byDay: Record<string, { positive: number; negative: number }> = {};
	for (const feedback of data) {
		const date = new Date(feedback.created_at as string)
			.toISOString()
			.split("T")[0];
		if (!byDay[date]) {
			byDay[date] = { positive: 0, negative: 0 };
		}
		if (feedback.is_positive) {
			byDay[date].positive++;
		} else {
			byDay[date].negative++;
		}
	}

	const correctionsCount = data.filter(
		(f) => f.corrected_response !== null,
	).length;
	const flaggedCount = data.filter((f) => f.feedback_type === "flag").length;

	return {
		totalFeedback: data.length,
		positiveRate: (positiveCount / data.length) * 100,
		negativeRate: ((data.length - positiveCount) / data.length) * 100,
		averageRating,
		topPositiveCategories: Object.entries(positiveCats)
			.map(([category, count]) => ({ category, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5),
		topNegativeCategories: Object.entries(negativeCats)
			.map(([category, count]) => ({ category, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5),
		feedbackByDay: Object.entries(byDay).map(([date, counts]) => ({
			date,
			positive: counts.positive,
			negative: counts.negative,
		})),
		correctionRate:
			data.length > 0 ? (correctionsCount / data.length) * 100 : 0,
		flaggedCount,
	};
}

/**
 * Get feedback items that need review (for admin dashboard)
 */
async function getPendingFeedbackReview(
	companyId: string,
	options?: {
		limit?: number;
		feedbackType?: FeedbackType;
		onlyFlagged?: boolean;
		onlyCorrections?: boolean;
	},
): Promise<
	Array<{
		id: string;
		messageId: string;
		chatId: string;
		userId: string;
		feedbackType: string;
		isPositive: boolean;
		categories: string[];
		userComment: string | null;
		correctedResponse: string | null;
		status: string;
		createdAt: string;
	}>
> {
	const supabase = createServiceSupabaseClient();
	const limit = options?.limit || 50;

	let query = supabase
		.from("ai_message_feedback")
		.select("*")
		.eq("company_id", companyId)
		.eq("status", "new")
		.order("created_at", { ascending: false })
		.limit(limit);

	if (options?.feedbackType) {
		query = query.eq("feedback_type", options.feedbackType);
	}

	if (options?.onlyFlagged) {
		query = query.eq("feedback_type", "flag");
	}

	if (options?.onlyCorrections) {
		query = query.not("corrected_response", "is", null);
	}

	const { data, error } = await query;

	if (error) {
		console.error("Failed to get pending feedback:", error);
		return [];
	}

	return (data || []).map((f) => ({
		id: f.id,
		messageId: f.message_id,
		chatId: f.chat_id,
		userId: f.user_id,
		feedbackType: f.feedback_type,
		isPositive: f.is_positive,
		categories: f.feedback_categories as string[],
		userComment: f.user_comment,
		correctedResponse: f.corrected_response,
		status: f.status,
		createdAt: f.created_at as string,
	}));
}

/**
 * Update feedback status (mark as reviewed, actioned, etc.)
 */
async function updateFeedbackStatus(
	companyId: string,
	feedbackId: string,
	status: FeedbackStatus,
	reviewerNotes?: string,
): Promise<boolean> {
	const supabase = createServiceSupabaseClient();

	const { error } = await supabase
		.from("ai_message_feedback")
		.update({
			status,
			reviewed_at: new Date().toISOString(),
			reviewer_notes: reviewerNotes,
		})
		.eq("id", feedbackId)
		.eq("company_id", companyId);

	if (error) {
		console.error("Failed to update feedback status:", error);
		return false;
	}

	return true;
}

/**
 * Get corrections for training/fine-tuning purposes (RLHF data export)
 */
async function exportCorrectionsForTraining(
	companyId: string,
	options?: { since?: Date; limit?: number },
): Promise<
	Array<{
		originalMessageId: string;
		correctedResponse: string;
		categories: string[];
		expectedBehavior: string | null;
		createdAt: string;
	}>
> {
	const supabase = createServiceSupabaseClient();

	let query = supabase
		.from("ai_message_feedback")
		.select(
			"message_id, corrected_response, feedback_categories, expected_behavior, created_at",
		)
		.eq("company_id", companyId)
		.not("corrected_response", "is", null)
		.order("created_at", { ascending: false });

	if (options?.since) {
		query = query.gte("created_at", options.since.toISOString());
	}

	if (options?.limit) {
		query = query.limit(options.limit);
	}

	const { data, error } = await query;

	if (error) {
		console.error("Failed to export corrections:", error);
		return [];
	}

	return (data || []).map((c) => ({
		originalMessageId: c.message_id,
		correctedResponse: c.corrected_response as string,
		categories: c.feedback_categories as string[],
		expectedBehavior: c.expected_behavior,
		createdAt: c.created_at as string,
	}));
}
