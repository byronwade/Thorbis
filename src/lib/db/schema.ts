import { pgTable, text as pgText, timestamp, uuid, boolean as pgBoolean, json as pgJson } from "drizzle-orm/pg-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Users table - works with both SQLite (dev) and PostgreSQL (prod)
 */
export const users = isProduction
  ? pgTable("users", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: pgText("name").notNull(),
      email: pgText("email").notNull().unique(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("users", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      name: text("name").notNull(),
      email: text("email").notNull().unique(),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Example posts table - works with both SQLite (dev) and PostgreSQL (prod)
 */
export const posts = isProduction
  ? pgTable("posts", {
      id: uuid("id").primaryKey().defaultRandom(),
      title: pgText("title").notNull(),
      content: pgText("content").notNull(),
      published: pgText("published").notNull().default("false"),
      authorId: uuid("author_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    })
  : sqliteTable("posts", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      title: text("title").notNull(),
      content: text("content").notNull(),
      published: text("published").notNull().default("false"),
      authorId: text("author_id")
        .notNull()
        .references(() => users.id as any, { onDelete: "cascade" }),
      createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
      updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
    });

/**
 * Chats table - AI chat conversations
 */
export const chats = isProduction
	? pgTable("chats", {
			id: uuid("id").primaryKey().defaultRandom(),
			createdAt: timestamp("created_at").defaultNow().notNull(),
			title: pgText("title").notNull(),
			userId: uuid("user_id")
				.notNull()
				.references(() => users.id as any, { onDelete: "cascade" }),
			visibility: pgText("visibility").notNull().default("private"), // 'public' | 'private'
		})
	: sqliteTable("chats", {
			id: text("id")
				.primaryKey()
				.$defaultFn(() => crypto.randomUUID()),
			createdAt: integer("created_at", { mode: "timestamp" })
				.notNull()
				.$defaultFn(() => new Date()),
			title: text("title").notNull(),
			userId: text("user_id")
				.notNull()
				.references(() => users.id as any, { onDelete: "cascade" }),
			visibility: text("visibility").notNull().default("private"),
		});

/**
 * Messages table - chat messages with parts and attachments
 */
export const messages = isProduction
	? pgTable("messages_v2", {
			id: uuid("id").primaryKey().defaultRandom(),
			chatId: uuid("chat_id")
				.notNull()
				.references(() => chats.id as any, { onDelete: "cascade" }),
			role: pgText("role").notNull(), // 'user' | 'assistant' | 'system'
			parts: pgJson("parts").notNull(), // JSON array of message parts
			attachments: pgJson("attachments").notNull(), // JSON array of attachments
			createdAt: timestamp("created_at").defaultNow().notNull(),
		})
	: sqliteTable("messages_v2", {
			id: text("id")
				.primaryKey()
				.$defaultFn(() => crypto.randomUUID()),
			chatId: text("chat_id")
				.notNull()
				.references(() => chats.id as any, { onDelete: "cascade" }),
			role: text("role").notNull(),
			parts: text("parts").notNull(), // JSON string
			attachments: text("attachments").notNull(), // JSON string
			createdAt: integer("created_at", { mode: "timestamp" })
				.notNull()
				.$defaultFn(() => new Date()),
		});

/**
 * Documents table - artifacts (code, text, images, sheets)
 */
export const documents = isProduction
	? pgTable("documents", {
			id: uuid("id").notNull(),
			createdAt: timestamp("created_at").defaultNow().notNull(),
			title: pgText("title").notNull(),
			content: pgText("content"),
			kind: pgText("kind").notNull().default("text"), // 'text' | 'code' | 'image' | 'sheet'
			userId: uuid("user_id")
				.notNull()
				.references(() => users.id as any, { onDelete: "cascade" }),
		})
	: sqliteTable("documents", {
			id: text("id").notNull(),
			createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
			title: text("title").notNull(),
			content: text("content"),
			kind: text("kind").notNull().default("text"),
			userId: text("user_id")
				.notNull()
				.references(() => users.id as any, { onDelete: "cascade" }),
		});

/**
 * Suggestions table - AI suggestions for documents
 */
export const suggestions = isProduction
	? pgTable("suggestions", {
			id: uuid("id").primaryKey().defaultRandom(),
			documentId: uuid("document_id")
				.notNull()
				.references(() => documents.id as any, { onDelete: "cascade" }),
			originalText: pgText("original_text").notNull(),
			suggestedText: pgText("suggested_text").notNull(),
			description: pgText("description"),
			isResolved: pgBoolean("is_resolved").notNull().default(false),
			userId: uuid("user_id")
				.notNull()
				.references(() => users.id as any, { onDelete: "cascade" }),
			createdAt: timestamp("created_at").defaultNow().notNull(),
		})
	: sqliteTable("suggestions", {
			id: text("id")
				.primaryKey()
				.$defaultFn(() => crypto.randomUUID()),
			documentId: text("document_id")
				.notNull()
				.references(() => documents.id as any, { onDelete: "cascade" }),
			originalText: text("original_text").notNull(),
			suggestedText: text("suggested_text").notNull(),
			description: text("description"),
			isResolved: integer("is_resolved", { mode: "boolean" }).notNull().default(false),
			userId: text("user_id")
				.notNull()
				.references(() => users.id as any, { onDelete: "cascade" }),
			createdAt: integer("created_at", { mode: "timestamp" })
				.notNull()
				.$defaultFn(() => new Date()),
		});

/**
 * Votes table - message voting (upvote/downvote)
 */
export const votes = isProduction
	? pgTable("votes_v2", {
			chatId: uuid("chat_id")
				.notNull()
				.references(() => chats.id as any, { onDelete: "cascade" }),
			messageId: uuid("message_id")
				.notNull()
				.references(() => messages.id as any, { onDelete: "cascade" }),
			isUpvoted: pgBoolean("is_upvoted").notNull(),
		})
	: sqliteTable("votes_v2", {
			chatId: text("chat_id")
				.notNull()
				.references(() => chats.id as any, { onDelete: "cascade" }),
			messageId: text("message_id")
				.notNull()
				.references(() => messages.id as any, { onDelete: "cascade" }),
			isUpvoted: integer("is_upvoted", { mode: "boolean" }).notNull(),
		});

/**
 * Streams table - resumable streams for chat
 */
export const streams = isProduction
	? pgTable("streams", {
			id: uuid("id").primaryKey().defaultRandom(),
			chatId: uuid("chat_id")
				.notNull()
				.references(() => chats.id as any, { onDelete: "cascade" }),
			createdAt: timestamp("created_at").defaultNow().notNull(),
		})
	: sqliteTable("streams", {
			id: text("id")
				.primaryKey()
				.$defaultFn(() => crypto.randomUUID()),
			chatId: text("chat_id")
				.notNull()
				.references(() => chats.id as any, { onDelete: "cascade" }),
			createdAt: integer("created_at", { mode: "timestamp" })
				.notNull()
				.$defaultFn(() => new Date()),
		});

// Export types for use in your application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// Chat types
export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type Suggestion = typeof suggestions.$inferSelect;
export type NewSuggestion = typeof suggestions.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
export type Stream = typeof streams.$inferSelect;
export type NewStream = typeof streams.$inferInsert;
