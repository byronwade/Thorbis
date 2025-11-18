"use client";

import { addDays, format, startOfDay } from "date-fns";
import * as React from "react";
import type { Assignment, JobCategory, TeamMember } from "./types";

export default function BoardView({
	date,
	days,
	members,
	categories,
	assignments,
}: {
	date: Date;
	days: number;
	members: TeamMember[];
	categories: JobCategory[];
	assignments: Assignment[];
}) {
	const dayDates = React.useMemo(
		() =>
			Array.from({ length: days }).map((_, i) => addDays(startOfDay(date), i)),
		[date, days],
	);
	const byDay = React.useMemo(() => {
		const map = new Map<string, Assignment[]>();
		for (const d of dayDates) {
			map.set(d.toDateString(), []);
		}
		for (const a of assignments) {
			const s = new Date(a.start);
			const k = startOfDay(s).toDateString();
			const arr = map.get(k);
			if (arr) {
				arr.push(a);
			}
		}
		return map;
	}, [assignments, dayDates]);

	function catOf(id: string) {
		return categories.find((c) => c.id === id);
	}
	function memberName(id: string) {
		return members.find((m) => m.id === id)?.name ?? "Unknown";
	}

	return (
		<div className="flex min-h-0 flex-1 overflow-auto bg-neutral-50/50">
			<div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{dayDates.map((d) => {
					const list = byDay.get(d.toDateString()) ?? [];
					return (
						<div
							className="rounded-xl border bg-white shadow-sm"
							key={d.toISOString()}
						>
							<div className="sticky top-0 z-10 rounded-t-xl border-b bg-white/80 p-3 backdrop-blur">
								<div className="text-sm font-semibold">{format(d, "EEEE")}</div>
								<div className="text-xs text-neutral-500">
									{format(d, "MMM d, yyyy")}
								</div>
							</div>
							<div className="space-y-2 p-3">
								{list.length === 0 && (
									<div className="rounded-lg border border-dashed p-6 text-center text-xs text-neutral-500">
										No assignments
									</div>
								)}
								{list.map((a) => {
									const cat = catOf(a.categoryId);
									return (
										<div
											className="rounded-lg border p-2 text-xs shadow-sm"
											key={a.id}
											style={{
												borderColor: cat?.color ?? "#e5e7eb",
												backgroundColor: cat ? `${cat.color}10` : "#fff",
											}}
										>
											<div className="font-medium">{a.title}</div>
											<div className="text-neutral-600">
												{memberName(a.memberId)}
											</div>
											<div className="text-neutral-500">
												{format(new Date(a.start), "p")} –{" "}
												{format(new Date(a.end), "p")}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
