"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";

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

    // Calculate overview stats
    const totalEmails = comms.filter((c) => c.type === "email").length;
    const totalSms = comms.filter((c) => c.type === "sms").length;
    const totalCalls = comms.filter((c) => c.type === "phone" || c.type === "call").length;

    const unreadEmails = comms.filter(
      (c) => c.type === "email" && c.direction === "inbound" && !c.read_at
    ).length;
    const unreadSms = comms.filter(
      (c) => c.type === "sms" && c.direction === "inbound" && !c.read_at
    ).length;

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();
    const emailsToday = comms.filter(
      (c) => c.type === "email" && c.created_at >= todayISO
    ).length;
    const smsToday = comms.filter(
      (c) => c.type === "sms" && c.created_at >= todayISO
    ).length;
    const callsToday = comms.filter(
      (c) => (c.type === "phone" || c.type === "call") && c.created_at >= todayISO
    ).length;

    // Direction stats
    const emailsInbound = comms.filter(
      (c) => c.type === "email" && c.direction === "inbound"
    ).length;
    const emailsOutbound = comms.filter(
      (c) => c.type === "email" && c.direction === "outbound"
    ).length;
    const smsInbound = comms.filter(
      (c) => c.type === "sms" && c.direction === "inbound"
    ).length;
    const smsOutbound = comms.filter(
      (c) => c.type === "sms" && c.direction === "outbound"
    ).length;
    const callsInbound = comms.filter(
      (c) => (c.type === "phone" || c.type === "call") && c.direction === "inbound"
    ).length;
    const callsOutbound = comms.filter(
      (c) => (c.type === "phone" || c.type === "call") && c.direction === "outbound"
    ).length;

    // Daily stats for charts
    const dailyStatsMap = new Map<string, { emails: number; sms: number; calls: number }>();
    
    comms.forEach((comm) => {
      const date = new Date(comm.created_at).toISOString().split("T")[0];
      const existing = dailyStatsMap.get(date) || { emails: 0, sms: 0, calls: 0 };
      
      if (comm.type === "email") {
        existing.emails++;
      } else if (comm.type === "sms") {
        existing.sms++;
      } else if (comm.type === "phone" || comm.type === "call") {
        existing.calls++;
      }
      
      dailyStatsMap.set(date, existing);
    });

    // Convert to array and fill missing dates
    const dailyStats: Array<{ date: string; emails: number; sms: number; calls: number }> = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const stats = dailyStatsMap.get(dateStr) || { emails: 0, sms: 0, calls: 0 };
      dailyStats.push({
        date: dateStr,
        ...stats,
      });
    }

    // Channel distribution
    const channelDistribution = {
      email: totalEmails,
      sms: totalSms,
      calls: totalCalls,
    };

    // Response time calculation (for emails and SMS)
    // This is a simplified version - in production you'd want to match inbound/outbound pairs
    const responseTimes: number[] = [];
    const responseTimeMap = new Map<string, number[]>();

    // Group by date for response time trends
    comms.forEach((comm) => {
      if (comm.read_at && (comm.type === "email" || comm.type === "sms")) {
        const created = new Date(comm.created_at).getTime();
        const read = new Date(comm.read_at).getTime();
        const minutes = (read - created) / (1000 * 60);
        
        if (minutes > 0 && minutes < 10080) { // Less than 7 days
          responseTimes.push(minutes);
          
          const date = new Date(comm.created_at).toISOString().split("T")[0];
          const existing = responseTimeMap.get(date) || [];
          existing.push(minutes);
          responseTimeMap.set(date, existing);
        }
      }
    });

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    // Response time data by date
    const responseTimeData: Array<{ date: string; avgResponseTime: number }> = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const times = responseTimeMap.get(dateStr) || [];
      const avg = times.length > 0
        ? times.reduce((a, b) => a + b, 0) / times.length
        : 0;
      responseTimeData.push({
        date: dateStr,
        avgResponseTime: avg,
      });
    }

    // Hourly activity pattern (last 7 days for better data)
    const hourlyStatsMap = new Map<number, { emails: number; sms: number; calls: number }>();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString();
    
    comms
      .filter((c) => c.created_at >= sevenDaysAgoISO)
      .forEach((comm) => {
        const hour = new Date(comm.created_at).getHours();
        const existing = hourlyStatsMap.get(hour) || { emails: 0, sms: 0, calls: 0 };
        
        if (comm.type === "email") {
          existing.emails++;
        } else if (comm.type === "sms") {
          existing.sms++;
        } else if (comm.type === "phone" || comm.type === "call") {
          existing.calls++;
        }
        
        hourlyStatsMap.set(hour, existing);
      });

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
      { name: "Inbound", Emails: emailsInbound, SMS: smsInbound, Calls: callsInbound },
      { name: "Outbound", Emails: emailsOutbound, SMS: smsOutbound, Calls: callsOutbound },
    ];

    // Weekly trend (last 4 weeks)
    const weeklyStatsMap = new Map<string, { emails: number; sms: number; calls: number }>();
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const fourWeeksAgoISO = fourWeeksAgo.toISOString();
    
    comms
      .filter((c) => c.created_at >= fourWeeksAgoISO)
      .forEach((comm) => {
        const date = new Date(comm.created_at);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        const weekKey = weekStart.toISOString().split("T")[0];
        const existing = weeklyStatsMap.get(weekKey) || { emails: 0, sms: 0, calls: 0 };
        
        if (comm.type === "email") {
          existing.emails++;
        } else if (comm.type === "sms") {
          existing.sms++;
        } else if (comm.type === "phone" || comm.type === "call") {
          existing.calls++;
        }
        
        weeklyStatsMap.set(weekKey, existing);
      });

    const weeklyStats = Array.from(weeklyStatsMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]) => ({
        week: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        Emails: stats.emails,
        SMS: stats.sms,
        Calls: stats.calls,
      }));

    // Calculate additional metrics
    const totalInbound = emailsInbound + smsInbound + callsInbound;
    const totalOutbound = emailsOutbound + smsOutbound + callsOutbound;
    const totalCommunications = totalEmails + totalSms + totalCalls;
    const readCount = comms.filter((c) => c.read_at).length;
    const readRate = totalCommunications > 0 ? (readCount / totalCommunications) * 100 : 0;
    
    // Peak hour calculation
    const peakHour = hourlyStats.reduce((max, hour) => 
      (hour.Emails + hour.SMS + hour.Calls) > (max.Emails + max.SMS + max.Calls) ? hour : max,
      hourlyStats[0]
    );

    // Communication velocity (avg per day)
    const avgPerDay = days > 0 ? totalCommunications / days : 0;

    // Response rate (percentage of inbound that got responses)
    const inboundCount = totalInbound;
    const responseRate = inboundCount > 0 ? ((totalOutbound / inboundCount) * 100) : 0;

    // Day of week stats (last 30 days)
    const dayOfWeekStatsMap = new Map<number, { emails: number; sms: number; calls: number }>();
    comms.forEach((comm) => {
      const dayOfWeek = new Date(comm.created_at).getDay(); // 0 = Sunday, 6 = Saturday
      const existing = dayOfWeekStatsMap.get(dayOfWeek) || { emails: 0, sms: 0, calls: 0 };
      
      if (comm.type === "email") {
        existing.emails++;
      } else if (comm.type === "sms") {
        existing.sms++;
      } else if (comm.type === "phone" || comm.type === "call") {
        existing.calls++;
      }
      
      dayOfWeekStatsMap.set(dayOfWeek, existing);
    });

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

    // Unread trend over time
    const unreadTrendMap = new Map<string, { emails: number; sms: number }>();
    comms
      .filter((c) => (c.type === "email" || c.type === "sms") && c.direction === "inbound" && !c.read_at)
      .forEach((comm) => {
        const date = new Date(comm.created_at).toISOString().split("T")[0];
        const existing = unreadTrendMap.get(date) || { emails: 0, sms: 0 };
        
        if (comm.type === "email") {
          existing.emails++;
        } else if (comm.type === "sms") {
          existing.sms++;
        }
        
        unreadTrendMap.set(date, existing);
      });

    const unreadTrendData: Array<{ date: string; "Unread Emails": number; "Unread SMS": number }> = [];
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

    // Response time by channel
    const emailResponseTimes: number[] = [];
    const smsResponseTimes: number[] = [];
    
    comms.forEach((comm) => {
      if (comm.read_at && comm.type === "email" && comm.direction === "inbound") {
        const created = new Date(comm.created_at).getTime();
        const read = new Date(comm.read_at).getTime();
        const minutes = (read - created) / (1000 * 60);
        if (minutes > 0 && minutes < 10080) {
          emailResponseTimes.push(minutes);
        }
      } else if (comm.read_at && comm.type === "sms" && comm.direction === "inbound") {
        const created = new Date(comm.created_at).getTime();
        const read = new Date(comm.read_at).getTime();
        const minutes = (read - created) / (1000 * 60);
        if (minutes > 0 && minutes < 10080) {
          smsResponseTimes.push(minutes);
        }
      }
    });

    const avgEmailResponseTime = emailResponseTimes.length > 0
      ? emailResponseTimes.reduce((a, b) => a + b, 0) / emailResponseTimes.length
      : 0;
    const avgSmsResponseTime = smsResponseTimes.length > 0
      ? smsResponseTimes.reduce((a, b) => a + b, 0) / smsResponseTimes.length
      : 0;

    // Inbound/Outbound ratio trend
    const inboundOutboundTrend: Array<{ date: string; Inbound: number; Outbound: number }> = [];
    const inboundByDate = new Map<string, number>();
    const outboundByDate = new Map<string, number>();
    
    comms.forEach((comm) => {
      const date = new Date(comm.created_at).toISOString().split("T")[0];
      if (comm.direction === "inbound") {
        inboundByDate.set(date, (inboundByDate.get(date) || 0) + 1);
      } else if (comm.direction === "outbound") {
        outboundByDate.set(date, (outboundByDate.get(date) || 0) + 1);
      }
    });

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

    // Busiest day of week
    const busiestDay = dayOfWeekStats.reduce((max, day) => 
      (day.Emails + day.SMS + day.Calls) > (max.Emails + max.SMS + max.Calls) ? day : max,
      dayOfWeekStats[0]
    );

    // Communication efficiency (response rate weighted by response time)
    const efficiencyScore = responseRate > 0 && avgResponseTime > 0
      ? (responseRate / (avgResponseTime / 60)) // Higher is better
      : 0;

    // Total call duration (if available)
    const totalCallDuration = comms
      .filter((c) => c.type === "phone" || c.type === "call")
      .reduce((sum, c) => sum + (c.call_duration || 0), 0);
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

