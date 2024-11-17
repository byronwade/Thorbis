export function formatDuration(duration: number): string {
	const formatter = new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 3,
		maximumFractionDigits: 3,
	});
	return `${formatter.format(duration)}ms`;
}

export function measurePerformance<T>(fn: () => T): [T, number] {
	const start = performance.now();
	const result = fn();
	const duration = performance.now() - start;
	return [result, duration];
}
