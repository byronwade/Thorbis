/**
 * Utility Functions Barrel Export
 *
 * Central export point for all utility functions
 */

export * from "./format";
export * from "./badges";
// Export responsive utils with renamed functions to avoid conflicts
export {
  formatNumber as formatNumberResponsive,
  formatCurrency as formatCurrencyResponsive,
  formatPercentage as formatPercentageResponsive,
  truncateText,
  getAdaptiveCount,
  prioritySort,
  detectStage,
  getTrendClass,
  formatRank,
} from "./responsive-utils";
export * from "./activity-tracker";
export * from "./content-diff";
export * from "./invoice-overdue";
export * from "./load-google-maps";
export * from "./scroll-utils";

