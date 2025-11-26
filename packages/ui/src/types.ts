// Shared types for @stratos/ui package

export type StatCard = {
	label: string;
	value: number | string;
	change?: number; // Percentage change (e.g., +5.2 or -3.1)
	changeLabel?: string; // Optional label like "vs last week"
	// Legacy chart support
	percentage?: number;
	color?: string;
	data?: Array<{ value: number }>;
};
