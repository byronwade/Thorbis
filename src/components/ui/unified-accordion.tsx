"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, GripVertical } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type UnifiedAccordionSection = {
	id: string;
	title: string;
	icon?: ReactNode;
	count?: number;
	content: ReactNode;
	defaultOpen?: boolean;
	actions?: ReactNode;
};

type UnifiedAccordionProps = {
	sections: UnifiedAccordionSection[];
	className?: string;
	defaultOpenSection?: string | null;
	/** Unique key for storing user's section order (e.g., "job-details", "customer-details") */
	storageKey?: string;
	/** Enable drag-and-drop reordering (default: true) */
	enableReordering?: boolean;
};

// Helper to get user-specific storage key
function getUserStorageKey(baseKey: string): string {
	// In a real app, you'd get the actual user ID from auth
	// For now, we'll use localStorage which is per-browser-session
	return `accordion-order-${baseKey}`;
}

// Save section order to user preferences
function saveSectionOrder(storageKey: string, order: string[]) {
	if (typeof window === "undefined") {
		return;
	}
	try {
		localStorage.setItem(getUserStorageKey(storageKey), JSON.stringify(order));
	} catch (_error) {}
}

// Load section order from user preferences
function loadSectionOrder(storageKey: string): string[] | null {
	if (typeof window === "undefined") {
		return null;
	}
	try {
		const stored = localStorage.getItem(getUserStorageKey(storageKey));
		return stored ? JSON.parse(stored) : null;
	} catch (_error) {
		return null;
	}
}

