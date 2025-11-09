/**
 * Job Notes Types
 *
 * Shared types for job notes system.
 * Separated from server actions to comply with Next.js 16 "use server" restrictions.
 */

export interface JobNote {
  id: string;
  company_id: string;
  job_id: string;
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
}
