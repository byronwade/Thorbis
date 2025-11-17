"use client";

import { addDays, compareAsc, format, startOfDay } from "date-fns";
import * as React from "react";
import type { Assignment, JobCategory, TeamMember } from "./types";

export default function ListView({
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
	const rangeStart = startOfDay(date);
	const rangeEnd = addDays(rangeStart, days);
	const rows = React.useMemo(
		() =>
			assignments
				.filter((a) => {
					const s = new Date(a.start);
					return s >= rangeStart && s < rangeEnd;
				})
				.sort((a, b) => compareAsc(new Date(a.start), new Date(b.start))),
		[assignments, rangeStart, rangeEnd]
	);

	function catOf(id: string) {
		return categories.find((c) => c.id === id);
	}
	function memberName(id: string) {
		return members.find((m) => m.id === id)?.name ?? "Unknown";
	}

	return (
		<div className="flex min-h-0 flex-1 overflow-auto">
			<div className="w-full p-4">
				<div className="overflow-hidden rounded-xl border bg-white shadow-sm">
					<table className="w-full border-collapse text-sm">
						<thead className="sticky top-0 z-10 bg-white/80 backdrop-blur">
							<tr className="border-b text-left text-xs text-neutral-600">
								<th className="px-3 py-2 font-medium">Date</th>
								<th className="px-3 py-2 font-medium">Time</th>
								<th className="px-3 py-2 font-medium">Title</th>
								<th className="px-3 py-2 font-medium">Category</th>
								<th className="px-3 py-2 font-medium">Assignee</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((a) => {
								const cat = catOf(a.categoryId);
								return (
									<tr className="border-b last:border-0" key={a.id}>
										<td className="px-3 py-2">{format(new Date(a.start), "EEE, MMM d")}</td>
										<td className="px-3 py-2 text-neutral-600">
											{format(new Date(a.start), "p")} – {format(new Date(a.end), "p")}
										</td>
										<td className="px-3 py-2">{a.title}</td>
										<td className="px-3 py-2">
											<span className="inline-flex items-center gap-2">
												<span
													className="inline-block size-2 rounded-full"
													style={{ backgroundColor: cat?.color ?? "#e5e7eb" }}
												/>
												{cat?.name ?? "—"}
											</span>
										</td>
										<td className="px-3 py-2">{memberName(a.memberId)}</td>
									</tr>
								);
							})}
							{rows.length === 0 && (
								<tr>
									<td className="px-3 py-6 text-center text-xs text-neutral-500" colSpan={5}>
										No assignments in range
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
