/**
 * Customer Notes Types
 *
 * Shared types for customer notes system.
 * Separated from server actions to comply with Next.js 16 "use server" restrictions.
 */

export type CustomerNote = {
  id: string;
  company_id: string;
  customer_id: string;
  user_id: string;
  note_type: "customer" | "internal";
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
};
