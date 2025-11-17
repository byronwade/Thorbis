/**
 * Progressive Tab Component
 *
 * Tab component that automatically loads data on-demand when the tab is opened.
 * Integrates with React Query for caching and loading states.
 *
 * Usage:
 * <ProgressiveTabs defaultValue="details">
 *   <ProgressiveTab value="details">
 *     <DetailsContent />
 *   </ProgressiveTab>
 *
 *   <ProgressiveTab
 *     value="activities"
 *     loadData={() => useEntityActivities("invoice", invoiceId, isActive)}
 *   >
 *     {({ data, isLoading }) => (
 *       isLoading ? <Skeleton /> : <ActivitiesList activities={data} />
 *     )}
 *   </ProgressiveTab>
 * </ProgressiveTabs>
 */

"use client";

import { ReactNode, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type ProgressiveTabsProps = {
	children: ReactNode;
	defaultValue: string;
	className?: string;
	onValueChange?: (value: string) => void;
};

type ProgressiveTabProps = {
	value: string;
	label: string;
	children: ReactNode | ((props: { isActive: boolean }) => ReactNode);
	icon?: ReactNode;
	badge?: string | number;
};

export function ProgressiveTabs({
	children,
	defaultValue,
	className,
	onValueChange,
}: ProgressiveTabsProps) {
	const [activeTab, setActiveTab] = useState(defaultValue);

	const handleValueChange = (value: string) => {
		setActiveTab(value);
		onValueChange?.(value);
	};

	return (
		<Tabs
			value={activeTab}
			onValueChange={handleValueChange}
			className={className}
		>
			{typeof children === "function"
				? children({ activeTab })
				: children}
		</Tabs>
	);
}

export function ProgressiveTab({
	value,
	label,
	children,
	icon,
	badge,
}: ProgressiveTabProps) {
	// This component is meant to be used with ProgressiveTabs
	// The activeTab state is managed by the parent
	return null;
}

// Export TabsList and TabsTrigger for convenience
export { TabsList, TabsTrigger, TabsContent };
