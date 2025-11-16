"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export default function ResizableDivider({
	width,
	setWidth,
	min = 220,
	max = 520,
}: {
	width: number;
	setWidth: (n: number) => void;
	min?: number;
	max?: number;
}) {
	const [dragging, setDragging] = React.useState(false);

	React.useEffect(() => {
		function onMove(e: MouseEvent) {
			if (!dragging) {
				return;
			}
			// Sidebar width measured from viewport left works well for a top-level layout.
			const next = Math.min(max, Math.max(min, e.clientX));
			setWidth(next);
		}
		function onUp() {
			setDragging(false);
		}
		window.addEventListener("mousemove", onMove, { passive: true });
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
	}, [dragging, max, min, setWidth]);

	return (
		<div
			aria-label="Resize team panel"
			aria-orientation="vertical"
			className={cn(
				"group relative z-20 grid w-3 cursor-col-resize place-items-center",
				"bg-transparent hover:bg-neutral-100",
			)}
			onKeyDown={(e) => {
				if (e.key === "ArrowLeft") {
					setWidth(Math.max(min, width - 10));
				}
				if (e.key === "ArrowRight") {
					setWidth(Math.min(max, width + 10));
				}
			}}
			onMouseDown={() => setDragging(true)}
			role="separator"
			tabIndex={0}
			title="Drag to resize"
		>
			{/* Track */}
			<div className="pointer-events-none absolute inset-y-0 left-1.5 w-[2px] bg-neutral-200 group-hover:bg-neutral-300" />
			{/* Thumb */}
			<div className="pointer-events-none z-10 grid size-5 place-items-center rounded-full border bg-white shadow-sm">
				<div className="h-3 w-[2px] rounded bg-neutral-300" />
			</div>
		</div>
	);
}
