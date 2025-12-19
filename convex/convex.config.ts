/**
 * Convex Configuration
 * Registers the Better Auth component for authentication
 */
import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";

const app = defineApp();

// Register Better Auth component
app.use(betterAuth);

export default app;
