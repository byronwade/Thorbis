import { endOfDay, startOfDay } from "@/lib/schedule-utils";
import { createClient } from "@/lib/supabase/server";

const CENTS_IN_DOLLAR = 100;

type NullableString = string | null | undefined;

type MissionControlJob = {
  id: string;
  jobNumber: NullableString;
  title: NullableString;
  status: NullableString;
  priority: NullableString;
  scheduledStart: NullableString;
  customerName: NullableString;
  address: NullableString;
  totalAmountCents: number;
};

type MissionControlScheduleItem = {
  id: string;
  title: NullableString;
  startTime: NullableString;
  endTime: NullableString;
  status: NullableString;
  technicianName: NullableString;
  customerName: NullableString;
  address: NullableString;
  jobId: NullableString;
};

type MissionControlCommunication = {
  id: string;
  type: NullableString;
  direction: NullableString;
  subject: NullableString;
  createdAt: NullableString;
  status: NullableString;
  customerName: NullableString;
};

type MissionControlInvoice = {
  id: string;
  invoiceNumber: NullableString;
  status: NullableString;
  totalAmountCents: number;
  balanceAmountCents: number;
  dueDate: NullableString;
  customerName: NullableString;
};

type MissionControlActivity = {
  id: string;
  entityType: NullableString;
  action: NullableString;
  createdAt: NullableString;
  actorName: NullableString;
};

type MissionControlAlert = {
  id: string;
  level: "critical" | "warning" | "info";
  title: string;
  description?: string;
};

type MissionControlMetrics = {
  revenueToday: number;
  averageTicket: number;
  jobsScheduledToday: number;
  jobsCompletedToday: number;
  jobsInProgress: number;
  unassignedJobs: number;
  outstandingInvoicesAmount: number;
  overdueInvoicesCount: number;
  communicationsToday: number;
};

export type MissionControlData = {
  metrics: MissionControlMetrics;
  alerts: MissionControlAlert[];
  operations: {
    inProgress: MissionControlJob[];
    unassigned: MissionControlJob[];
  };
  schedule: MissionControlScheduleItem[];
  communications: MissionControlCommunication[];
  financial: {
    openInvoices: MissionControlInvoice[];
  };
  activity: MissionControlActivity[];
  lastUpdated: string;
};

const EMPTY_DATA: MissionControlData = {
  metrics: {
    revenueToday: 0,
    averageTicket: 0,
    jobsScheduledToday: 0,
    jobsCompletedToday: 0,
    jobsInProgress: 0,
    unassignedJobs: 0,
    outstandingInvoicesAmount: 0,
    overdueInvoicesCount: 0,
    communicationsToday: 0,
  },
  alerts: [],
  operations: {
    inProgress: [],
    unassigned: [],
  },
  schedule: [],
  communications: [],
  financial: {
    openInvoices: [],
  },
  activity: [],
  lastUpdated: new Date().toISOString(),
};

function formatCurrencyCents(value: number | null | undefined): number {
  return typeof value === "number" ? value : 0;
}

function resolveName(
  primary?: NullableString,
  fallbackFirst?: NullableString,
  fallbackLast?: NullableString
) {
  if (primary && primary.trim().length > 0) {
    return primary;
  }
  const combined = [fallbackFirst, fallbackLast]
    .filter((part) => part && part.trim().length > 0)
    .join(" ");

  return combined.length > 0 ? combined : undefined;
}

// Cache mission control data for 30 seconds to reduce database load
const dataCache = new Map<
  string,
  { data: MissionControlData; timestamp: number }
>();
const CACHE_TTL = 30_000; // 30 seconds

