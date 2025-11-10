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
import { StatsCards, type StatCard } from "@/components/ui/stats-cards";
import {
  type MissionControlData,
  getMissionControlData,
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

export default async function OwnerDashboard() {
  const data = await getMissionControlData();
  const stats = buildSummaryStats(data);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-3xl tracking-tight md:text-4xl">
              Mission Control
            </h1>
            <Badge variant="outline" className="gap-1 text-primary">
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
          <Separator orientation="vertical" className="h-4" />
          <span>
            {formatDateTime(data.lastUpdated)} ({formatRelative(data.lastUpdated)}
            )
          </span>
        </div>
      </header>

      <StatsCards stats={stats} compact />

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
          <Badge variant="secondary" className="gap-1">
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
            title="In Progress"
            count={data.operations.inProgress.length}
          />
          <div className="space-y-2">
            {data.operations.inProgress.length === 0 ? (
              <EmptyRow message="No active jobs at the moment." />
            ) : (
              data.operations.inProgress.map((job) => (
                <JobRow key={job.id} job={job} variant="progress" />
              ))
            )}
          </div>
        </section>
        <Separator />
        <section className="space-y-3">
          <SectionHeading
            title="Awaiting Assignment"
            count={data.operations.unassigned.length}
          />
          <div className="space-y-2">
            {data.operations.unassigned.length === 0 ? (
              <EmptyRow message="All jobs are staffed. Great work!" />
            ) : (
              data.operations.unassigned.map((job) => (
                <JobRow key={job.id} job={job} variant="unassigned" />
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
          data.alerts.map((alert) => <AlertRow key={alert.id} alert={alert} />)
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
            <ScheduleRow key={event.id} item={event} />
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
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Overdue</span>
            <span>{data.metrics.overdueInvoicesCount}</span>
          </div>
        </div>
        <div className="space-y-2">
          {data.financial.openInvoices.length === 0 ? (
            <EmptyRow message="No open invoices requiring follow-up." />
          ) : (
            data.financial.openInvoices.slice(0, 6).map((invoice) => (
              <InvoiceRow key={invoice.id} invoice={invoice} />
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
            <CommunicationRow key={item.id} item={item} />
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
            <ActivityRow key={item.id} activity={item} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between text-xs font-medium uppercase text-muted-foreground">
      <span>{title}</span>
      <span>{count}</span>
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 px-3 py-6 text-center text-xs text-muted-foreground md:text-sm">
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
      href={`/dashboard/work/${job.id}`}
      className="block rounded-lg border border-border/60 bg-card/80 px-3 py-2 transition hover:border-primary/70 hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">
              {job.title || `Job ${job.jobNumber}`}
            </p>
            <Badge
              variant="outline"
              className={isUnassigned ? "text-yellow-600" : "text-primary"}
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
            href={`/dashboard/work/${item.jobId}`}
            className="text-primary text-xs font-medium hover:underline"
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
      href={`/dashboard/work/invoices/${invoice.id}`}
      className="flex items-center justify-between rounded-lg border border-border/50 bg-card/60 px-3 py-2 transition hover:border-primary/70 hover:bg-muted/40"
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
          {formatCurrency(invoice.balanceAmountCents /
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
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
import { StatsCards, type StatCard } from "@/components/ui/stats-cards";
import {
  type MissionControlData,
  getMissionControlData,
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

export default async function OwnerDashboard() {
  const data = await getMissionControlData();
  const stats = buildSummaryStats(data);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-3xl tracking-tight md:text-4xl">
              Mission Control
            </h1>
            <Badge variant="outline" className="gap-1 text-primary">
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
          <Separator orientation="vertical" className="h-4" />
          <span>
            {formatDateTime(data.lastUpdated)} ({formatRelative(data.lastUpdated)}
            )
          </span>
        </div>
      </header>

      <StatsCards stats={stats} compact />

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Operations Snapshot</CardTitle>
              <Badge variant="secondary" className="gap-1">
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
              <div className="flex items-center justify-between text-xs font-medium uppercase text-muted-foreground">
                <span>In Progress</span>
                <span>{data.operations.inProgress.length}</span>
              </div>
              <div className="space-y-2">
                {data.operations.inProgress.length === 0 ? (
                  <EmptyRow message="No active jobs at the moment." />
                ) : (
                  data.operations.inProgress.map((job) => (
                    <JobRow key={job.id} job={job} variant="progress" />
                  ))
                )}
              </div>
            </section>
            <Separator />
            <section className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium uppercase text-muted-foreground">
                <span>Awaiting Assignment</span>
                <span>{data.operations.unassigned.length}</span>
              </div>
              <div className="space-y-2">
                {data.operations.unassigned.length === 0 ? (
                  <EmptyRow message="All jobs are staffed. Great work!" />
                ) : (
                  data.operations.unassigned.map((job) => (
                    <JobRow key={job.id} job={job} variant="unassigned" />
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
                <AlertRow key={alert.id} alert={alert} />
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
                <ScheduleRow key={event.id} item={event} />
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
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Overdue</span>
                <span>{data.metrics.overdueInvoicesCount}</span>
              </div>
            </div>
            <div className="space-y-2">
              {data.financial.openInvoices.length === 0 ? (
                <EmptyRow message="No open invoices requiring follow-up." />
              ) : (
                data.financial.openInvoices.slice(0, 6).map((invoice) => (
                  <InvoiceRow key={invoice.id} invoice={invoice} />
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
                <CommunicationRow key={item.id} item={item} />
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
                <ActivityRow key={item.id} activity={item} />
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
    <div className="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 px-3 py-6 text-center text-xs text-muted-foreground md:text-sm">
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
      href={`/dashboard/work/${job.id}`}
      className="block rounded-lg border border-border/60 bg-card/80 px-3 py-2 transition hover:border-primary/70 hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">
              {job.title || `Job ${job.jobNumber}`}
            </p>
            {isUnassigned ? (
              <Badge variant="outline" className="text-yellow-600">
                Needs Dispatch
              </Badge>
            ) : (
              <Badge variant="outline" className="text-primary">
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
            href={`/dashboard/work/${item.jobId}`}
            className="text-primary text-xs font-medium hover:underline"
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
      href={`/dashboard/work/invoices/${invoice.id}`}
      className="flex items-center justify-between rounded-lg border border-border/50 bg-card/60 px-3 py-2 transition hover:border-primary/70 hover:bg-muted/40"
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
            <Badge variant="outline" className="text-xs capitalize">
              {item.type}
            </Badge>
            <Badge
              variant={isInbound ? "secondary" : "outline"}
              className="text-xs capitalize"
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
          <Badge variant="outline" className="text-xs capitalize">
            {activity.entityType || "general"}
          </Badge>
          <p className="font-medium text-sm truncate">
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
        <p className="text-xs text-muted-foreground">{alert.description}</p>
      )}
    </div>
  );
}
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  PiggyBank,
  TrendingUp,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { SectionHeader } from "@/components/dashboard/section-header";

/**
 * PERFORMANCE: Lazy load RevenueChart (recharts library ~100KB+)
 * Only loads when user scrolls to chart section
 */
const RevenueChart = dynamic(
  () =>
    import("@/components/dashboard/revenue-chart").then(
      (mod) => mod.RevenueChart
    ),
  {
    loading: () => <ChartSkeleton />,
  }
);

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/ui/skeletons";

/**
 * Owner Dashboard - Server Component
 *
 * Focus: Business financials, profitability, growth metrics, and strategic overview
 * Target User: Business owner who needs high-level financial health and growth insights
 */

export default function OwnerDashboard() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-4xl tracking-tight">
            Business Overview
          </h1>
          <Badge className="text-purple-600" variant="outline">
            Owner View
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground">{currentDate}</p>
      </div>

      {/* Critical Financial Alerts */}
      <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="size-5" />
            Financial Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-white p-3 dark:border-red-800 dark:bg-red-950/50">
            <AlertTriangle className="mt-0.5 size-4 text-red-500" />
            <div className="flex-1">
              <p className="font-medium text-sm">Payroll Due in 3 Days</p>
              <p className="text-muted-foreground text-xs">
                $18,500 needed - Current balance: $45,230
              </p>
            </div>
            <Badge className="text-green-600" variant="outline">
              COVERED
            </Badge>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-white p-3 dark:border-yellow-800 dark:bg-yellow-950/50">
            <AlertTriangle className="mt-0.5 size-4 text-yellow-500" />
            <div className="flex-1">
              <p className="font-medium text-sm">Outstanding Invoices Aging</p>
              <p className="text-muted-foreground text-xs">
                $23,400 over 30 days - Collection needed
              </p>
            </div>
            <Badge className="text-yellow-600" variant="outline">
              ACTION NEEDED
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Top Financial KPIs - 4 columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          change="+18.2% vs last month"
          changeType="positive"
          description="Cash in bank today"
          icon={DollarSign}
          title="Available Cash"
          tooltip="Actual cash available in your business bank account right now. This is what you can spend today."
          value="$45,230"
        />
        <KPICard
          change="+$8,400 this week"
          changeType="positive"
          icon={TrendingUp}
          title="Monthly Revenue"
          tooltip="Total revenue for the current month including completed jobs and outstanding invoices"
          value="$124,350"
        />
        <KPICard
          change="35% (Target: 30%)"
          changeType="positive"
          icon={BarChart3}
          title="Net Profit Margin"
          tooltip="Percentage of revenue that becomes profit after all expenses. Industry average is 25-30%."
          value="35%"
        />
        <KPICard
          change="+12 new this month"
          changeType="positive"
          icon={Users}
          title="Total Customers"
          tooltip="Total number of active customers in your database"
          value="2,847"
        />
      </div>

      {/* Profitability Breakdown */}
      <div className="space-y-3">
        <SectionHeader
          description="Where your money is going today"
          title="Today's Profitability"
          tooltip="Real-time breakdown of revenue vs expenses to understand profit margins"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Revenue */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                    <DollarSign className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Revenue Today</p>
                    <p className="text-muted-foreground text-xs">
                      From 24 completed jobs
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">$11,240</p>
                  <p className="text-green-600 text-xs">100%</p>
                </div>
              </div>

              {/* Labor Cost */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Users className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Labor Cost</p>
                    <p className="text-muted-foreground text-xs">
                      Technician wages + overtime
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">$2,400</p>
                  <p className="text-blue-600 text-xs">21.4%</p>
                </div>
              </div>

              {/* Materials */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <CreditCard className="size-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Materials & Parts</p>
                    <p className="text-muted-foreground text-xs">
                      Cost of goods sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">$3,100</p>
                  <p className="text-orange-600 text-xs">27.6%</p>
                </div>
              </div>

              {/* Overhead */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <Calendar className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Overhead</p>
                    <p className="text-muted-foreground text-xs">
                      Rent, insurance, utilities
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">$1,800</p>
                  <p className="text-purple-600 text-xs">16.0%</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t" />

              {/* Net Profit */}
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-950/30">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-green-500">
                    <PiggyBank className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Net Profit Today</p>
                    <p className="text-muted-foreground text-xs">
                      After all expenses
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl text-green-600">$3,940</p>
                  <p className="font-medium text-green-600 text-xs">
                    35.1% margin ✅
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart + Cash Flow Forecast */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <h2 className="font-semibold text-xl">Revenue Trend</h2>
            <p className="text-muted-foreground text-sm">
              Last 30 days performance
            </p>
          </div>
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueChart />
          </Suspense>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="font-semibold text-xl">Cash Flow Forecast</h2>
            <p className="text-muted-foreground text-sm">
              Next 30 days projection
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Expected Revenue
                  </span>
                  <span className="font-bold text-green-600">+$145,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Payroll (2x)
                  </span>
                  <span className="font-bold text-red-600">-$37,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Fixed Expenses
                  </span>
                  <span className="font-bold text-red-600">-$25,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Materials & Parts
                  </span>
                  <span className="font-bold text-red-600">-$42,000</span>
                </div>
                <div className="border-t" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">
                    Projected Balance (30 days)
                  </span>
                  <span className="font-bold text-green-600 text-xl">
                    $86,230
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Business Growth Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Acquisition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-3xl">47</span>
                <span className="text-muted-foreground text-sm">
                  new customers
                </span>
              </div>
              <p className="text-muted-foreground text-xs">This month</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="text-green-600" variant="outline">
                  +24% vs last month
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-3xl">94%</span>
                <span className="text-muted-foreground text-sm">
                  retention rate
                </span>
              </div>
              <p className="text-muted-foreground text-xs">Last 12 months</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="text-green-600" variant="outline">
                  Above industry avg (85%)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Per Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-3xl">$2,847</span>
                <span className="text-muted-foreground text-sm">
                  lifetime value
                </span>
              </div>
              <p className="text-muted-foreground text-xs">Average LTV</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="text-green-600" variant="outline">
                  +18% year over year
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
