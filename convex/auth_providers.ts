/**
 * Convex Auth Configuration
 * Handles user authentication with email/password and OAuth providers
 */
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

const authConfig = convexAuth({
  providers: [
    // Email/Password authentication
    Password({
      // Customize password requirements (must throw Error if invalid)
      validatePasswordRequirements: (password: string): void => {
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters");
        }
        if (!/[A-Z]/.test(password)) {
          throw new Error("Password must contain at least one uppercase letter");
        }
        if (!/[a-z]/.test(password)) {
          throw new Error("Password must contain at least one lowercase letter");
        }
        if (!/[0-9]/.test(password)) {
          throw new Error("Password must contain at least one number");
        }
      },
    }),
    // Google OAuth can be added later by configuring environment variables
    // in the Convex dashboard and uncommenting the provider below
  ],
});

export const { auth, signIn, signOut, store } = authConfig;
export default authConfig;
