/**
 * Convex Hooks Barrel File
 *
 * Re-exports all Convex hooks for convenient importing
 */

// Auth hooks
export * from "./auth";

// Company hooks
export * from "./companies";
export * from "./use-active-company";

// Core business entity hooks
export * from "./customers";
export * from "./jobs";
export * from "./properties";

// Scheduling hooks
export * from "./appointments";

// Communication hooks
export * from "./communications";

// Asset & equipment hooks
export * from "./equipment";

// Financial hooks
export * from "./estimates";
export * from "./invoices";
export * from "./payments";

// Service & maintenance hooks
export * from "./service-plans";

// Inventory & purchasing hooks
export * from "./price-book";
export * from "./inventory";
export * from "./purchase-orders";
export * from "./vendors";

// Organization hooks
export * from "./tags";
// Note: Team hooks are exported from companies.ts since team operations
// are part of the companies module in Convex
