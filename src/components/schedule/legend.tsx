"use client";

import type { JobCategory } from "./types";

export default function SchedulerLegend({
  categories,
}: {
  categories: JobCategory[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      {categories.map((c) => (
        <div
          className="inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1 shadow-sm"
          key={c.id}
        >
          <span
            aria-hidden
            className="inline-block size-2 rounded-full"
            style={{ backgroundColor: c.color }}
          />
          <span className="font-medium">{c.name}</span>
        </div>
      ))}
      <div className="ml-auto text-neutral-500">
        Drag to create • Drag block to move • Resize edges to adjust
      </div>
    </div>
  );
}
