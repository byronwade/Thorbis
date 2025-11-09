import { getAllCustomers } from "@/actions/customers";
import {
  type Customer,
  CustomersTable,
} from "@/components/customers/customers-table";
import { type StatCard, StatsCards } from "@/components/ui/stats-cards";

/**
 * Customers Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real database data from Supabase
 * - Only table component is client-side for interactivity
 * - Statistics rendered on server for better performance
 *
 * Full-width seamless datatable layout with inline statistics
 * - Statistics component above table (full-width, seamless)
 * - Table extends edge-to-edge for seamless appearance
 */

export default async function CustomersPage() {
  // Fetch customers from database
  const result = await getAllCustomers();
  const dbCustomers = result.success ? result.data : [];

  // Transform database records to table format
  const customers: Customer[] = dbCustomers.map((c) => ({
    id: c.id,
    name: c.display_name,
    contact: `${c.first_name} ${c.last_name}`,
    email: c.email,
    phone: c.phone,
    address: c.address,
    city: c.city,
    state: c.state,
    zipCode: c.zip_code,
    status:
      c.status === "active"
        ? "active"
        : c.status === "inactive"
          ? "inactive"
          : "prospect",
    lastService: c.last_job_date
      ? new Date(c.last_job_date).toLocaleDateString()
      : "None",
    nextService: c.next_scheduled_job
      ? new Date(c.next_scheduled_job).toLocaleDateString()
      : "TBD",
    totalValue: c.total_revenue || 0,
  }));

  // Calculate statistics from real data
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const prospectCustomers = customers.filter(
    (c) => c.status === "prospect"
  ).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalValue, 0);

  const customerStats: StatCard[] = [
    {
      label: "Total Customers",
      value: totalCustomers,
      change: 0, // TODO: Calculate from historical data
      changeLabel: "vs last month",
    },
    {
      label: "Active",
      value: activeCustomers,
      change: 0,
      changeLabel: "vs last month",
    },
    {
      label: "Prospects",
      value: prospectCustomers,
      change: 0,
      changeLabel: "vs last month",
    },
    {
      label: "Total Revenue",
      value: `$${(totalRevenue / 100).toLocaleString()}`,
      change: 0,
      changeLabel: "vs last month",
    },
    {
      label: "Avg Customer Value",
      value:
        totalCustomers > 0
          ? `$${(totalRevenue / totalCustomers / 100).toLocaleString()}`
          : "$0",
      change: 0,
      changeLabel: "vs last month",
    },
  ];

  return (
    <>
      {/* Statistics - Rendered on server, no interactivity needed */}
      <StatsCards stats={customerStats} />

      {/* Table - Client component handles interactive features */}
      <div>
        <CustomersTable customers={customers} itemsPerPage={50} />
      </div>
    </>
  );
}
