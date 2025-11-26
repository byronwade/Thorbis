# Gemini Code Assistant Context

This document provides context for the Gemini Code Assistant to understand the Thorbis project.

## Project Overview

Thorbis is an enterprise-grade field service management platform built with Next.js 16, React 19, and Supabase. It is designed for operational reliability, performance, and real-world workflows including scheduling, communications, billing, and a mobile-first user experience.

### Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **UI**: React 19, Tailwind CSS 4, shadcn/ui
*   **Database**: Supabase (PostgreSQL + Auth + Storage)
*   **State Management**: Zustand
*   **Forms**: React Hook Form + Zod
*   **Payments**: Stripe
*   **Communications**: Telnyx (Voice + SMS)
*   **Email**: Resend + React Email
*   **AI**: Vercel AI SDK (Anthropic, OpenAI, Google, xAI)

## Building and Running

### Initial Setup

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```
2.  **Set up environment variables:**
    ```bash
    cp .env.example .env.local
    ```
    *Edit `.env.local` with your credentials. See `docs/ENVIRONMENT_VARIABLES.md` for a detailed configuration guide.*
3.  **Run database migrations:**
    ```bash
    pnpm db:push
    ```

### Development

*   **Start the development server:**
    ```bash
    pnpm dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

*   **Clean build artifacts and restart the dev server:**
    ```bash
    pnpm dev:clean
    ```

### Production

*   **Build for production:**
    ```bash
    pnpm build
    ```

### Testing and Linting

*   **Lint code:**
    ```bash
    pnpm lint
    ```
*   **Analyze bundle size:**
    ```bash
    pnpm build:analyze
    ```

### Database Commands

*   **Generate migrations:**
    ```bash
    pnpm db:generate
    ```
*   **Push schema changes:**
    ```bash
    pnpm db:push
    ```
*   **Open Drizzle Studio:**
    ```bash
    pnpm db:studio
    ```
*   **Seed the database:**
    ```bash
    pnpm db:seed
    ```

## Development Conventions

*   **Server Components First**: Use Server Components by default; add `"use client"` only for interactive islands.
*   **Server Actions**: Prefer Server Actions over ad-hoc API routes for authenticated mutations.
*   **Schema Changes**: Evolve the Supabase schema via migrations. Run `pnpm db:generate` then `pnpm db:push`.
*   **Security**:
    *   Row Level Security (RLS) is enabled on all tables.
    *   Server-side validation is performed with Zod.
*   **TypeScript**: Strict mode is enabled, and `any` types are not allowed.
*   **Styling**: Use Tailwind CSS for styling.
*   **Components**: Use `shadcn/ui` for UI primitives.
*   **State Management**: Use Zustand for global state.
*   **Forms**: Use React Hook Form with Zod for validation.
