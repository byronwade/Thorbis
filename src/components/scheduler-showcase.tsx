import Link from "next/link";

export default function SchedulerShowcase() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-gradient-to-br from-background via-muted to-background px-6 py-16 text-center">
      <div className="max-w-2xl space-y-4">
        <p className="font-semibold text-primary text-xs uppercase tracking-[0.3em]">
          Scheduler Prototype
        </p>
        <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">
          Scheduler experience lives in a separate playground for now
        </h1>
        <p className="text-base text-muted-foreground">
          We&apos;re actively iterating on a full scheduling workspace. Visit
          the dedicated prototype to explore the latest concepts, or stay tuned
          as we bring it directly into the dashboard.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90"
          href="https://scheduler.thorbis.com"
          rel="noreferrer"
          target="_blank"
        >
          Open Scheduler Prototype
        </Link>
        <Link
          className="rounded-md border border-border px-6 py-3 font-medium text-muted-foreground text-sm transition hover:bg-muted"
          href="/dashboard"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
