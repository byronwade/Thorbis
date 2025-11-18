import Link from "next/link";

export default function SchedulerShowcase() {
	return (
		<div className="from-background via-muted to-background flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-gradient-to-br px-6 py-16 text-center">
			<div className="max-w-2xl space-y-4">
				<p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
					Scheduler Prototype
				</p>
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					Scheduler experience lives in a separate playground for now
				</h1>
				<p className="text-muted-foreground text-base">
					We&apos;re actively iterating on a full scheduling workspace. Visit
					the dedicated prototype to explore the latest concepts, or stay tuned
					as we bring it directly into the dashboard.
				</p>
			</div>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Link
					className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-3 font-medium transition"
					href="https://scheduler.thorbis.com"
					rel="noreferrer"
					target="_blank"
				>
					Open Scheduler Prototype
				</Link>
				<Link
					className="border-border text-muted-foreground hover:bg-muted rounded-md border px-6 py-3 text-sm font-medium transition"
					href="/dashboard"
				>
					Back to dashboard
				</Link>
			</div>
		</div>
	);
}
