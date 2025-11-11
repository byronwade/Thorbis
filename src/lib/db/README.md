# Database Setup

This project uses **Supabase** directly for all database operations.

## Quick Start

### 1. Supabase Setup

1. Create a Supabase project: https://supabase.com/dashboard
2. Get your connection details from: Settings → Database
3. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Database Migrations

Use Supabase migrations directly. Migrations are located in `supabase/migrations/`.

To apply migrations:
```bash
# Using Supabase CLI
supabase db push
```

### 3. Generate TypeScript Types

Generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/lib/db/supabase-types.ts
```

Or use the Supabase dashboard to generate types.

## Using the Database

### Import the Supabase client

```typescript
import { getSupabaseClient } from "@/lib/db";

// In Server Components or Server Actions
const supabase = await getSupabaseClient();
```

### Query Examples

```typescript
// Get all users
const { data: users, error } = await supabase
  .from("users")
  .select("*");

// Get user by email
const { data: user, error } = await supabase
  .from("users")
  .select("*")
  .eq("email", "alice@example.com")
  .single();

// Create a user
const { data: newUser, error } = await supabase
  .from("users")
  .insert({
    name: "Alice",
    email: "alice@example.com",
  })
  .select()
  .single();

// Update a user
const { data: updatedUser, error } = await supabase
  .from("users")
  .update({ name: "Alice Johnson" })
  .eq("id", userId)
  .select()
  .single();

// Delete a user
const { error } = await supabase
  .from("users")
  .delete()
  .eq("id", userId);
```

## TypeScript Types

Type definitions are in `src/lib/db/schema.ts`. For the most up-to-date types, generate them from your Supabase schema:

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/lib/db/supabase-types.ts
```

## Row Level Security (RLS)

Make sure to enable RLS policies on all tables in Supabase. This is critical for security.

## Notes

- This project previously used Drizzle ORM but has been migrated to use Supabase directly
- All database operations should use the Supabase client
- Use Supabase migrations for schema changes
- Generate types from Supabase schema for TypeScript support
