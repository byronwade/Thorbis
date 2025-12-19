"use client";

/**
 * Auth Hooks for Convex
 *
 * Provides authentication-related hooks using Convex Auth
 */
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../../../../convex/_generated/api";

/**
 * Get the current authenticated user
 */
export function useCurrentUser() {
  return useQuery(api.auth.getCurrentUser);
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated() {
  return useQuery(api.auth.isAuthenticated);
}

/**
 * Get user's company memberships
 */
export function useUserMemberships() {
  return useQuery(api.auth.getUserMemberships);
}

/**
 * Create or update user mutation
 */
export function useCreateOrUpdateUser() {
  return useMutation(api.auth.createOrUpdateUser);
}

/**
 * Update profile mutation
 */
export function useUpdateProfile() {
  return useMutation(api.auth.updateProfile);
}

/**
 * Verify email mutation
 */
export function useVerifyEmail() {
  return useMutation(api.auth.verifyEmail);
}

/**
 * Get auth actions (signIn, signOut)
 */
export function useAuth() {
  return useAuthActions();
}

/**
 * Sign in with email and password
 */
export function useSignIn() {
  const { signIn } = useAuthActions();

  return async (email: string, password: string) => {
    await signIn("password", { email, password, flow: "signIn" });
  };
}

/**
 * Sign up with email and password
 */
export function useSignUp() {
  const { signIn } = useAuthActions();
  const createOrUpdateUser = useCreateOrUpdateUser();

  return async (email: string, password: string, name?: string) => {
    await signIn("password", { email, password, flow: "signUp" });
    // Create user record after successful sign up
    await createOrUpdateUser({ email, name });
  };
}

/**
 * Sign out
 */
export function useSignOut() {
  const { signOut } = useAuthActions();
  return signOut;
}
