/**
 * Database Schema Types
 *
 * NOTE: This file previously used Drizzle ORM for schema definitions.
 * It has been converted to use Supabase directly.
 *
 * TODO: This file needs to be fully converted to TypeScript types/interfaces
 * that match your Supabase database schema. You can:
 * 1. Use Supabase's type generation: `npx supabase gen types typescript --project-id <your-project-id>`
 * 2. Or manually define TypeScript interfaces based on your Supabase tables
 *
 * For now, common types are exported below. Update as needed.
 */

// ============================================================================
// Basic Types (commonly used)
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
  emailVerified?: boolean | null;
  lastLoginAt?: Date | string | null;
  isActive?: boolean | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

export interface NewUser {
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
  emailVerified?: boolean | null;
  lastLoginAt?: Date | string | null;
  isActive?: boolean | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

export interface NewPost {
  title: string;
  content: string;
  published: boolean;
  authorId: string;
}

// ============================================================================
// Additional Types (add more as needed based on your Supabase schema)
// ============================================================================

export interface Job {
  id: string;
  jobNumber?: string | number | null;
  jobType?: string | null;
  title?: string | null;
  status?: string | null;
  priority?: string | null;
  description?: string | null;
  aiServiceType?: string | null;
  aiPriorityScore?: number | null;
  aiTags?: string[] | string | null;
  aiCategories?: string[] | string | null;
  aiEquipment?: string[] | string | null;
  totalAmount?: number | null;
  paidAmount?: number | null;
  scheduledStart?: string | Date | null;
  scheduledEnd?: string | Date | null;
  notes?: string | null;
  createdAt?: string | Date | null;
  actualStart?: string | Date | null;
  actualEnd?: string | Date | null;
  updatedAt?: string | Date | null;
}

export interface Property {
  id: string;
  name?: string | null;
  address?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  zipCode?: string | null;
  country?: string | null;
  propertyType?: string | null;
  property_type?: string | null;
  squareFootage?: number | null;
  square_footage?: number | null;
  yearBuilt?: number | null;
  year_built?: number | null;
  notes?: string | null;
  lat?: number | null;
  lon?: number | null;
  archived_at?: string | null;
  deleted_at?: string | null;
}

export interface Customer {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
}

export interface Company {
  id: string;
}

export interface TeamMember {
  id: string;
}

export interface VerificationToken {
  id: string;
  token: string;
  email: string;
  type: "email_verification" | "password_reset" | "magic_link";
  userId?: string | null;
  expiresAt: Date | string;
  used: boolean;
  usedAt?: Date | string | null;
  createdAt?: Date | string | null;
}

export interface NewVerificationToken {
  token: string;
  email: string;
  type: "email_verification" | "password_reset" | "magic_link";
  userId?: string | null;
  expiresAt: Date | string;
  used?: boolean;
}

// Knowledge Base Types
export interface KBCategory {
  id: string;
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  order?: number;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface KBTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface KBArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category_id: string;
  featured?: boolean;
  published?: boolean;
  published_at?: string;
  updated_at?: string;
  author?: string;
  featured_image?: string;
  views?: number;
  helpful_count?: number;
  created_at: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[] | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

// Add more types as needed based on your actual Supabase schema
// You can generate these automatically using Supabase CLI:
// npx supabase gen types typescript --project-id <your-project-id> > src/lib/db/supabase-types.ts
