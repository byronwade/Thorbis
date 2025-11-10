import {
  Activity,
  AlertTriangle,
  DollarSign,
  Mail,
  Phone,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type StatCard, StatsCards } from "@/components/ui/stats-cards";
import {
  getMissionControlData,
  type MissionControlData,
} from "@/lib/dashboard/mission-control-data";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const relativeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

function formatCurrency(amount: number | null | undefined) {
  if (!amount || Number.isNaN(amount)) {
    return "$0";
  }
  return currencyFormatter.format(amount);
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "--";
  }
  const date = new Date(value);
  return `${dateFormatter.format(date)} · ${timeFormatter.format(date)}`;
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return "--";
  }
  return timeFormatter.format(new Date(value));
}

function formatRelative(iso: string | null | undefined) {
  if (!iso) {
    return "";
  }
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMinutes = Math.round((then - now) / (1000 * 60));

  if (Math.abs(diffMinutes) < 60) {
    return relativeFormatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  return relativeFormatter.format(diffHours, "hour");
}

function buildSummaryStats(data: MissionControlData): StatCard[] {
  return [
    {
      label: "Revenue Today",
      value: formatCurrency(data.metrics.revenueToday),
      changeLabel:
        data.metrics.averageTicket > 0
          ? `${formatCurrency(data.metrics.averageTicket)} avg ticket`
          : undefined,
    },
    {
      label: "Jobs Scheduled",
      value: data.metrics.jobsScheduledToday,
      changeLabel: `${data.metrics.jobsCompletedToday} completed`,
    },
    {
      label: "Active Jobs",
      value: data.metrics.jobsInProgress,
      changeLabel: `${data.metrics.unassignedJobs} unassigned`,
    },
    {
      label: "Outstanding AR",
      value: formatCurrency(data.metrics.outstandingInvoicesAmount),
      changeLabel: `${data.metrics.overdueInvoicesCount} overdue`,
    },
    {
      label: "Comms Today",
      value: data.metrics.communicationsToday,
      changeLabel: "Calls, emails & texts",
    },
  ];
}

export default function OwnerDashboard({ data }: { data?: MissionControlData }) {
  if (!data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">No dashboard data available</p>
      </div>
    );
  }

  const stats = buildSummaryStats(data);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-3xl tracking-tight md:text-4xl">
              Mission Control
            </h1>
            <Badge className="gap-1 text-primary" variant="outline">
              <Wifi className="size-3.5" />
              Live Data
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Real-time snapshot of today&apos;s operations, finances, and
            communications.
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
          <span>Last updated</span>
          <Separator className="h-4" orientation="vertical" />
          <span>
            {formatDateTime(data.lastUpdated)} (
            {formatRelative(data.lastUpdated)})
          </span>
        </div>
      </header>

      <StatsCards compact stats={stats} />

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <OperationsCard data={data} />
        <AlertsCard data={data} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <ScheduleCard data={data} />
        <FinancialCard data={data} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CommunicationsCard data={data} />
        <ActivityCard data={data} />
      </div>
    </div>
  );
}

