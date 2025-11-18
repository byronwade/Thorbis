/**
 * Progressive Accordion Component
 *
 * Accordion component that loads data on-demand when expanded.
 * Integrates with React Query for caching and automatic refetching.
 *
 * Usage:
 * <ProgressiveAccordion>
 *   <ProgressiveAccordionItem
 *     value="activities"
 *     title="Activity Log"
 *     loadData={(isOpen) => useEntityActivities("job", jobId, isOpen)}
 *   >
 *     {({ data, isLoading }) => (
 *       isLoading ? <Skeleton /> : <ActivitiesList activities={data} />
 *     )}
 *   </ProgressiveAccordionItem>
 *
 *   <ProgressiveAccordionItem value="notes" title="Notes">
 *     <NotesContent /> (No progressive loading)
 *   </ProgressiveAccordionItem>
 * </ProgressiveAccordion>
 */

"use client";

import { type ReactNode, useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

type ProgressiveAccordionProps = {
	children: ReactNode;
	type?: "single" | "multiple";
	defaultValue?: string | string[];
	className?: string;
};

type ProgressiveAccordionItemProps = {
	value: string;
	title: string;
	children: ReactNode | ((props: { isOpen: boolean }) => ReactNode);
	badge?: string | number;
	icon?: ReactNode;
};

export function ProgressiveAccordion({
	children,
	type = "single",
	defaultValue,
	className,
}: ProgressiveAccordionProps) {
	const [openItems, setOpenItems] = useState<string | string[] | undefined>(
		defaultValue,
	);

	return (
		<Accordion
			type={type as "single"}
			value={openItems}
			onValueChange={setOpenItems}
			className={className}
		>
			{typeof children === "function" ? children({ openItems }) : children}
		</Accordion>
	);
}

export function ProgressiveAccordionItem({
	value,
	title,
	children,
	badge,
	icon,
}: ProgressiveAccordionItemProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<AccordionItem value={value}>
			<AccordionTrigger onClick={() => setIsOpen(!isOpen)}>
				<div className="flex items-center gap-2">
					{icon}
					<span>{title}</span>
					{badge && (
						<span className="bg-muted rounded-full px-2 py-0.5 text-xs">
							{badge}
						</span>
					)}
				</div>
			</AccordionTrigger>
			<AccordionContent>
				{typeof children === "function" ? children({ isOpen }) : children}
			</AccordionContent>
		</AccordionItem>
	);
}
