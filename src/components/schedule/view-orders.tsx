"use client";

import { addDays, format, isSameDay, startOfDay } from "date-fns";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Assignment, JobCategory, TeamMember } from "./types";

type OrderCard = {
	id: string;
	title: string;
	groups: {
		title: string;
		items: {
			id: string;
			label: string;
			qty?: string;
			color?: string;
			meta?: string;
		}[];
	}[];
};

export default function OrdersView({
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

	// Build "Order" columns from assignments for each day
	const ordersByDay = React.useMemo(() => {
		const catOf = (id: string) => categories.find((c) => c.id === id);
		const nameOf = (id: string) =>
			members.find((m) => m.id === id)?.name ?? "Unassigned";

		const map = new Map<string, OrderCard[]>();
		for (const d of dayDates) {
			map.set(d.toDateString(), []);
		}

		for (const d of dayDates) {
			const todays = assignments.filter((a) => isSameDay(new Date(a.start), d));
			// Chunk into groups to simulate multiple Orders per day
			const chunkSize = 3;
			for (let i = 0; i < Math.max(1, todays.length); i += chunkSize) {
				const chunk = todays.slice(i, i + chunkSize);
				const id = `ORD-${d.getMonth() + 1}${d.getDate()}-${Math.floor(i / chunkSize) + 1}`;
				const groups: OrderCard["groups"] = [];

				// Create grouped sections, one per category present in this chunk
				const cats = Array.from(new Set(chunk.map((a) => a.categoryId)));
				for (const cid of cats.length ? cats : ["install"]) {
					const cat = catOf(cid);
					const items = (
						chunk.length
							? chunk
							: [
									{
										id: "placeholder",
										title: "Unassigned",
										categoryId: cid,
										memberId: "",
										start: d.toISOString(),
										end: d.toISOString(),
									} as Assignment,
								]
					)
						.filter((a) => a.categoryId === cid)
						.map((a) => ({
							id: a.id,
							label: a.title,
							qty: undefined,
							color: cat?.color,
							meta: `${format(new Date(a.start), "p")} – ${format(new Date(a.end), "p")} • ${nameOf(a.memberId)}`,
						}));
					if (items.length > 0) {
						groups.push({
							title: cat?.name ?? "Work",
							items,
						});
					}
				}

				const card: OrderCard = {
					id,
					title: `Order #${id.slice(-3)}`,
					groups,
				};
				map.get(d.toDateString())?.push(card);
			}
		}
		return map;
	}, [assignments, categories, members, dayDates]);

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-neutral-50/50">
			{/* Date ribbon */}
			<div className="sticky top-0 z-10 border-b bg-white/80 px-4 py-2 backdrop-blur">
				<div className="flex items-center gap-2 overflow-x-auto">
					{dayDates.map((d) => (
						<div
							className="shrink-0 rounded-full border px-3 py-1 text-xs"
							key={d.toISOString()}
						>
							<span className="font-medium">{format(d, "EEE")}</span>
							<span className="ml-2 text-neutral-500">
								{format(d, "MMM d")}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Columns */}
			<div className="min-h-0 flex-1 overflow-auto">
				<div className="grid auto-cols-[360px] grid-flow-col gap-4 p-4">
					{dayDates.map((d) => {
						const orders = ordersByDay.get(d.toDateString()) ?? [];
						return (
							<div className="flex flex-col" key={d.toISOString()}>
								<h3 className="px-1 pb-2 text-xs font-semibold text-neutral-600">
									{"Today's Orders"}{" "}
									<span className="ml-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px]">
										{orders.length}
									</span>
								</h3>

								{orders.length === 0 && (
									<div className="rounded-xl border border-dashed bg-white p-6 text-center text-xs text-neutral-500">
										No orders scheduled
									</div>
								)}

								{orders.map((o) => (
									<div
										className="mb-4 rounded-xl border bg-white shadow-sm"
										key={o.id}
									>
										<div className="flex items-center justify-between rounded-t-xl border-b bg-white/70 px-3 py-2">
											<div className="text-sm font-medium">{o.title}</div>
											<Badge className="text-[10px]" variant="outline">
												1 / 3
											</Badge>
										</div>
										<div className="space-y-3 p-3">
											{o.groups.map((g, gi) => (
												<div
													className="rounded-lg border p-2"
													key={`${o.id}-g${gi}`}
												>
													<div className="mb-2 flex items-center justify-between text-xs">
														<div className="font-medium">{g.title}</div>
														<div className="text-neutral-500">
															{g.items.length} items
														</div>
													</div>
													<div className="space-y-2">
														{g.items.map((it) => (
															<div
																className="rounded-md border px-2 py-2 text-xs shadow-sm"
																key={it.id}
																style={{
																	borderColor: it.color
																		? `${it.color}70`
																		: undefined,
																	backgroundColor: it.color
																		? `${it.color}10`
																		: undefined,
																}}
															>
																<div className="flex items-center gap-2">
																	<div
																		className="h-2 w-2 rounded-full"
																		style={{
																			backgroundColor: it.color ?? "#e5e7eb",
																		}}
																	/>
																	<div className="min-w-0 flex-1">
																		<div className="truncate font-medium">
																			{it.label}
																		</div>
																		{it.meta && (
																			<div className="truncate text-[11px] text-neutral-600">
																				{it.meta}
																			</div>
																		)}
																	</div>
																	{it.qty && (
																		<span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px]">
																			{it.qty}
																		</span>
																	)}
																</div>
															</div>
														))}
													</div>
													<div className="mt-2">
														<Button
															className="w-full justify-center rounded-md text-xs"
															variant="outline"
														>
															Add Truck
														</Button>
													</div>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