function OperationsCard({ data }: { data: MissionControlData }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Operations Snapshot</CardTitle>
          <Badge className="gap-1" variant="secondary">
            <TrendingUp className="size-3.5" />
            {data.operations.inProgress.length} active
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Track in-progress jobs and work orders awaiting assignment.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <section className="space-y-3">
          <SectionHeading
            count={data.operations.inProgress.length}
            title="In Progress"
          />
          <div className="space-y-2">
            {data.operations.inProgress.length === 0 ? (
              <EmptyRow message="No active jobs at the moment." />
            ) : (
              data.operations.inProgress.map((job) => (
                <JobRow job={job} key={job.id} variant="progress" />
              ))
            )}
          </div>
        </section>
        <Separator />
        <section className="space-y-3">
          <SectionHeading
            count={data.operations.unassigned.length}
            title="Awaiting Assignment"
          />
          <div className="space-y-2">
            {data.operations.unassigned.length === 0 ? (
              <EmptyRow message="All jobs are staffed. Great work!" />
            ) : (
              data.operations.unassigned.map((job) => (
                <JobRow job={job} key={job.id} variant="unassigned" />
              ))
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

function AlertsCard({ data }: { data: MissionControlData }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Alerts & Risks</CardTitle>
        <p className="text-muted-foreground text-sm">
          Issues that need attention to keep today on track.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.alerts.length === 0 ? (
          <EmptyRow message="All systems healthy — no alerts right now." />
        ) : (
          data.alerts.map((alert) => <AlertRow alert={alert} key={alert.id} />)
        )}
      </CardContent>
    </Card>
  );
}

function ScheduleCard({ data }: { data: MissionControlData }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Today&apos;s Schedule</CardTitle>
        <p className="text-muted-foreground text-sm">
          Upcoming appointments and technician assignments.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.schedule.length === 0 ? (
          <EmptyRow message="No appointments scheduled for the rest of the day." />
        ) : (
          data.schedule.map((event) => (
            <ScheduleRow item={event} key={event.id} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function FinancialCard({ data }: { data: MissionControlData }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Financial Pulse</CardTitle>
        <p className="text-muted-foreground text-sm">
          Outstanding receivables and upcoming cash.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/40 p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-muted-foreground text-xs uppercase">
              Outstanding Balance
            </span>
            <span className="font-semibold text-lg">
              {formatCurrency(data.metrics.outstandingInvoicesAmount)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-muted-foreground text-xs">
            <span>Overdue</span>
            <span>{data.metrics.overdueInvoicesCount}</span>
          </div>
        </div>
        <div className="space-y-2">
          {data.financial.openInvoices.length === 0 ? (
            <EmptyRow message="No open invoices requiring follow-up." />
          ) : (
            data.financial.openInvoices
              .slice(0, 6)
              .map((invoice) => (
                <InvoiceRow invoice={invoice} key={invoice.id} />
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CommunicationsCard({ data }: { data: MissionControlData }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Latest Communications</CardTitle>
        <p className="text-muted-foreground text-sm">
          Call, SMS, and email activity from today.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.communications.length === 0 ? (
          <EmptyRow message="No communications logged today." />
        ) : (
          data.communications.map((item) => (
            <CommunicationRow item={item} key={item.id} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function ActivityCard({ data }: { data: MissionControlData }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Activity Feed</CardTitle>
        <p className="text-muted-foreground text-sm">
          Recent changes across jobs, customers, invoices, and more.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.activity.length === 0 ? (
          <EmptyRow message="No new activity yet today." />
        ) : (
          data.activity.map((item) => (
            <ActivityRow activity={item} key={item.id} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between font-medium text-muted-foreground text-xs uppercase">
      <span>{title}</span>
      <span>{count}</span>
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-muted-foreground/30 border-dashed bg-muted/20 px-3 py-6 text-center text-muted-foreground text-xs md:text-sm">
      {message}
    </div>
  );
}

function JobRow({
  job,
  variant,
}: {
  job: MissionControlData["operations"]["inProgress"][number];
  variant: "progress" | "unassigned";
}) {
  const isUnassigned = variant === "unassigned";
  return (
    <Link
      className="block rounded-lg border border-border/60 bg-card/80 px-3 py-2 transition hover:border-primary/70 hover:bg-muted/40"
      href={`/dashboard/work/${job.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">
              {job.title || `Job ${job.jobNumber}`}
            </p>
            <Badge
              className={isUnassigned ? "text-yellow-600" : "text-primary"}
              variant="outline"
            >
              {isUnassigned
                ? "Needs Dispatch"
                : job.status
                  ? job.status.replace(/_/g, " ")
                  : "In Progress"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">
            {job.customerName || "Customer TBD"}
            {job.scheduledStart && (
              <>
                {" · "}
                {formatTime(job.scheduledStart)}
              </>
            )}
          </p>
          {job.address && (
            <p className="text-muted-foreground text-xs">{job.address}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="font-semibold text-sm">
            {formatCurrency(job.totalAmountCents / 100)}
          </span>
          {!isUnassigned && (
            <span className="text-muted-foreground text-xs">On-site team</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ScheduleRow({
  item,
}: {
  item: MissionControlData["schedule"][number];
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/60 px-3 py-2">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{item.title}</p>
            <Badge variant="outline">{item.status}</Badge>
          </div>
          <p className="text-muted-foreground text-xs">
            {formatTime(item.startTime)} – {formatTime(item.endTime)} ·{" "}
            {item.technicianName || "Unassigned"}
          </p>
          {item.customerName && (
            <p className="text-muted-foreground text-xs">
              {item.customerName}
              {item.address ? ` · ${item.address}` : ""}
            </p>
          )}
        </div>
        {item.jobId && (
          <Link
            className="font-medium text-primary text-xs hover:underline"
            href={`/dashboard/work/${item.jobId}`}
          >
            View Job
          </Link>
        )}
      </div>
    </div>
  );
}

function InvoiceRow({
  invoice,
}: {
  invoice: MissionControlData["financial"]["openInvoices"][number];
}) {
  const dueLabel = invoice.dueDate
    ? `${formatDateTime(invoice.dueDate)}`
    : "No due date";

  return (
    <Link
      className="flex items-center justify-between rounded-lg border border-border/50 bg-card/60 px-3 py-2 transition hover:border-primary/70 hover:bg-muted/40"
      href={`/dashboard/work/invoices/${invoice.id}`}
    >
      <div className="space-y-1">
        <p className="font-medium text-sm">
          Invoice {invoice.invoiceNumber || "—"}
        </p>
        <p className="text-muted-foreground text-xs">
          {invoice.customerName || "Unknown customer"} · {dueLabel}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm">
          {formatCurrency(invoice.balanceAmountCents / 100)}
        </p>
        <p className="text-muted-foreground text-xs capitalize">
          {invoice.status}
        </p>
      </div>
    </Link>
  );
}

function buildSummaryStats(data: MissionControlData): StatCard[] {
  return [
    {
      label: "Revenue Today",
      value: formatCurrency(data.metrics.revenueToday),
      changeLabel:
        data.metrics.averageTicket > 0
          ? `${formatCurrency(data.metrics.averageTicket)} avg ticket`
          : undefined,
    },
    {
      label: "Jobs Scheduled",
      value: data.metrics.jobsScheduledToday,
      changeLabel: `${data.metrics.jobsCompletedToday} completed`,
    },
    {
      label: "Active Jobs",
      value: data.metrics.jobsInProgress,
      changeLabel: `${data.metrics.unassignedJobs} unassigned`,
    },
    {
      label: "Outstanding AR",
      value: formatCurrency(data.metrics.outstandingInvoicesAmount),
      changeLabel: `${data.metrics.overdueInvoicesCount} overdue`,
    },
    {
      label: "Comms Today",
      value: data.metrics.communicationsToday,
      changeLabel: "Calls, emails & texts",
    },
  ];
}

export default function OwnerDashboard({ data }: { data?: MissionControlData }) {
  if (!data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">No dashboard data available</p>
      </div>
    );
  }

  const stats = buildSummaryStats(data);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-3xl tracking-tight md:text-4xl">
              Mission Control
            </h1>
            <Badge className="gap-1 text-primary" variant="outline">
              <Wifi className="size-3.5" />
              Live Data
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Real-time snapshot of today&apos;s operations, finances, and
            communications.
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
          <span>Last updated</span>
          <Separator className="h-4" orientation="vertical" />
          <span>
            {formatDateTime(data.lastUpdated)} ({formatRelative(data.lastUpdated)}
            )
          </span>
        </div>
      </header>

      <StatsCards compact stats={stats} />

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Operations Snapshot</CardTitle>
              <Badge className="gap-1" variant="secondary">
                <TrendingUp className="size-3.5" />
                {data.operations.inProgress.length} active
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Track in-progress jobs and work orders awaiting assignment.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <section className="space-y-3">
              <div className="flex items-center justify-between font-medium text-muted-foreground text-xs uppercase">
                <span>In Progress</span>
                <span>{data.operations.inProgress.length}</span>
              </div>
              <div className="space-y-2">
                {data.operations.inProgress.length === 0 ? (
                  <EmptyRow message="No active jobs at the moment." />
                ) : (
                  data.operations.inProgress.map((job) => (
                    <JobRow job={job} key={job.id} variant="progress" />
                  ))
                )}
              </div>
            </section>
            <Separator />
            <section className="space-y-3">
              <div className="flex items-center justify-between font-medium text-muted-foreground text-xs uppercase">
                <span>Awaiting Assignment</span>
                <span>{data.operations.unassigned.length}</span>
              </div>
              <div className="space-y-2">
                {data.operations.unassigned.length === 0 ? (
                  <EmptyRow message="All jobs are staffed. Great work!" />
                ) : (
                  data.operations.unassigned.map((job) => (
                    <JobRow job={job} key={job.id} variant="unassigned" />
                  ))
                )}
              </div>
            </section>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Alerts & Risks</CardTitle>
            <p className="text-muted-foreground text-sm">
              Issues that need attention to keep today on track.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.alerts.length === 0 ? (
              <EmptyRow message="All systems healthy — no alerts right now." />
            ) : (
              data.alerts.map((alert) => (
                <AlertRow alert={alert} key={alert.id} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Today&apos;s Schedule</CardTitle>
            <p className="text-muted-foreground text-sm">
              Upcoming appointments and technician assignments.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.schedule.length === 0 ? (
              <EmptyRow message="No appointments scheduled for the rest of the day." />
            ) : (
              data.schedule.map((event) => (
                <ScheduleRow item={event} key={event.id} />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Financial Pulse</CardTitle>
            <p className="text-muted-foreground text-sm">
              Outstanding receivables and upcoming cash.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground text-xs uppercase">
                  Outstanding Balance
                </span>
                <span className="font-semibold text-lg">
                  {formatCurrency(data.metrics.outstandingInvoicesAmount)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-muted-foreground text-xs">
                <span>Overdue</span>
                <span>{data.metrics.overdueInvoicesCount}</span>
              </div>
            </div>
            <div className="space-y-2">
              {data.financial.openInvoices.length === 0 ? (
                <EmptyRow message="No open invoices requiring follow-up." />
              ) : (
                data.financial.openInvoices.slice(0, 6).map((invoice) => (
                  <InvoiceRow invoice={invoice} key={invoice.id} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Latest Communications</CardTitle>
            <p className="text-muted-foreground text-sm">
              Call, SMS, and email activity from today.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.communications.length === 0 ? (
              <EmptyRow message="No communications logged today." />
            ) : (
              data.communications.map((item) => (
                <CommunicationRow item={item} key={item.id} />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Activity Feed</CardTitle>
            <p className="text-muted-foreground text-sm">
              Recent changes across jobs, customers, invoices, and more.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.activity.length === 0 ? (
              <EmptyRow message="No new activity yet today." />
            ) : (
              data.activity.map((item) => (
                <ActivityRow activity={item} key={item.id} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-muted-foreground/30 border-dashed bg-muted/20 px-3 py-6 text-center text-muted-foreground text-xs md:text-sm">
      {message}
    </div>
  );
}

function JobRow({
  job,
  variant,
}: {
  job: MissionControlData["operations"]["inProgress"][number];
  variant: "progress" | "unassigned";
}) {
  const isUnassigned = variant === "unassigned";
  return (
    <Link
      className="block rounded-lg border border-border/60 bg-card/80 px-3 py-2 transition hover:border-primary/70 hover:bg-muted/40"
      href={`/dashboard/work/${job.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">
              {job.title || `Job ${job.jobNumber}`}
            </p>
            {isUnassigned ? (
              <Badge className="text-yellow-600" variant="outline">
                Needs Dispatch
              </Badge>
            ) : (
              <Badge className="text-primary" variant="outline">
                {job.status ? job.status.replace(/_/g, " ") : "In Progress"}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            {job.customerName || "Customer TBD"}
            {job.scheduledStart && (
              <>
                {" · "}
                {formatTime(job.scheduledStart)}
              </>
            )}
          </p>
          {job.address && (
            <p className="text-muted-foreground text-xs">{job.address}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="font-semibold text-sm">
            {formatCurrency(job.totalAmountCents / 100)}
          </span>
          {!isUnassigned && (
            <span className="text-muted-foreground text-xs">On-site team</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ScheduleRow({
  item,
}: {
  item: MissionControlData["schedule"][number];
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/60 px-3 py-2">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{item.title}</p>
            <Badge variant="outline">{item.status}</Badge>
          </div>
          <p className="text-muted-foreground text-xs">
            {formatTime(item.startTime)} – {formatTime(item.endTime)} ·{" "}
            {item.technicianName || "Unassigned"}
          </p>
          {item.customerName && (
            <p className="text-muted-foreground text-xs">
              {item.customerName}
              {item.address ? ` · ${item.address}` : ""}
            </p>
          )}
        </div>
        {item.jobId && (
          <Link
            className="font-medium text-primary text-xs hover:underline"
            href={`/dashboard/work/${item.jobId}`}
          >
            View Job
          </Link>
        )}
      </div>
    </div>
  );
}

function InvoiceRow({
  invoice,
}: {
  invoice: MissionControlData["financial"]["openInvoices"][number];
}) {
  const dueLabel = invoice.dueDate
    ? `${formatDateTime(invoice.dueDate)}`
    : "No due date";

  return (
    <Link
      className="flex items-center justify-between rounded-lg border border-border/50 bg-card/60 px-3 py-2 transition hover:border-primary/70 hover:bg-muted/40"
      href={`/dashboard/work/invoices/${invoice.id}`}
    >
      <div className="space-y-1">
        <p className="font-medium text-sm">
          Invoice {invoice.invoiceNumber || "—"}
        </p>
        <p className="text-muted-foreground text-xs">
          {invoice.customerName || "Unknown customer"} · {dueLabel}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm">
          {formatCurrency(invoice.balanceAmountCents / 100)}
        </p>
        <p className="text-muted-foreground text-xs capitalize">
          {invoice.status}
        </p>
      </div>
    </Link>
  );
}

function CommunicationRow({
  item,
}: {
  item: MissionControlData["communications"][number];
}) {
  const isInbound = item.direction === "inbound";
  const Icon = item.type === "phone" ? Phone : Mail;

  return (
    <div className="flex items-start justify-between rounded-lg border border-border/50 bg-card/60 px-3 py-2">
      <div className="flex items-start gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">
              {item.customerName || "Unknown contact"}
            </p>
            <Badge className="text-xs capitalize" variant="outline">
              {item.type}
            </Badge>
            <Badge
              className="text-xs capitalize"
              variant={isInbound ? "secondary" : "outline"}
            >
              {item.direction}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">
            {item.subject || "No subject"}
          </p>
        </div>
      </div>
      <span className="text-muted-foreground text-xs">
        {formatRelative(item.createdAt)}
      </span>
    </div>
  );
}

function ActivityRow({
  activity,
}: {
  activity: MissionControlData["activity"][number];
}) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-border/50 bg-card/60 px-3 py-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge className="text-xs capitalize" variant="outline">
            {activity.entityType || "general"}
          </Badge>
          <p className="truncate font-medium text-sm">
            {activity.action || "Activity recorded"}
          </p>
        </div>
        <p className="text-muted-foreground text-xs">
          {activity.actorName || "System"} ·{" "}
          {formatRelative(activity.createdAt)}
        </p>
      </div>
      <Activity className="size-4 text-muted-foreground" />
    </div>
  );
}

function AlertRow({
  alert,
}: {
  alert: MissionControlData["alerts"][number];
}) {
  const tone =
    alert.level === "critical"
      ? "border-destructive bg-destructive/10 text-destructive"
      : alert.level === "warning"
        ? "border-yellow-500/60 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
        : "border-primary/40 bg-primary/10 text-primary";

  return (
    <div
      className={`space-y-1 rounded-lg border px-3 py-2 text-sm ${tone}`}
    >
      <div className="flex items-center gap-2 font-medium">
        <AlertTriangle className="size-4" />
        <span>{alert.title}</span>
      </div>
      {alert.description && (
        <p className="text-muted-foreground text-xs">{alert.description}</p>
      )}
    </div>
  );
}
