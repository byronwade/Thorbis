import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { SettingsOverviewSection } from "@/lib/settings/overview-data";
import {
	describeHealthStatus,
	getStatusColorClasses,
} from "@/lib/settings/status-utils";
import { cn } from "@/lib/utils";

type SettingsShellProps = {
	sections: SettingsOverviewSection[];
	children: ReactNode;
};

export function SettingsShell({ sections, children }: SettingsShellProps) {
	if (sections.length <= 1) {
		return <div className="space-y-12">{children}</div>;
	}

	return (
		<div className="space-y-10">
			<div className="rounded-2xl border bg-card/90 p-4 shadow-sm">
				<div className="flex items-center justify-between gap-3">
					<div>
						<p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
							Settings clusters
						</p>
						<p className="text-muted-foreground text-sm">
							Jump between areas without leaving the page
						</p>
					</div>
				</div>
				<nav
					aria-label="Settings clusters"
					className="mt-4 flex gap-3 overflow-x-auto pb-2"
				>
					{sections.map((section) => {
						const statusColors = getStatusColorClasses(section.status);
						return (
							<Link
								className="group min-w-[180px] flex-1 rounded-2xl border px-4 py-3 transition hover:border-primary/60 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								href={`#${section.slug}`}
								key={section.slug}
							>
								<div className="flex items-center justify-between gap-3">
									<div className="flex items-center gap-2">
										<div className="rounded-lg border bg-muted p-1">
											<section.icon className="size-4 text-primary" />
										</div>
										<div>
											<p className="font-medium text-sm">{section.title}</p>
											<p className="text-muted-foreground text-xs">
												{describeHealthStatus(section.status)}
											</p>
										</div>
									</div>
									<Badge
										className={cn(
											"font-semibold text-xs",
											statusColors.text,
											statusColors.background,
											statusColors.border,
										)}
										variant="outline"
									>
										{section.progress}%
									</Badge>
								</div>
							</Link>
						);
					})}
				</nav>
			</div>

			<div className="space-y-12">{children}</div>
		</div>
	);
}
