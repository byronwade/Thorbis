import { RoleBasedDashboard } from "@/components/dashboard/role-based-dashboard";

export const revalidate = 300; // Revalidate every 5 minutes

/**
 * Main Dashboard Page - Role-Based Router
 *
 * Routes users to their appropriate dashboard view based on their role:
 * - Owner: Business financials, profitability, growth metrics
 * - Dispatcher: Real-time operations, technician locations, job assignments
 * - Manager: Team performance, customer satisfaction, operational oversight
 * - Technician: Personal schedule, active jobs, earnings, performance
 * - CSR: Call handling, bookings, customer search, follow-ups
 *
 * Performance optimizations:
 * - Server Components by default for optimal performance
 * - Role-based code splitting reduces initial bundle size
 * - Suspense boundaries for progressive rendering
 * - ISR with 5-minute revalidation
 */
export default function DashboardPage() {
  return <RoleBasedDashboard />;
}
