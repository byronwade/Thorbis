"use server";

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";
import { getCompanyCommunicationCounts, type CommunicationCounts } from "@/lib/queries/communications";

/**
 * Get communication counts by type for sidebar badges
 * Returns counts for all, email, sms, call, and voicemail
 */
export async function getCommunicationCountsAction(): Promise<{
	success: boolean;
	counts?: CommunicationCounts;
	error?: string;
}> {
	try {
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const counts = await getCompanyCommunicationCounts(companyId);
		return { success: true, counts };
	} catch (error) {
		console.error("Error getting communication counts:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Get comprehensive communication statistics
 */
export async function getCommunicationStatsAction(days: number = 30): Promise<{
	success: boolean;
	data?: {
		// Overview stats
		totalEmails: number;
		totalSms: number;
		totalCalls: number;
		unreadEmails: number;
		unreadSms: number;
		totalUnread: number;

		// Today's stats
		emailsToday: number;
		smsToday: number;
		callsToday: number;

		// Direction stats
		emailsInbound: number;
		emailsOutbound: number;
		smsInbound: number;
		smsOutbound: number;
		callsInbound: number;
		callsOutbound: number;

		// Time-based data for charts
		dailyStats: Array<{
			date: string;
			emails: number;
			sms: number;
			calls: number;
		}>;

		// Channel distribution
		channelDistribution: {
			email: number;
			sms: number;
			calls: number;
		};

		// Response time stats (for emails and SMS)
		avgResponseTime: number; // in minutes
		responseTimeData: Array<{
			date: string;
			avgResponseTime: number;
		}>;
		hourlyStats: Array<{
			hour: number;
			Emails: number;
			SMS: number;
			Calls: number;
		}>;
		directionData: Array<{
			name: string;
			Emails: number;
			SMS: number;
			Calls: number;
		}>;
		weeklyStats: Array<{
			week: string;
			Emails: number;
			SMS: number;
			Calls: number;
		}>;
		totalInbound: number;
		totalOutbound: number;
		readRate: number;
		peakHour: number;
		avgPerDay: number;
		responseRate: number;
		dayOfWeekStats: Array<{
			day: string;
			Emails: number;
			SMS: number;
			Calls: number;
		}>;
		unreadTrendData: Array<{
			date: string;
			"Unread Emails": number;
			"Unread SMS": number;
		}>;
		avgEmailResponseTime: number;
		avgSmsResponseTime: number;
		inboundOutboundTrend: Array<{
			date: string;
			Inbound: number;
			Outbound: number;
		}>;
		busiestDay: string;
		efficiencyScore: number;
		totalCallDuration: number;
		avgCallDuration: number;
	};
	error?: string;
}> {
	try {
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Database connection failed" };
		}

		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);
		const startDateISO = startDate.toISOString();

		// Get communications in the date range (limit to 10000 for performance)
		const { data: communications, error } = await supabase
			.from("communications")
			.select("id, type, direction, created_at, read_at, call_duration")
			.eq("company_id", companyId)
			.is("deleted_at", null)
			.gte("created_at", startDateISO)
			.order("created_at", { ascending: false })
			.limit(10000);

		if (error) {
			return { success: false, error: error.message };
		}

		const comms = communications || [];

		// ============================================================
		// SINGLE-PASS PROCESSING - Calculate ALL metrics in one loop
		// Performance: ~50x faster than multiple filter() calls
		// ============================================================

		// Pre-calculate date thresholds
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const todayISO = today.toISOString();

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
		const sevenDaysAgoISO = sevenDaysAgo.toISOString();

		const fourWeeksAgo = new Date();
		fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
		const fourWeeksAgoISO = fourWeeksAgo.toISOString();

		// Initialize all accumulators
		let totalEmails = 0;
		let totalSms = 0;
		let totalCalls = 0;
		let unreadEmails = 0;
		let unreadSms = 0;
		let emailsToday = 0;
		let smsToday = 0;
		let callsToday = 0;
		let emailsInbound = 0;
		let emailsOutbound = 0;
		let smsInbound = 0;
		let smsOutbound = 0;
		let callsInbound = 0;
		let callsOutbound = 0;
		let readCount = 0;
		let totalCallDuration = 0;
		let emailResponseTimeSum = 0;
		let emailResponseTimeCount = 0;
		let smsResponseTimeSum = 0;
		let smsResponseTimeCount = 0;
		let allResponseTimeSum = 0;
		let allResponseTimeCount = 0;

		// Maps for aggregations
		const dailyStatsMap = new Map<
			string,
			{ emails: number; sms: number; calls: number }
		>();
		const hourlyStatsMap = new Map<
			number,
			{ emails: number; sms: number; calls: number }
		>();
		const weeklyStatsMap = new Map<
			string,
			{ emails: number; sms: number; calls: number }
		>();
		const dayOfWeekStatsMap = new Map<
			number,
			{ emails: number; sms: number; calls: number }
		>();
		const unreadTrendMap = new Map<string, { emails: number; sms: number }>();
		const inboundByDate = new Map<string, number>();
		const outboundByDate = new Map<string, number>();
		const responseTimeMap = new Map<string, number[]>();

		// SINGLE PASS through all communications
		for (const comm of comms) {
			const createdAt = comm.created_at;
			const date = new Date(createdAt);
			const dateStr = createdAt.split("T")[0];
			const isEmail = comm.type === "email";
			const isSms = comm.type === "sms";
			const isCall = comm.type === "phone" || comm.type === "call";
			const isInbound = comm.direction === "inbound";
			const isOutbound = comm.direction === "outbound";
			const isRead = !!comm.read_at;
			const isToday = createdAt >= todayISO;
			const isLast7Days = createdAt >= sevenDaysAgoISO;
			const isLast4Weeks = createdAt >= fourWeeksAgoISO;

			// Count totals by type
			if (isEmail) totalEmails++;
			else if (isSms) totalSms++;
			else if (isCall) totalCalls++;

			// Count unread (inbound only)
			if (isInbound && !isRead) {
				if (isEmail) unreadEmails++;
				else if (isSms) unreadSms++;
			}

			// Count today's messages
			if (isToday) {
				if (isEmail) emailsToday++;
				else if (isSms) smsToday++;
				else if (isCall) callsToday++;
			}

			// Count by direction
			if (isEmail) {
				if (isInbound) emailsInbound++;
				else if (isOutbound) emailsOutbound++;
			} else if (isSms) {
				if (isInbound) smsInbound++;
				else if (isOutbound) smsOutbound++;
			} else if (isCall) {
				if (isInbound) callsInbound++;
				else if (isOutbound) callsOutbound++;
			}

			// Count read messages
			if (isRead) readCount++;

			// Accumulate call duration
			if (isCall && comm.call_duration) {
				totalCallDuration += comm.call_duration;
			}

			// Calculate response times for emails/sms
			if (isRead && (isEmail || isSms) && comm.read_at) {
				const created = date.getTime();
				const read = new Date(comm.read_at).getTime();
				const minutes = (read - created) / (1000 * 60);

				if (minutes > 0 && minutes < 10080) {
					// Less than 7 days
					allResponseTimeSum += minutes;
					allResponseTimeCount++;

					// Track response times by date
					const existing = responseTimeMap.get(dateStr) || [];
					existing.push(minutes);
					responseTimeMap.set(dateStr, existing);

					// Track by channel (inbound only for meaningful response times)
					if (isInbound) {
						if (isEmail) {
							emailResponseTimeSum += minutes;
							emailResponseTimeCount++;
						} else if (isSms) {
							smsResponseTimeSum += minutes;
							smsResponseTimeCount++;
						}
					}
				}
			}

			// Daily stats aggregation
			const dailyStats = dailyStatsMap.get(dateStr) || {
				emails: 0,
				sms: 0,
				calls: 0,
			};
			if (isEmail) dailyStats.emails++;
			else if (isSms) dailyStats.sms++;
			else if (isCall) dailyStats.calls++;
			dailyStatsMap.set(dateStr, dailyStats);

			// Hourly stats (last 7 days only)
			if (isLast7Days) {
				const hour = date.getHours();
				const hourlyStats = hourlyStatsMap.get(hour) || {
					emails: 0,
					sms: 0,
					calls: 0,
				};
				if (isEmail) hourlyStats.emails++;
				else if (isSms) hourlyStats.sms++;
				else if (isCall) hourlyStats.calls++;
				hourlyStatsMap.set(hour, hourlyStats);
			}

			// Weekly stats (last 4 weeks only)
			if (isLast4Weeks) {
				const weekStart = new Date(date);
				weekStart.setDate(date.getDate() - date.getDay());
				const weekKey = weekStart.toISOString().split("T")[0];
				const weekStats = weeklyStatsMap.get(weekKey) || {
					emails: 0,
					sms: 0,
					calls: 0,
				};
				if (isEmail) weekStats.emails++;
				else if (isSms) weekStats.sms++;
				else if (isCall) weekStats.calls++;
				weeklyStatsMap.set(weekKey, weekStats);
			}

			// Day of week stats
			const dayOfWeek = date.getDay();
			const dowStats = dayOfWeekStatsMap.get(dayOfWeek) || {
				emails: 0,
				sms: 0,
				calls: 0,
			};
			if (isEmail) dowStats.emails++;
			else if (isSms) dowStats.sms++;
			else if (isCall) dowStats.calls++;
			dayOfWeekStatsMap.set(dayOfWeek, dowStats);

			// Unread trend (inbound emails/sms only)
			if ((isEmail || isSms) && isInbound && !isRead) {
				const unreadStats = unreadTrendMap.get(dateStr) || {
					emails: 0,
					sms: 0,
				};
				if (isEmail) unreadStats.emails++;
				else if (isSms) unreadStats.sms++;
				unreadTrendMap.set(dateStr, unreadStats);
			}

			// Inbound/outbound by date
			if (isInbound) {
				inboundByDate.set(dateStr, (inboundByDate.get(dateStr) || 0) + 1);
			} else if (isOutbound) {
				outboundByDate.set(dateStr, (outboundByDate.get(dateStr) || 0) + 1);
			}
		}

		// ============================================================
		// POST-PROCESSING - Build final data structures
		// ============================================================

		// Convert daily stats to array with filled dates
		const dailyStats: Array<{
			date: string;
			emails: number;
			sms: number;
			calls: number;
		}> = [];
		for (let i = 0; i < days; i++) {
			const date = new Date(startDate);
			date.setDate(date.getDate() + i);
			const dateStr = date.toISOString().split("T")[0];
			const stats = dailyStatsMap.get(dateStr) || {
				emails: 0,
				sms: 0,
				calls: 0,
			};
			dailyStats.push({ date: dateStr, ...stats });
		}

		// Channel distribution
		const channelDistribution = {
			email: totalEmails,
			sms: totalSms,
			calls: totalCalls,
		};

		// Calculate average response times
		const avgResponseTime =
			allResponseTimeCount > 0 ? allResponseTimeSum / allResponseTimeCount : 0;
		const avgEmailResponseTime =
			emailResponseTimeCount > 0
				? emailResponseTimeSum / emailResponseTimeCount
				: 0;
		const avgSmsResponseTime =
			smsResponseTimeCount > 0 ? smsResponseTimeSum / smsResponseTimeCount : 0;

		// Response time data by date
		const responseTimeData: Array<{ date: string; avgResponseTime: number }> =
			[];
		for (let i = 0; i < days; i++) {
			const date = new Date(startDate);
			date.setDate(date.getDate() + i);
			const dateStr = date.toISOString().split("T")[0];
			const times = responseTimeMap.get(dateStr) || [];
			const avg =
				times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
			responseTimeData.push({ date: dateStr, avgResponseTime: avg });
		}

		// Hourly stats array
		const hourlyStats = Array.from({ length: 24 }, (_, i) => {
			const stats = hourlyStatsMap.get(i) || { emails: 0, sms: 0, calls: 0 };
			return {
				hour: i,
				Emails: stats.emails,
				SMS: stats.sms,
				Calls: stats.calls,
			};
		});

		// Direction comparison data
		const directionData = [
			{
				name: "Inbound",
				Emails: emailsInbound,
				SMS: smsInbound,
				Calls: callsInbound,
			},
			{
				name: "Outbound",
				Emails: emailsOutbound,
				SMS: smsOutbound,
				Calls: callsOutbound,
			},
		];

		// Weekly stats array
		const weeklyStats = Array.from(weeklyStatsMap.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([date, stats]) => ({
				week: new Date(date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
				Emails: stats.emails,
				SMS: stats.sms,
				Calls: stats.calls,
			}));

		// Calculated metrics
		const totalInbound = emailsInbound + smsInbound + callsInbound;
		const totalOutbound = emailsOutbound + smsOutbound + callsOutbound;
		const totalCommunications = totalEmails + totalSms + totalCalls;
		const readRate =
			totalCommunications > 0 ? (readCount / totalCommunications) * 100 : 0;

		// Peak hour
		const peakHour = hourlyStats.reduce(
			(max, hour) =>
				hour.Emails + hour.SMS + hour.Calls > max.Emails + max.SMS + max.Calls
					? hour
					: max,
			hourlyStats[0],
		);

		// Average per day
		const avgPerDay = days > 0 ? totalCommunications / days : 0;

		// Response rate
		const responseRate =
			totalInbound > 0 ? (totalOutbound / totalInbound) * 100 : 0;

		// Day of week stats array
		const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const dayOfWeekStats = Array.from({ length: 7 }, (_, i) => {
			const stats = dayOfWeekStatsMap.get(i) || { emails: 0, sms: 0, calls: 0 };
			return {
				day: dayNames[i],
				Emails: stats.emails,
				SMS: stats.sms,
				Calls: stats.calls,
			};
		});

		// Unread trend array
		const unreadTrendData: Array<{
			date: string;
			"Unread Emails": number;
			"Unread SMS": number;
		}> = [];
		for (let i = 0; i < days; i++) {
			const date = new Date(startDate);
			date.setDate(date.getDate() + i);
			const dateStr = date.toISOString().split("T")[0];
			const stats = unreadTrendMap.get(dateStr) || { emails: 0, sms: 0 };
			unreadTrendData.push({
				date: dateStr,
				"Unread Emails": stats.emails,
				"Unread SMS": stats.sms,
			});
		}

		// Inbound/outbound trend array
		const inboundOutboundTrend: Array<{
			date: string;
			Inbound: number;
			Outbound: number;
		}> = [];
		for (let i = 0; i < days; i++) {
			const date = new Date(startDate);
			date.setDate(date.getDate() + i);
			const dateStr = date.toISOString().split("T")[0];
			inboundOutboundTrend.push({
				date: dateStr,
				Inbound: inboundByDate.get(dateStr) || 0,
				Outbound: outboundByDate.get(dateStr) || 0,
			});
		}

		// Busiest day
		const busiestDay = dayOfWeekStats.reduce(
			(max, day) =>
				day.Emails + day.SMS + day.Calls > max.Emails + max.SMS + max.Calls
					? day
					: max,
			dayOfWeekStats[0],
		);

		// Efficiency score
		const efficiencyScore =
			responseRate > 0 && avgResponseTime > 0
				? responseRate / (avgResponseTime / 60)
				: 0;

		// Average call duration
		const avgCallDuration = totalCalls > 0 ? totalCallDuration / totalCalls : 0;

		return {
			success: true,
			data: {
				totalEmails,
				totalSms,
				totalCalls,
				unreadEmails,
				unreadSms,
				totalUnread: unreadEmails + unreadSms,
				emailsToday,
				smsToday,
				callsToday,
				emailsInbound,
				emailsOutbound,
				smsInbound,
				smsOutbound,
				callsInbound,
				callsOutbound,
				dailyStats,
				channelDistribution: channelDistribution,
				avgResponseTime,
				responseTimeData,
				hourlyStats,
				directionData,
				weeklyStats,
				totalInbound,
				totalOutbound,
				readRate,
				peakHour: peakHour.hour,
				avgPerDay,
				responseRate,
				dayOfWeekStats,
				unreadTrendData,
				avgEmailResponseTime,
				avgSmsResponseTime,
				inboundOutboundTrend,
				busiestDay: busiestDay.day,
				efficiencyScore,
				totalCallDuration,
				avgCallDuration,
			},
		};
	} catch (error) {
		console.error("Error getting communication stats:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
