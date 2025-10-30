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
 * - Mock data defined on server (will be replaced with real DB queries)
 * - Only table component is client-side for interactivity
 * - Statistics rendered on server for better performance
 *
 * Full-width seamless datatable layout with inline statistics
 * - Statistics component above table (full-width, seamless)
 * - Table extends edge-to-edge for seamless appearance
 */

// Mock data - TODO: Replace with real database query
// This will become: const customers = await db.select().from(customersTable)
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "ABC Corporation",
    contact: "John Smith",
    email: "john@abccorp.com",
    phone: "(555) 123-4567",
    status: "active",
    lastService: "HVAC Maintenance",
    nextService: "2024-02-15",
    totalValue: 245_000,
  },
  {
    id: "2",
    name: "XYZ Industries",
    contact: "Sarah Johnson",
    email: "sarah@xyzind.com",
    phone: "(555) 234-5678",
    status: "active",
    lastService: "Plumbing Repair",
    nextService: "2024-02-20",
    totalValue: 189_000,
  },
  {
    id: "3",
    name: "TechStart Inc",
    contact: "Mike Davis",
    email: "mike@techstart.com",
    phone: "(555) 345-6789",
    status: "prospect",
    lastService: "None",
    nextService: "2024-02-10",
    totalValue: 0,
  },
  {
    id: "4",
    name: "Global Systems",
    contact: "Lisa Wilson",
    email: "lisa@globalsys.com",
    phone: "(555) 456-7890",
    status: "active",
    lastService: "Electrical Service",
    nextService: "2024-02-25",
    totalValue: 320_000,
  },
  {
    id: "5",
    name: "123 Manufacturing",
    contact: "Tom Brown",
    email: "tom@123mfg.com",
    phone: "(555) 567-8901",
    status: "inactive",
    lastService: "Heater Repair",
    nextService: "None",
    totalValue: 85_000,
  },
  {
    id: "6",
    name: "Downtown Retail LLC",
    contact: "Emily Chen",
    email: "emily@dtretail.com",
    phone: "(555) 678-9012",
    status: "active",
    lastService: "AC Installation",
    nextService: "2024-03-01",
    totalValue: 456_000,
  },
  {
    id: "7",
    name: "Medical Plaza Group",
    contact: "Dr. Robert Kim",
    email: "robert@medplaza.com",
    phone: "(555) 789-0123",
    status: "active",
    lastService: "HVAC Maintenance",
    nextService: "2024-02-18",
    totalValue: 678_000,
  },
  {
    id: "8",
    name: "Pacific Restaurants",
    contact: "Maria Garcia",
    email: "maria@pacrest.com",
    phone: "(555) 890-1234",
    status: "prospect",
    lastService: "None",
    nextService: "2024-02-12",
    totalValue: 0,
  },
];

// Customer statistics data
// TODO: Calculate from real database data
const customerStats: StatCard[] = [
  {
    label: "Total Customers",
    value: 8,
    change: 14.3,
    changeLabel: "vs last month",
  },
  {
    label: "Active",
    value: 6,
    change: 20.0,
    changeLabel: "vs last month",
  },
  {
    label: "Prospects",
    value: 2,
    change: 100.0,
    changeLabel: "vs last month",
  },
  {
    label: "This Month",
    value: 23,
    change: 53.3,
    changeLabel: "vs last month",
  },
  {
    label: "Satisfaction",
    value: 4.8,
    change: 6.7,
    changeLabel: "vs last month",
  },
];

export default function CustomersPage() {
  // Server Component: Data is fetched here before rendering
  // No "use client" directive needed - this runs on server
  // CustomersTable component handles client-side interactivity (sorting, filtering, pagination)

  return (
    <>
      {/* Statistics - Rendered on server, no interactivity needed */}
      <StatsCards stats={customerStats} />

      {/* Table - Client component handles interactive features */}
      <div>
        <CustomersTable customers={mockCustomers} itemsPerPage={50} />
      </div>
    </>
  );
}
