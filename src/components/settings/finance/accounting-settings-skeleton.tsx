/**
 * Settings > Finance > Accounting Skeleton - Loading State
 *
 * Simple centered spinner skeleton for the accounting integration page.
 */
export function AccountingSettingsSkeleton() {
	return (
		<div className="flex h-[50vh] items-center justify-center">
			<div className="size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
		</div>
	);
}
