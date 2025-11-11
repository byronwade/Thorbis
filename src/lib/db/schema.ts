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
  [key: string]: unknown;
}

export interface Property {
  id: string;
  [key: string]: unknown;
}

export interface Customer {
  id: string;
  [key: string]: unknown;
}

export interface Company {
  id: string;
  [key: string]: unknown;
}

export interface TeamMember {
  id: string;
  [key: string]: unknown;
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
  [key: string]: unknown;
}

export interface KBTag {
  id: string;
  [key: string]: unknown;
}

export interface KBArticle {
  id: string;
  [key: string]: unknown;
}

// Add more types as needed based on your actual Supabase schema
// You can generate these automatically using Supabase CLI:
// npx supabase gen types typescript --project-id <your-project-id> > src/lib/db/supabase-types.ts
