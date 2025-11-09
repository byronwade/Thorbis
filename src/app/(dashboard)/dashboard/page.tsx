"use client";

import { RoleBasedDashboard } from "@/components/dashboard/role-based-dashboard";

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
 * Note: This is a client component because RoleBasedDashboard uses Zustand store
 * which requires client-side state management.
 */
export default function DashboardPage() {
  return <RoleBasedDashboard />;
}
