/**
 * Customer Badges Types & Constants
 *
 * Shared types and constants for customer badge system.
 * Separated from server actions to comply with Next.js 16 "use server" restrictions.
 */

export type CustomerBadge = {
  id: string;
  company_id: string;
  customer_id: string;
  badge_type: "custom" | "premade" | "auto_generated";
  label: string;
  variant:
    | "default"
    | "destructive"
    | "warning"
    | "success"
    | "secondary"
    | "outline";
  icon?: string;
  auto_generated_key?: string;
  metadata?: any;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Premade badge definitions
export const PREMADE_BADGES = [
  {
    label: "DO NOT SERVICE",
    variant: "destructive" as const,
    icon: "AlertTriangle",
  },
  { label: "VIP Customer", variant: "success" as const, icon: "Star" },
  { label: "Payment Plan", variant: "warning" as const, icon: "Calendar" },
  { label: "Tax Exempt", variant: "secondary" as const, icon: "Receipt" },
  {
    label: "Warranty Active",
    variant: "success" as const,
    icon: "ShieldCheck",
  },
  { label: "Service Contract", variant: "default" as const, icon: "FileCheck" },
  { label: "Preferred Customer", variant: "success" as const, icon: "Heart" },
  { label: "New Customer", variant: "default" as const, icon: "UserPlus" },
];
