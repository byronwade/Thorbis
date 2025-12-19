/**
 * Convex Hooks Library for the Web App
 *
 * This module provides typed React hooks for interacting with Convex.
 * Import hooks from here to use in your components.
 *
 * @example
 * import { useCustomers, useCreateCustomer } from "@/lib/convex";
 *
 * function MyComponent() {
 *   const customers = useCustomers({ companyId: "..." });
 *   const createCustomer = useCreateCustomer();
 *
 *   return <div>{customers?.map(c => <div key={c._id}>{c.displayName}</div>)}</div>;
 * }
 */

// Re-export hooks
export * from "./hooks/customers";
export * from "./hooks/jobs";
export * from "./hooks/invoices";
export * from "./hooks/estimates";
export * from "./hooks/payments";
export * from "./hooks/appointments";
export * from "./hooks/equipment";
export * from "./hooks/properties";
export * from "./hooks/communications";
export * from "./hooks/team";
export * from "./hooks/service-plans";
export * from "./hooks/price-book";
export * from "./hooks/inventory";
export * from "./hooks/purchase-orders";
export * from "./hooks/vendors";
export * from "./hooks/tags";
export * from "./hooks/auth";

// Re-export utility functions
export * from "./utils";
