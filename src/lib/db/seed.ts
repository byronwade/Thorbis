import { db, schema } from "./index";

/**
 * Seed the database with sample data
 * Run with: pnpm db:seed
 */
async function seed() {
  // Create sample users
  const users = await (db as any)
    .insert(schema.users)
    .values([
      {
        name: "Alice Johnson",
        email: "alice@example.com",
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
      },
    ])
    .returning();

  // Create sample posts
  const _posts = await (db as any)
    .insert(schema.posts)
    .values([
      {
        title: "Getting Started with Next.js",
        content:
          "Next.js is a powerful React framework for building web applications...",
        published: "true",
        authorId: users[0].id,
      },
      {
        title: "Introduction to Drizzle ORM",
        content:
          "Drizzle ORM is a TypeScript ORM that is simple and performant...",
        published: "true",
        authorId: users[0].id,
      },
      {
        title: "Draft: Future of Web Development",
        content: "This is a draft post about the future of web development...",
        published: "false",
        authorId: users[1].id,
      },
      {
        title: "Building with Tailwind CSS",
        content:
          "Tailwind CSS is a utility-first CSS framework that makes styling easy...",
        published: "true",
        authorId: users[2].id,
      },
    ])
    .returning();
}

seed()
  .catch((_error) => {
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
