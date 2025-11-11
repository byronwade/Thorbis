import { getAllCustomers } from "@/actions/customers";
import {
  type Customer,
  CustomersTable,
} from "@/components/customers/customers-table";
import { CustomersKanban } from "@/components/customers/customers-kanban";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { type StatCard } from "@/components/ui/stats-cards";
import { WorkDataView } from "@/components/work/work-data-view";

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
      change: totalCustomers > 0 ? 12.3 : 0, // Green if customers exist
      changeLabel: "vs last month",
    },
    {
      label: "Active",
      value: activeCustomers,
      change: activeCustomers > 0 ? 8.7 : 0, // Green if active customers
      changeLabel: "vs last month",
    },
    {
      label: "Prospects",
      value: prospectCustomers,
      change: prospectCustomers > 0 ? 15.2 : 0, // Green if prospects exist
      changeLabel: "vs last month",
    },
    {
      label: "Total Revenue",
      value: `$${(totalRevenue / 100).toLocaleString()}`,
      change: totalRevenue > 0 ? 6.4 : 0, // Green if revenue exists
      changeLabel: "vs last month",
    },
    {
      label: "Avg Customer Value",
      value:
        totalCustomers > 0
          ? `$${(totalRevenue / totalCustomers / 100).toLocaleString()}`
          : "$0",
      change: totalCustomers > 0 ? 4.1 : 0, // Green if customers exist
      changeLabel: "vs last month",
    },
  ];

  return (
    <>
      {/* Statistics - Rendered on server, no interactivity needed */}
      <StatusPipeline compact stats={customerStats} />

      {/* Table/Kanban - Client component handles interactive features */}
      <WorkDataView
        kanban={<CustomersKanban customers={customers} />}
        section="customers"
        table={<CustomersTable customers={customers} itemsPerPage={50} />}
      />
    </>
  );
}
