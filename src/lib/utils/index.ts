/**
 * Utility Functions Barrel Export
 *
 * Central export point for all utility functions
 */

export * from "./activity-tracker";
export * from "./badges";
export * from "./content-diff";
export * from "./format";
export * from "./invoice-overdue";
export * from "./load-google-maps";
// Export responsive utils with renamed functions to avoid conflicts
export {
  detectStage,
  formatCurrency as formatCurrencyResponsive,
  formatNumber as formatNumberResponsive,
  formatPercentage as formatPercentageResponsive,
  formatRank,
  getAdaptiveCount,
  getTrendClass,
  prioritySort,
  truncateText,
} from "./responsive-utils";
export * from "./scroll-utils";
