/**
 * Marketing Page - Leads Management (Development & Production)
 *
 * Full-width seamless datatable layout matching work pages:
 * - Toolbar shows in header with actions
 * - Stats cards appear below toolbar
 * - Table extends edge-to-edge for seamless appearance
 * - Sidebar for navigation between marketing sections
 *
 * Environment behavior:
 * - Development: Full datatable with mock data for testing
 * - Production: Same UI (you can add real data when ready)
 */

import type { Lead } from "@/components/marketing/leads-datatable";
import { LeadsDataTable } from "@/components/marketing/leads-datatable";
import { type StatCard, StatsCards } from "@/components/ui/stats-cards";

// Mock leads data - replace with real data from database
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    source: "google-ads",
    score: "hot",
    stage: "new",
    value: 2500,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastContact: null,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    source: "thumbtack",
    score: "hot",
    stage: "contacted",
    value: 3200,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mdavis@example.com",
    phone: "(555) 345-6789",
    source: "website-form",
    score: "warm",
    stage: "qualified",
    value: 1800,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.w@example.com",
    phone: "(555) 456-7890",
    source: "facebook-ads",
    score: "warm",
    stage: "contacted",
    value: 2100,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "rbrown@example.com",
    phone: "(555) 567-8901",
    source: "referral",
    score: "cold",
    stage: "new",
    value: 1200,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    lastContact: null,
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "landerson@example.com",
    phone: "(555) 678-9012",
    source: "google-ads",
    score: "hot",
    stage: "qualified",
    value: 2800,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "7",
    name: "James Wilson",
    email: "jwilson@example.com",
    phone: "(555) 789-0123",
    source: "thumbtack",
    score: "warm",
    stage: "contacted",
    value: 1950,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "8",
    name: "Patricia Martinez",
    email: "pmartinez@example.com",
    phone: "(555) 890-1234",
    source: "website-form",
    score: "hot",
    stage: "new",
    value: 3500,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    lastContact: null,
  },
];

// Lead statistics data
const leadStats: StatCard[] = [
  {
    label: "Total Leads",
    value: 248,
    change: 20.1,
    changeLabel: "vs last month",
  },
  {
    label: "Hot Leads",
    value: 42,
    change: 31.2,
    changeLabel: "vs last month",
  },
  {
    label: "Qualified",
    value: 87,
    change: 15.4,
    changeLabel: "vs last month",
  },
  {
    label: "Converted",
    value: 28,
    change: 12.0,
    changeLabel: "vs last month",
  },
  {
    label: "Est. Value",
    value: "$52.4k",
    change: 18.7,
    changeLabel: "vs last month",
  },
];

export default function MarketingPage() {
  return (
    <>
      {/* Statistics - Full width, no padding */}
      <StatsCards stats={leadStats} />

      {/* Full-width seamless table (no padding) */}
      <div>
        <LeadsDataTable itemsPerPage={50} leads={mockLeads} />
      </div>
    </>
  );
}
