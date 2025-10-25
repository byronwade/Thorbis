# Database Setup

This project uses **Drizzle ORM** with:
- **SQLite** for local development (fast, no setup required)
- **PostgreSQL (Supabase)** for production

## Quick Start

### 1. Initialize Database

Generate migrations from your schema:

```bash
pnpm db:generate
```

Push schema to database (development):

```bash
pnpm db:push
```

### 2. Seed Database

Populate with sample data:

```bash
pnpm db:seed
```

### 3. View Database

Open Drizzle Studio to browse your data:

```bash
pnpm db:studio
```

This opens a GUI at `https://local.drizzle.studio`

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Generate migration files from schema changes |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:push` | Push schema directly (dev only) |
| `pnpm db:studio` | Open Drizzle Studio GUI |
| `pnpm db:seed` | Populate database with sample data |

## Environment Variables

### Development (SQLite)
No configuration needed! Just run the commands above.

Database file: `local.db` (auto-created)

### Production (Supabase)

1. Create a Supabase project: https://supabase.com/dashboard
2. Get your connection details from: Settings → Database
3. Add to `.env.local`:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Run migrations:

```bash
pnpm db:push
```

## Using the Database

### Import the client

```typescript
import { db, schema } from "@/lib/db";
```

### Query Examples

```typescript
// Get all users
const users = await db.select().from(schema.users);

// Get user by email
const user = await db
  .select()
  .from(schema.users)
  .where(eq(schema.users.email, "alice@example.com"))
  .limit(1);

// Create a user
const newUser = await db
  .insert(schema.users)
  .values({
    name: "John Doe",
    email: "john@example.com",
  })
  .returning();

// Update a user
await db
  .update(schema.users)
  .set({ name: "Jane Doe" })
  .where(eq(schema.users.id, userId));

// Delete a user
await db
  .delete(schema.users)
  .where(eq(schema.users.id, userId));

// Join query
const postsWithAuthors = await db
  .select()
  .from(schema.posts)
  .leftJoin(schema.users, eq(schema.posts.authorId, schema.users.id));
```

### Using TypeScript Types

```typescript
import type { User, NewUser, Post, NewPost } from "@/lib/db";

// Type-safe user creation
const newUser: NewUser = {
  name: "Alice",
  email: "alice@example.com",
};

// Type-safe user query result
const user: User = await db
  .select()
  .from(schema.users)
  .where(eq(schema.users.id, userId))
  .limit(1);
```

## Schema Changes

1. Edit `lib/db/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Review migration in `drizzle/` directory
4. Apply migration: `pnpm db:migrate` or `pnpm db:push`

## Supabase Features

While Drizzle handles the database, you can still use Supabase for:
- **Authentication** - Use Supabase Auth
- **Storage** - File uploads and management
- **Realtime** - Live data subscriptions
- **Edge Functions** - Serverless functions

```typescript
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// Use Supabase Auth
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password",
});
```

## Best Practices

1. **Always use transactions** for related operations
2. **Index frequently queried columns** in production
3. **Use prepared statements** for repeated queries
4. **Test migrations** on staging before production
5. **Keep seed data** realistic and useful

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit Docs](https://orm.drizzle.team/kit-docs/overview)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
