/**
 * Responsive Widget Utilities
 *
 * Helper functions for responsive widget behavior
 */

/**
 * Format large numbers with intelligent abbreviation
 * Adapts based on available space
 */
export function formatNumber(
  value: number,
  stage: "full" | "comfortable" | "compact" | "tiny"
): string {
  if (stage === "tiny" || stage === "compact") {
    // Ultra-compact: use K/M abbreviations
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
    }
    return value.toString();
  }

  if (stage === "comfortable") {
    // Compact with commas
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return value.toLocaleString();
    }
    return value.toString();
  }

  // Full: complete with commas
  return value.toLocaleString();
}

/**
 * Format currency with intelligent abbreviation
 */
export function formatCurrency(
  value: number,
  stage: "full" | "comfortable" | "compact" | "tiny"
): string {
  const formatted = formatNumber(value, stage);

  if (stage === "tiny") {
    // Just the number, no symbol
    return formatted;
  }

  return `$${formatted}`;
}

/**
 * Format percentage with adaptive precision
 */
export function formatPercentage(
  value: number,
  stage: "full" | "comfortable" | "compact" | "tiny"
): string {
  if (stage === "tiny" || stage === "compact") {
    return `${Math.round(value)}%`;
  }

  return `${value.toFixed(1)}%`;
}

/**
 * Truncate text based on stage
 */
export function truncateText(
  text: string,
  stage: "full" | "comfortable" | "compact" | "tiny"
): string {
  const maxLengths = {
    full: 100,
    comfortable: 50,
    compact: 20,
    tiny: 10,
  };

  const maxLength = maxLengths[stage];

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}

/**
 * Get adaptive item count for lists
 */
export function getAdaptiveCount(
  totalItems: number,
  stage: "full" | "comfortable" | "compact" | "tiny"
): number {
  const counts = {
    full: Math.min(totalItems, 8),
    comfortable: Math.min(totalItems, 5),
    compact: Math.min(totalItems, 3),
    tiny: Math.min(totalItems, 1),
  };

  return counts[stage];
}

/**
 * Priority sort helper
 * Returns items sorted by priority (top performers, highest values, etc.)
 */
export function prioritySort<T>(
  items: T[],
  getValue: (item: T) => number
): T[] {
  return [...items].sort((a, b) => getValue(b) - getValue(a));
}

/**
 * Container size detector (for use in client components)
 * Returns current responsive stage based on container dimensions
 */
export function detectStage(
  width: number,
  height: number
): "full" | "comfortable" | "compact" | "tiny" {
  // Height is priority
  if (height >= 400 && width >= 300) {
    return "full";
  }
  if (height >= 200 && width >= 200) {
    return "comfortable";
  }
  if (height >= 120 && width >= 120) {
    return "compact";
  }
  return "tiny";
}

/**
 * Get CSS class for trend indicator
 */
export function getTrendClass(value: number): string {
  return value >= 0 ? "text-green-500" : "text-red-500";
}

/**
 * Format rank display (for leaderboards)
 */
export function formatRank(rank: number, stage: "full" | "comfortable" | "compact" | "tiny"): string {
  if (stage === "tiny") {
    return `#${rank}`;
  }

  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}
