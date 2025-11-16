/**
 * Performance Measurement Utilities
 *
 * Add timing logs to identify slow operations
 */

export function perfStart(label: string): number {
  const start = performance.now();
  console.log(`[PERF] ${label} - START`);
  return start;
}

export function perfEnd(label: string, start: number): number {
  const duration = performance.now() - start;
  console.log(`[PERF] ${label} - END: ${duration.toFixed(2)}ms`);
  return duration;
}

export async function perfWrap<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = perfStart(label);
  try {
    const result = await fn();
    perfEnd(label, start);
    return result;
  } catch (error) {
    perfEnd(label + " (ERROR)", start);
    throw error;
  }
}
