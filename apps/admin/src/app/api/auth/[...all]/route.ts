/**
 * Better Auth API Route Handler for Admin App
 * Handles all auth-related HTTP requests
 */
import { handler } from "@/lib/auth/better-auth/auth-server";

export const { GET, POST } = handler;