export async function getMissionControlData(
  companyId?: string
): Promise<MissionControlData> {
  try {
    // Check cache first
    if (companyId) {
      const cached = dataCache.get(companyId);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }
    }

    const supabase = await createClient();

    if (!supabase) {
      return EMPTY_DATA;
    }

    if (!companyId) {
      return EMPTY_DATA;
    }

    const activeCompanyId = companyId;

    const now = new Date();
    const dayStart = startOfDay(now).toISOString();
    const dayEnd = endOfDay(now).toISOString();

    const [
      jobsTodayResult,
      inProgressJobsResult,
      completedTodayResult,
      unassignedJobsResult,
      schedulesResult,
      communicationsResult,
      invoicesResult,
      activityResult,
    ] = await Promise.all([
      supabase
        .from("jobs")
        .select(
          `
          id,
          job_number,
          title,
          status,
          priority,
          scheduled_start,
          total_amount,
          customers:customers!customer_id(
            display_name,
            first_name,
            last_name
          ),
          properties:properties!property_id(
            address,
            city,
            state,
            zip_code
          )
        `
        )
        .eq("company_id", activeCompanyId)
        .gte("scheduled_start", dayStart)
        .lt("scheduled_start", dayEnd)
        .is("deleted_at", null)
        .order("scheduled_start", { ascending: true })
        .limit(50),
      supabase
        .from("jobs")
        .select(
          `
          id,
          job_number,
          title,
          status,
          priority,
          scheduled_start,
          total_amount,
          customers:customers!customer_id(
            display_name,
            first_name,
            last_name
          ),
          properties:properties!property_id(
            address,
            city,
            state,
            zip_code
          )
        `
        )
        .eq("company_id", activeCompanyId)
        .in("status", ["in_progress", "en_route", "on_hold"])
        .is("deleted_at", null)
        .order("updated_at", { ascending: false })
        .limit(15),
      supabase
        .from("jobs")
        .select("id, total_amount, actual_end")
        .eq("company_id", activeCompanyId)
        .eq("status", "completed")
        .gte("actual_end", dayStart)
        .lt("actual_end", dayEnd)
        .is("deleted_at", null),
      supabase
        .from("jobs")
        .select(
          `
          id,
          job_number,
          title,
          status,
          priority,
          scheduled_start,
          total_amount,
          customers:customers!customer_id(
            display_name,
            first_name,
            last_name
          ),
          properties:properties!property_id(
            address,
            city,
            state,
            zip_code
          )
        `
        )
        .eq("company_id", activeCompanyId)
        .in("status", ["scheduled", "dispatch_required", "pending"])
        .is("assigned_to", null)
        .is("deleted_at", null)
        .order("scheduled_start", { ascending: true })
        .limit(15),
      supabase
        .from("schedules")
        .select(
          `
          id,
          title,
          start_time,
          end_time,
          status,
          assigned_user:users!assigned_to(
            id,
            first_name,
            last_name
          ),
          customers:customers!customer_id(
            display_name,
            first_name,
            last_name
          ),
          properties:properties!property_id(
            address,
            city,
            state,
            zip_code
          ),
          job:jobs!job_id(
            id,
            job_number,
            status
          )
        `
        )
        .eq("company_id", activeCompanyId)
        .gte("start_time", dayStart)
        .lt("start_time", dayEnd)
        .is("deleted_at", null)
        .order("start_time", { ascending: true })
        .limit(12),
      supabase
        .from("communications")
        .select(
          `
          id,
          type,
          direction,
          subject,
          status,
          created_at,
          customers:customers!customer_id(
            display_name,
            first_name,
            last_name
          )
        `
        )
        .eq("company_id", activeCompanyId)
        .gte("created_at", dayStart)
        .lt("created_at", dayEnd)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("invoices")
        .select(
          `
          id,
          invoice_number,
          status,
          total_amount,
          balance_amount,
          due_date,
          customers:customers!customer_id(
            display_name,
            first_name,
            last_name
          )
        `
        )
        .eq("company_id", activeCompanyId)
        .in("status", ["sent", "partial", "unpaid", "overdue"])
        .is("deleted_at", null)
        .order("due_date", { ascending: true })
        .limit(20),
      supabase
        .from("activity_log")
        .select(
          `
          id,
          entity_type,
          action,
          category,
          created_at,
          actor_name
        `
        )
        .eq("company_id", activeCompanyId)
        .order("created_at", { ascending: false })
        .limit(25),
    ]);

    const jobsToday = jobsTodayResult.data ?? [];
    const inProgressJobs = inProgressJobsResult.data ?? [];
    const completedToday = completedTodayResult.data ?? [];
    const unassignedJobs = unassignedJobsResult.data ?? [];
    const schedules = schedulesResult.data ?? [];
    const communications = communicationsResult.data ?? [];
    const invoices = invoicesResult.data ?? [];
    const activities = activityResult.data ?? [];

    const revenueTodayCents = completedToday.reduce(
      (sum, job) => sum + formatCurrencyCents(job.total_amount),
      0
    );

    const averageTicketCents =
      completedToday.length > 0 ? revenueTodayCents / completedToday.length : 0;

    const outstandingBalanceCents = invoices.reduce(
      (sum, invoice) => sum + formatCurrencyCents(invoice.balance_amount),
      0
    );

    const overdueInvoicesCount = invoices.filter((invoice) => {
      if (!invoice.due_date) {
        return false;
      }
      return (
        invoice.status === "overdue" ||
        new Date(invoice.due_date).getTime() < now.getTime()
      );
    }).length;

    const metrics: MissionControlMetrics = {
      revenueToday: revenueTodayCents / CENTS_IN_DOLLAR,
      averageTicket: averageTicketCents / CENTS_IN_DOLLAR,
      jobsScheduledToday: jobsToday.length,
      jobsCompletedToday: completedToday.length,
      jobsInProgress: inProgressJobs.length,
      unassignedJobs: unassignedJobs.length,
      outstandingInvoicesAmount: outstandingBalanceCents / CENTS_IN_DOLLAR,
      overdueInvoicesCount,
      communicationsToday: communications.length,
    };

    const alerts: MissionControlAlert[] = [];

    if (metrics.unassignedJobs > 0) {
      alerts.push({
        id: "unassigned-jobs",
        level: metrics.unassignedJobs > 5 ? "critical" : "warning",
        title: `${metrics.unassignedJobs} job${
          metrics.unassignedJobs === 1 ? "" : "s"
        } awaiting assignment`,
        description:
          "Assign technicians to keep response times within SLA targets.",
      });
    }

    if (metrics.overdueInvoicesCount > 0) {
      alerts.push({
        id: "overdue-invoices",
        level: "warning",
        title: `${metrics.overdueInvoicesCount} overdue invoice${
          metrics.overdueInvoicesCount === 1 ? "" : "s"
        }`,
        description: "Follow up with customers to accelerate collections.",
      });
    }

    if (metrics.revenueToday === 0) {
      alerts.push({
        id: "revenue-zero",
        level: "info",
        title: "No completed revenue recorded yet today",
        description: "Keep an eye on active jobs to ensure timely completion.",
      });
    }

    const mapJob = (job: any): MissionControlJob => ({
      id: job.id,
      jobNumber: job.job_number,
      title: job.title,
      status: job.status,
      priority: job.priority,
      scheduledStart: job.scheduled_start,
      customerName: resolveName(
        job.customers?.display_name,
        job.customers?.first_name,
        job.customers?.last_name
      ),
      address:
        job.properties &&
        [
          job.properties.address,
          job.properties.city,
          job.properties.state,
          job.properties.zip_code,
        ]
          .filter(Boolean)
          .join(", "),
      totalAmountCents: formatCurrencyCents(job.total_amount),
    });

    const operations = {
      inProgress: inProgressJobs.slice(0, 6).map(mapJob),
      unassigned: unassignedJobs.slice(0, 6).map(mapJob),
    };

    const scheduleItems: MissionControlScheduleItem[] = schedules
      .map((entry: any) => ({
        id: entry.id,
        title: entry.title || entry.job?.job_number || "Service Visit",
        startTime: entry.start_time,
        endTime: entry.end_time,
        status: entry.status,
        technicianName: resolveName(
          undefined,
          entry.assigned_user?.first_name,
          entry.assigned_user?.last_name
        ),
        customerName: resolveName(
          entry.customers?.display_name,
          entry.customers?.first_name,
          entry.customers?.last_name
        ),
        address:
          entry.properties &&
          [
            entry.properties.address,
            entry.properties.city,
            entry.properties.state,
            entry.properties.zip_code,
          ]
            .filter(Boolean)
            .join(", "),
        jobId: entry.job?.id ?? null,
      }))
      .slice(0, 8);

    const communicationItems: MissionControlCommunication[] =
      communications.map((item: any) => ({
        id: item.id,
        type: item.type,
        direction: item.direction,
        subject: item.subject,
        status: item.status,
        createdAt: item.created_at,
        customerName: resolveName(
          item.customers?.display_name,
          item.customers?.first_name,
          item.customers?.last_name
        ),
      }));

    const invoiceItems: MissionControlInvoice[] = invoices.map(
      (invoice: any) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        status: invoice.status,
        totalAmountCents: formatCurrencyCents(invoice.total_amount),
        balanceAmountCents: formatCurrencyCents(invoice.balance_amount),
        dueDate: invoice.due_date,
        customerName: resolveName(
          invoice.customers?.display_name,
          invoice.customers?.first_name,
          invoice.customers?.last_name
        ),
      })
    );

    const activityItems: MissionControlActivity[] = activities.map(
      (entry: any) => ({
        id: entry.id,
        entityType: entry.entity_type,
        action: entry.action,
        createdAt: entry.created_at,
        actorName: entry.actor_name,
      })
    );

    const data = {
      metrics,
      alerts,
      operations,
      schedule: scheduleItems,
      communications: communicationItems,
      financial: {
        openInvoices: invoiceItems,
      },
      activity: activityItems,
      lastUpdated: now.toISOString(),
    };

    // Cache the result
    if (companyId) {
      dataCache.set(companyId, { data, timestamp: Date.now() });
    }

    return data;
  } catch {
    return EMPTY_DATA;
  }
}
