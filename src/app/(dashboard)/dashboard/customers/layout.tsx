import type { ReactNode } from "react";
import { CustomersSectionLayout } from "@/components/customers/customers-section-layout";

/**
 * Customers Section Layout - Server Component
 *
 * This layout acts as a wrapper for all routes under /dashboard/customers/*
 * It conditionally applies the main customers layout (sidebar + toolbar)
 * only to the list page, and passes through for detail pages.
 *
 * Performance: Pure server component, no client JS needed for the wrapper
 */
export default function CustomersLayout({ children }: { children: ReactNode }) {
	return <CustomersSectionLayout>{children}</CustomersSectionLayout>;
}