// Sortable section item component
function SortableSection({
	section,
	index,
	isOpen,
	isLast,
	shortcutKey,
	showShortcut,
	onToggle,
	isDragging,
}: {
	section: UnifiedAccordionSection;
	index: number;
	isOpen: boolean;
	isLast: boolean;
	shortcutKey: string | null;
	showShortcut: boolean;
	onToggle: () => void;
	isDragging: boolean;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging: isSortableDragging,
	} = useSortable({ id: section.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isSortableDragging ? 0.5 : 1,
	};

	return (
		<div
			className="group relative"
			data-orientation="vertical"
			data-state={isOpen ? "open" : "closed"}
			ref={setNodeRef}
			style={style}
		>
			{/* Drag Handle - Floating to the left outside component */}
			<button
				{...attributes}
				{...listeners}
				className="-left-10 absolute top-0 z-20 flex h-12 cursor-grab items-center justify-center rounded-md bg-muted/40 px-2 opacity-0 shadow-sm transition-all hover:bg-muted hover:opacity-100 active:cursor-grabbing group-hover:opacity-100"
				title="Drag to reorder"
				type="button"
			>
				<GripVertical className="size-4 text-muted-foreground" />
			</button>

			{/* Section Container */}
			<div>
				<div
					className={cn(
						"flex items-center transition-colors",
						!isLast && "border-border/60 border-b",
						isOpen
							? "bg-muted/60"
							: "bg-background/80 hover:bg-muted/40 dark:bg-muted/30",
						isLast && !isOpen && "rounded-b-md",
						isSortableDragging && "shadow-lg ring-2 ring-primary",
					)}
				>
					{/* Section Button */}
					<button
						className={cn(
							"flex h-12 w-full flex-1 items-center gap-2 bg-transparent px-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
							section.actions && "pr-2",
						)}
						data-radix-collection-item=""
						onClick={onToggle}
						type="button"
					>
						<ChevronRight
							className={cn(
								"size-4 flex-shrink-0 transition-transform duration-200 ease-[ease]",
								isOpen && "rotate-90",
							)}
						/>
						{section.icon && (
							<span className="flex flex-shrink-0 items-center text-muted-foreground">
								{section.icon}
							</span>
						)}
						<span className="flex flex-1 items-center gap-2">
							<span className="font-medium text-sm">{section.title}</span>
							{section.count !== undefined && (
								<span className="text-muted-foreground text-xs">
									{section.count}
								</span>
							)}
							{showShortcut && (
								<span
									className="ml-auto hidden rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-opacity group-hover:opacity-100 sm:inline-block sm:opacity-60"
									title={`Press Ctrl+${shortcutKey} to toggle this section`}
								>
									Ctrl+{shortcutKey}
								</span>
							)}
						</span>
					</button>
					{section.actions && (
						<div
							className="flex items-center gap-2 py-2 pr-4"
							onClick={(event) => event.stopPropagation()}
							onKeyDown={(event) => event.stopPropagation()}
						>
							{section.actions}
						</div>
					)}
				</div>
				<div
					className={cn(
						"overflow-hidden will-change-[height]",
						!isLast && "border-border border-b",
						isLast && "rounded-b-md",
					)}
					data-state={isOpen ? "open" : "closed"}
					hidden={!isOpen}
					role="region"
				>
					{section.content}
				</div>
			</div>
		</div>
	);
}

export function UnifiedAccordion({
	sections: initialSections,
	className,
	defaultOpenSection,
	storageKey,
	enableReordering = true,
}: UnifiedAccordionProps) {
	// Initialize sections with user's saved order
	const [sections, setSections] = useState<UnifiedAccordionSection[]>(() => {
		if (!(storageKey && enableReordering)) {
			return initialSections;
		}

		const savedOrder = loadSectionOrder(storageKey);
		if (!savedOrder) {
			return initialSections;
		}

		// Reorder sections based on saved order
		const orderedSections = [...initialSections];
		orderedSections.sort((a, b) => {
			const indexA = savedOrder.indexOf(a.id);
			const indexB = savedOrder.indexOf(b.id);
			// If not in saved order, put at end
			if (indexA === -1) {
				return 1;
			}
			if (indexB === -1) {
				return -1;
			}
			return indexA - indexB;
		});

		return orderedSections;
	});

	const [openSection, setOpenSection] = useState<string | null>(
		defaultOpenSection ?? sections.find((s) => s.defaultOpen)?.id ?? null,
	);

	const [isDragging, setIsDragging] = useState(false);

	// NOTE: Removed redundant useEffect that was causing infinite re-render loops
	// The state is already correctly initialized in the useState callback above (lines 214-240)
	// That initialization handles both regular sections and reordered sections from localStorage
	// Adding a useEffect that watches initialSections causes loops because initialSections
	// is a new array reference on every parent render, triggering setSections(), which causes
	// re-renders, which creates new initialSections, creating an infinite cycle.

	// Sensors for drag and drop
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8, // 8px of movement required before drag starts
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Handle drag end
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		setIsDragging(false);

		if (over && active.id !== over.id) {
			setSections((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				const newOrder = arrayMove(items, oldIndex, newIndex);

				// Save to user preferences
				if (storageKey) {
					saveSectionOrder(
						storageKey,
						newOrder.map((s) => s.id),
					);
				}

				return newOrder;
			});
		}
	}

	// Keyboard shortcuts: Ctrl + 1-9, 0 to toggle sections (cross-platform)
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Only respond to Ctrl key (cross-platform)
			if (!event.ctrlKey) {
				return;
			}

			// Check for number keys 0-9
			const keyNum = Number.parseInt(event.key, 10);
			if (Number.isNaN(keyNum) || keyNum < 0 || keyNum > 9) {
				return;
			}

			// Get the section index (0-based)
			// Ctrl+1 = section 0, Ctrl+2 = section 1, ..., Ctrl+9 = section 8, Ctrl+0 = section 9
			const sectionIndex = keyNum === 0 ? 9 : keyNum - 1;
			if (sectionIndex >= sections.length) {
				return;
			}

			// Prevent default browser behavior
			event.preventDefault();

			// Toggle the section
			const targetSection = sections[sectionIndex];
			if (targetSection) {
				setOpenSection((prev) =>
					prev === targetSection.id ? null : targetSection.id,
				);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [sections]);

	if (!enableReordering) {
		// Render without drag-and-drop if disabled
		return (
			<div
				className={cn(
					"overflow-visible rounded-md bg-muted/50 shadow-sm",
					className,
				)}
			>
				<div className="overflow-visible rounded-b" data-orientation="vertical">
					{sections.map((section, index) => {
						const isOpen = openSection === section.id;
						const isLast = index === sections.length - 1;
						const shortcutKey =
							index < 9 ? (index + 1).toString() : index === 9 ? "0" : null;
						const showShortcut = shortcutKey !== null;

						return (
							<SortableSection
								index={index}
								isDragging={false}
								isLast={isLast}
								isOpen={isOpen}
								key={section.id}
								onToggle={() => setOpenSection(isOpen ? null : section.id)}
								section={section}
								shortcutKey={shortcutKey}
								showShortcut={showShortcut}
							/>
						);
					})}
				</div>
			</div>
		);
	}

	// Render with drag-and-drop
	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			onDragStart={() => setIsDragging(true)}
			sensors={sensors}
		>
			<div
				className={cn(
					"overflow-visible rounded-md bg-muted/50 shadow-sm",
					className,
				)}
			>
				<SortableContext
					items={sections.map((s) => s.id)}
					strategy={verticalListSortingStrategy}
				>
					<div
						className="overflow-visible rounded-b"
						data-orientation="vertical"
					>
						{sections.map((section, index) => {
							const isOpen = openSection === section.id;
							const isLast = index === sections.length - 1;
							const shortcutKey =
								index < 9 ? (index + 1).toString() : index === 9 ? "0" : null;
							const showShortcut = shortcutKey !== null;

							return (
								<SortableSection
									index={index}
									isDragging={isDragging}
									isLast={isLast}
									isOpen={isOpen}
									key={section.id}
									onToggle={() => setOpenSection(isOpen ? null : section.id)}
									section={section}
									shortcutKey={shortcutKey}
									showShortcut={showShortcut}
								/>
							);
						})}
					</div>
				</SortableContext>
			</div>
		</DndContext>
	);
}

// Section content wrapper for consistent padding
export function UnifiedAccordionContent({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={cn("p-4 sm:p-6", className)}>{children}</div>;
}
