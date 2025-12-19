/**
 * Better Auth API Route Handler
 * Handles all authentication requests at /api/auth/*
 */
import { handler } from "@/lib/auth/auth-server";

export const { GET, POST } = handler;
